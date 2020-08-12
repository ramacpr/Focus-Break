import clock from "clock";
import document from "document";
import * as util from "../common/utils";
import * as messaging from "messaging";
import { vibration } from "haptics";
import { display } from "display";

// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const breakLabel = document.getElementById("breakLabel");
let background = document.getElementById("background");
let countdown = document.getElementById("countdown");


// main timer variables
var workTimeInSec = 45 * 60; 
var focusCountDown = workTimeInSec; 
var breakTimeInSec = 15 * 60;
var isFoucusPeriod = false;
var breakCountDown = breakTimeInSec;

// time format toggle variable 
var is12HrFormat = false;

// feature to enter custom start and end time for 
// work hours (all other time out of this range is life mode (in v3.0.0))
var workStartTimeHr = 9; 
var workStartTimeMin = 0; 
var workEndTimeHr = 18;
var workEndTimeMin = 0;

// test messages 
var focusModeMsg = "Time to focus!";
var breakModeMsg = "Take a break!";
var isFocusMode = true;
var focusTxtColor = "green";
var breakTxtColor = "red";
var focusBackClr = "black";
var breakBackClr = "black";
var focusTimeClr = "white";
var breakTimeClr = "white";

var isInitialized = false; 
var FocusTimer;
var BreakTimer;

var onPaint = setInterval(function(){
  if(isFoucusPeriod == true){
    if(isFocusMode == true){
      focusModeWatchFace();
    }
    else{
      breakModeWatchFace();
    }
  }
  else{
    defaultWatchFace();
  }
  
}, 1000);



function onFocusTimerEllapsed(){
  clearInterval(FocusTimer);
  if(isFoucusPeriod == true){
    isFocusMode = false;
    BreakTimer = setInterval(onBreakTimerEllapsed, breakTimeInSec * 1000);
  }
  focusCountDown = workTimeInSec;
}

function onBreakTimerEllapsed(){
  clearInterval(BreakTimer);
  if(isFoucusPeriod == true){
    isFocusMode = true;
    FocusTimer = setInterval(onFocusTimerEllapsed, workTimeInSec * 1000);
  }
  breakCountDown = breakTimeInSec;
}

function InitializeFocusBreak(){
  if(isInitialized == false){
    FocusTimer = setInterval(onFocusTimerEllapsed, workTimeInSec * 1000);
    isInitialized = true;
  }  
}

function forceStopTimer(){
  clearInterval(FocusTimer);
  clearInterval(BreakTimer);
}

function focusModeWatchFace(){
  if(isFoucusPeriod == true){
    breakLabel.text = focusModeMsg;
    breakLabel.style.fill = focusTxtColor;
    background.style.fill = focusBackClr;
    myLabel.style.fill = focusTimeClr; 
    /*countdown.text = focusCountDown;
    focusCountDown = focusCountDown - 1;*/
  }
}

function breakModeWatchFace(){
  if(isFoucusPeriod == true){
  breakLabel.text = breakModeMsg;
  breakLabel.style.fill = breakTxtColor;
  background.style.fill = breakBackClr;
  myLabel.style.fill = breakTimeClr;
    /*countdown.text = breakCountDown;
    breakCountDown = breakCountDown - 1;*/
  }
}

function defaultWatchFace(){
  if(isFoucusPeriod == false){
  breakLabel.text = ""; 
  background.style.fill = "black";
  myLabel.style.fill = "white"; 
  }
}

function notifyFBModeChange(){
  if(isFoucusPeriod == true){
  display.poke(); 
  vibration.start("ring"); 
  setTimeout(() => {vibration.stop()}, 5000);  
  }
}

function isWorkTime(hrs24, mins){  
  console.log(`1`);  
  // case 1: start time is lesser than end time (9-18)
  if(workStartTimeHr < workEndTimeHr){
    console.log(`2`); 
    if(workStartTimeHr == hrs24 || workEndTimeHr == hrs24){
      console.log(`3`); 
      // check if minutes are in range
      if((workStartTimeHr == hrs24 && mins >= workStartTimeMin) || 
         (workEndTimeHr == hrs24 && mins <= workEndTimeMin)) {
        console.log(`4`); 
        return true; // WORK TIME
      }
    }
    else if(workStartTimeHr < hrs24 && hrs24 < workEndTimeHr){
      console.log(`5`); 
      return true; // WORK TIME
    }
    else{
      console.log(`6`); 
      return false; //WORK TIME OVER
    }
  }  
  
  // case 2: start time is greater than end time (21-2)
  else if(workStartTimeHr > workEndTimeHr){
    console.log(`7`); 
    // we have 2 comparison ranges 
    // range 1: workStartTimeHr - 23
    // range 2: 0 - workEndTimeHr
    // if the current time is in either of the ranges it is work mode
    
    if(workStartTimeHr == hrs24 || workEndTimeHr == hrs24){ // check for minutes
      console.log(`8`);
       if((workStartTimeHr == hrs24 && mins >= workStartTimeMin) || 
         (workEndTimeHr == hrs24 && mins <= workEndTimeMin)) {
         console.log(`9`); 
        return true; // WORK TIME
       }
    }
    else if((workStartTimeHr < hrs24 && hrs24 <= 23) || // range 1
           (hrs24 >= 0 && hrs24 < workEndTimeHr)) { //range 2
      console.log(`10`); 
      return true; // work mode (range 1)
    }
    else {
      console.log(`11`); 
      return false;
    }
  }
  
  // case 3: start and end hrs are same is an invalid scenario, 
  // already handled in companion layer.
  console.log(`12`); 
  return false;  
};

