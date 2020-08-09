import * as messaging from "messaging";
import { settingsStorage } from "settings";

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  restoreSettings();
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("Companion Socket Closed");
};

// A user changes settings
settingsStorage.onchange = evt => {
  // if the change is made for end date,
  // check if it is in range, if not set it back to default. 
  
  if(evt.key == "workEndTime") {
    console.log(`Work end time modified`);  
    if(validateWorkHrs() == false){
      resetWorkHrs(); 
      sendMsgToLog("Invalid time range entered by user. Setting to default.");
      return; // dont notify app
    }
  }  
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  sendVal(data);
};

function sendMsgToLog(logString){
  let data = {
    key: "ConsoleLog",
    newValue: logString
  };
  sendVal(data);
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let data = {
        key: key,
        newValue: settingsStorage.getItem(key)
      };
      sendVal(data);
    }
  }
}

function validateWorkHrs(){
  let startTime = JSON.parse(settingsStorage.getItem("workStartTime")).name; 
  let endTime = JSON.parse(settingsStorage.getItem("workEndTime")).name; 
  let sHr = startTime.substr(0, 2); 
  let sMin = startTime.substr(3, 2);
  let eHr = endTime.substr(0,2);
  let eMin = endTime.substr(3, 2);
  
  // the start and end time hours cannot be equal!!!
  if(sHr == eHr)
    return false; 
  return true;
}
function resetWorkHrs(){
  settingsStorage.setItem("workStartTime", "09:00");
  settingsStorage.setItem("workEndTime", "18:00");  
}

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}
