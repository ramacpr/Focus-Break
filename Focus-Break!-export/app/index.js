import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { vibration } from "haptics";
import { display } from "display";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const breakLabel = document.getElementById("breakLabel");

// operationa from 9AM to 6PM
var startTime = 9; 
var endTime = 18;

var workTimeInSec = 45 * 60; 
var breakTimeInSec = 15 * 60;
var currSecCount = 0;
var toggle = 0;

var isFoucusPeriod = false;
var vibCount = 0; 
var canVibrate = false; 

var myfunc = setInterval(function() { 
   myLabel.text = `10:45`;
  breakLabel.text = `Take a break!`;
    breakLabel.style.fill = 'red';
   
  
  
  if(isFoucusPeriod == false)
   return;
  
  // increment the counter 
  currSecCount = currSecCount + 1;
  vibCount = (vibCount + 1) % 5; // vibrate for 5 seconds 
  
  if(vibCount == 0){
    vibration.stop();
  }
  
  if(currSecCount == 1){
    breakLabel.text = `Time to focus!`;
    breakLabel.style.fill = 'green';
    vibCount = 0; 
    vibration.start("ring");
    display.poke();
  }
  else if(currSecCount == workTimeInSec + 1) {
    breakLabel.text = `Take a break!`;
    breakLabel.style.fill = 'red';
    vibCount = 0; 
    vibration.start("ring");
    display.poke();
  }
  else if(currSecCount == workTimeInSec + breakTimeInSec + 1)
    currSecCount = 0;  
  
    
}, 1000)

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  let hrs24 = util.zeroPad(hours);
  
  if(hrs24 == startTime)
    isFoucusPeriod = true;
  else if(hrs24 == endTime)
    isFoucusPeriod = false;
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = hrs24;
  }
  let mins = util.zeroPad(today.getMinutes());

  myLabel.text = `${hours}:${mins}`;
}