// Update the <text> element every tick with the current time
clock.ontick = (evt) => { 
  let today = evt.date;
  let hours = today.getHours();
  let hrs24 = util.zeroPad(hours);
  let mins = util.zeroPad(today.getMinutes());
  
  if(isWorkTime(hrs24, mins) == true) {
    console.log(`focus period true`);
    isFoucusPeriod = true;
    if(isInitialized == false){
      console.log(`Initializing focus timer`);
      InitializeFocusBreak(); 
      isInitialized = true;
    }
  }    
  else {
    console.log(`focus period false`);
    forceStopTimer();
    isFoucusPeriod = false;
  }    
  
  if (is12HrFormat == true) { // 12h format    
    hours = hours % 12 || 12;
  } else { // 24h format    
    hours = hrs24;
  }
  
  myLabel.text = `${hours}:${mins}`;
}

// The message handlers
// Message is received.
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  
  // check if message was sent for console logging!
  if(evt.data.key == "ConsoleLog"){
    console.log(`${evt.data.value}`);
  }
  
  // setting received for time toggle
  if (evt.data.key === "timeFormatToggle" && evt.data.newValue) {
    is12HrFormat = JSON.parse(evt.data.newValue);
    console.log(`Time format toggle (is 12Hrs) changed to: ${is12HrFormat}`);    
  }
  
  // work time start-end
  if (evt.data.key === "workStartTime" && evt.data.newValue) {
    let workStartTime = evt.data.newValue;
    workStartTimeHr = workStartTime.substr(20, 2);
    workStartTimeMin = workStartTime.substr(23, 2);
    console.log(`Work mode start time: ${workStartTimeHr}:${workStartTimeMin}`);    
  }
  if (evt.data.key === "workEndTime" && evt.data.newValue) {
    let workEndTime = evt.data.newValue;
    workEndTimeHr = workEndTime.substr(20, 2);
    workEndTimeMin = workEndTime.substr(23, 2);
    console.log(`Work mode end  time: ${workEndTimeHr}:${workEndTimeMin}`);  
  }
  
  // custome messages for focus and break mode
  if (evt.data.key === "focusText" && evt.data.newValue) {
    focusModeMsg = JSON.parse(evt.data.newValue).name;
    if(isFocusMode == true)
      breakLabel.text = focusModeMsg;
    console.log(`User focus msg: ${focusModeMsg}`); 
  }
  if (evt.data.key === "breakText" && evt.data.newValue) {
    breakModeMsg = JSON.parse(evt.data.newValue).name;    
    if(isFocusMode == false)
      breakLabel.text = breakModeMsg;
    console.log(`User break msg: ${breakModeMsg}`);  
  }
  
  // color updates
  // Updating bacground color in focus and break modes
  if (evt.data.key === "f_backColor" && evt.data.newValue) {
    focusBackClr = JSON.parse(evt.data.newValue);
    if(isFocusMode == true)
      background.style.fill = focusBackClr;
    console.log(`New focus mode back color: ${focusBackClr}`);    
  }
  if (evt.data.key === "b_backColor" && evt.data.newValue) {
    breakBackClr = JSON.parse(evt.data.newValue);    
    if(isFocusMode == false)
      background.style.fill = breakBackClr;
    console.log(`New break mode back color: ${breakBackClr}`);  
  }
  
  // updating the time text color 
  if (evt.data.key === "f_timeColor" && evt.data.newValue) {
    focusTimeClr = JSON.parse(evt.data.newValue);   
    if(isFocusMode == true)
      myLabel.style.fill = focusTimeClr;
    console.log(`New time focus mode back color: ${focusTimeClr}`);  
  }
  if (evt.data.key === "b_timeColor" && evt.data.newValue) {
    breakTimeClr = JSON.parse(evt.data.newValue);   
    if(isFocusMode == false)
      myLabel.style.fill = breakTimeClr;
    console.log(`New time break mode back color: ${breakTimeClr}`);  
  }
  
  // updating the message text color in focus and break modes
  if (evt.data.key === "f_msgColor" && evt.data.newValue) {
    focusTxtColor = JSON.parse(evt.data.newValue);   
    if(isFocusMode == true)
      breakLabel.style.fill = focusTxtColor;
    console.log(`New focus mode msg color: ${focusTxtColor}`);  
  }
  if (evt.data.key === "b_msgColor" && evt.data.newValue) {
    breakTxtColor = JSON.parse(evt.data.newValue);   
    if(isFocusMode == true)
      breakLabel.style.fill = breakTxtColor;
    console.log(`New break mode msg color: ${breakTxtColor}`);  
  }
  
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};