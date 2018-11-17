  
  
// Initialize Firebase
var config = {
apiKey: "AIzaSyAGAhaC7nIXYdXfql1p3bpjPT8vCfQaAxQ",
authDomain: "project1-test-triptracker.firebaseapp.com",
databaseURL: "https://project1-test-triptracker.firebaseio.com",
projectId: "project1-test-triptracker",
storageBucket: "project1-test-triptracker.appspot.com",
messagingSenderId: "158304705795"
};
firebase.initializeApp(config);

var database = firebase.database();
var id;

$(document).ready( function() {
    console.log("Document loaded.")
    var ref = database.ref();
    console.log("Ref: ");
    console.log(ref);
    console.log("-----------------");
    //Generate random 16 digit string - ensure leading 0 isn't cut off
    var randomid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10);
    //Convery 16 digit string to number
    id = parseInt(randomid, 10);
    console.log("id is: "+id);
    console.log(typeof id);
});

$("#add-employee-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var empName = $("#employee-name-input").val().trim();
    var empRole = $("#role-input").val().trim();
    var empRate = $("#rate-input").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newEmp = {
      name: empName,
      role: empRole,
      rate: empRate
    };
  
    // Uploads employee data to the database
    database.ref('plan/' + id).push(newEmp);
  
    // Logs everything to console
    console.log(newEmp.name);
    console.log(newEmp.role);
    console.log(newEmp.rate);
  
    alert("Employee successfully added");
  
    // Clears all of the text-boxes
    $("#employee-name-input").val("");
    $("#role-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");
  });

$("#loadPlan").on("click", function(event) {
    event.preventDefault();

    var loadId = $("#loadId").val().trim();

    database.ref('plan/' + loadId + '/').once('value').then(function(snapshot){
        console.log(snapshot.val());
        console.log('---------');
        console.log(snapshot.val().name);
    })
});