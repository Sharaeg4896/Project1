$(window).on('load',function(){
    $('#startupModal').modal('show');
});

var config = {
    apiKey: "AIzaSyARlnMGHgxtadNrOY2BUVIdkG9DCJKjx20",
    authDomain: "project1-a1146.firebaseapp.com",
    databaseURL: "https://project1-a1146.firebaseio.com",
    projectId: "project1-a1146",
    storageBucket: "project1-a1146.appspot.com",
    messagingSenderId: "451892561933"
};
firebase.initializeApp(config);

var dbRef = firebase.database();
var entryRef = dbRef.ref('itineraries');

$(document).ready( function () {
    // Event listener for translating user input data into the Trip Planner Entries (TPE) card
    $("#entrySubmit").on("click", function(event) {
        event.preventDefault();
        
        var dateFormat = "MM/DD/YYYY";

        // Entries in the form are stored in variables
        var dest = $("#destInput").val().trim();
        var sDate = $("#start-date").val().trim();
        var eDate = $("#end-date").val().trim();

        // Reconverts date & time format using momentJS
        var startD = moment(sDate, dateFormat).format("MMM Do YYYY");
        var endD = moment(eDate, dateFormat).format("MMM Do YYYY");

        // Creating new entries for the TPE card
        var newEntry = $("<tr>");
        $("#newEntryList").append(newEntry);

        entryRef.push(obj);

        // Summited info is converted to be displayed in TPE card
        var destEntryItem = $("<td>").text(dest);
        var sDateEntryItem = $("<td>").text(startD);
        var eDateEntryItem = $("<td>").text(endD);
        
        destEntryItem.attr("scope", "col");
        sDateEntryItem.attr("scope", "col");
        eDateEntryItem.attr("scope", "col");

        // Submitted info appended to the new entry for the TPE card
        newEntry.append(destEntryItem);
        newEntry.append(sDateEntryItem);
        newEntry.append(eDateEntryItem);

        $("#destInput").val('');
        $("#datepicker1").val('');
        $("#datepicker2").val('');
    });

    // Show hidden div after pressing "Create New Itinerary ID" button
    $("#showDiv").on("click", function (){
        var x = document.getElementById("activeDiv");
        
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    });
})





//load older conatcts as well as any newly added one...
entryRef.on("child_added", function(snap) {
    console.log("added", snap.key, snap.val());
    $('#newEntryList').append(contactHtmlFromObject(snap.val()));
  });


$("#load-entry").on("click", function(event) {
    event.preventDefault();

    // Pulls the existing itinerary ID out of the text input and assigns it to a variable.
    id  = $("#ID-Input").val().trim();
    console.log(id);
    // Do a one-time read from Firebase, reading the destination objects that were created/written to Firebase on the "itinerary builder" page.  
    database.ref('').once('value').then(function(snapshot){
        console.log(snapshot.val());
        itinLoad = snapshot.val();
        console.log('---------');

        // Since each individual destination returns as an individual object separately from one another, we need to convert that list of objects to an array in order to loop through it and pull the data from each one, in order to propagate our table.
        var itinArray = Object.values(itinLoad)
        console.log("Number of objects in itinerary array: " + itinArray.length);
        console.log(itinArray);

        var itinList = $("<ul></ul>");

        for (var i = 0; i < itinArray.length; i++) {
            console.log(itinArray[i].city);
            console.log(itinArray[i].startDate);
            console.log(itinArray[i].endDate);
            console.log('-------------');
        }
        for (var i = 0; i < itinArray.length; i++) {
            var itinListItem = $("<li></li>");
            var itinA = $("<a></a>");

            itinList.addClass("ui-menu-item");
            itinList.attr("role", "menuitem");

            itinA.addClass("ui-all");
            itinA.attr("tabindex", "-1");

            itinA.text(itinArray[i].city);
            itinListItem.append(itinA);

            itinList.append(itinListItem);
        }
        $("#").append(itinList);
    });
});

function contactHtmlFromObject(contact){
    console.log( contact );
    var html = '';
      html += '<tr>';
        html += '<td scope="col">'+contact.destination+'</td>';
        html += '<td scope="col">'+contact.startDate+'</td>';
        html += '<td scope="col">'+contact.endDate+'</td>';
      html += '</tr>';
    return html;
}