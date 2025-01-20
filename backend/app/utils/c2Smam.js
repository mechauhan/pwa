const fetch = require("node-fetch");

//write this code in your .gs file
//Your authentication key
var authKey = "342097AUDliyeLj5f650c6eP1";

//Multiple mobiles numbers separated by comma
var mobileNumber = "9541130008";

//Sender ID,While using route4 sender id should be 6 characters long.
var senderId = "CAREAT";

//Your message to send, Add URL encoding here.
var message = "Test message";

//Define route
var route = "default";


var payload = {
        authkey: authKey,
        mobiles : mobileNumber,
        message : message,
        sender : senderId,
        route : route
};

var options = {
    method: "post",
    body: JSON.stringify(payload),
	headers: {'Content-Type': 'application/json'}
};

var res = await fetch("http://control.c2sms.com/api/sendhttp.php?", options);
console.log(res);
