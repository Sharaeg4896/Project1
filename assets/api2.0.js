// Initialize Firebase
 var config = {
    apiKey: "AIzaSyARlnMGHgxtadNrOY2BUVIdkG9DCJKjx20",
    authDomain: "project1-a1146.firebaseapp.com",
    databaseURL: "https://project1-a1146.firebaseio.com",
    projectId: "project1-a1146",
    storageBucket: "project1-a1146.appspot.com",
    messagingSenderId: "451892561933"
  };
  firebase.initializeApp(config);

// Yelp API key 
var yelpApiKey = 'XwSkYev9Zx9I3uRA2EHdtKjbR2N75aL483Khjs9T4dmaQbU0gaZyCPuOzCo_mpgyEMCNUlJNae06jMoHPQggFTKvM5Zxn4hoaBWws_TclBie18PHGlCD4MyG_-XiW3Yx';

// Yelp Configuration
var yelpConfiguration = {
    headers: {
        'Authorization': 'Bearer ' + yelpApiKey,
    },
    method: 'GET',
    dataType: 'json',
}; 

// Destinations (Should come from firebase)
var destinations = {
    '001': {
        destination: 'Bronx, Ny',
        startDate: '11/22/2018',
        endDate: '11/25/2018'
    },
    '002': {
        destination: 'Charlotte, NC',
        startDate: '11/25/2018',
        endDate: '11/27/2018'
    }
}

// Content mgmt for restaurants/events
var details = {
    restaurant: {
        geo: true,
        header: 'Top 10 Restaurants',
        selectorName: '.restaurant-details'
    },
    event: {
        geo: false,
        header: 'Top 10 Attractions',
        selectorName: '.event-details'
    }
}

// Query string configuration
var categories = 'poolbilliards,comedyclubs,tours';

// Loop through destinations
// Run Yelp API
Object.keys(destinations).forEach(function(key) {
    // asyc request
    yelpRestaurantData(destinations[key], key);
    // asyc request
    yelpEventData(destinations[key], key);
    // html placeholders
    createItinerarySection(key);
});

function handleResponse(response, destinationData, details, key) {
    var businesses = response.businesses;

    if(details.geo) {
        geoCodeAddress(destinationData.destination, key);
    }
    // Grabs the respective key
    var $masterRow = $('#' + key);
    var $details = $masterRow.find('.details');
    var $map = $masterRow.find('.google-map');
    var $topDetails = $masterRow.find(details.selectorName);

    var $h2 = '<h2>Destination: <span class="destination"> ' + destinationData.destination + '</span></h2>';
    var $h3 = '<h3>Dates: <span class="dates">' + destinationData.startDate + ' - ' + destinationData.endDate + '</span></h3>';
    var $h4 = '<h4> ' + details.header + ' </h4>'
    var $list = $('<ul></ul>');

    businesses.forEach(function(business) {
        var address = business.location.display_address;

        var $div = $('<div class="information"></div>');
        var $li = $('<li></li>');
        var $link = $('<a href="#"></a>');
        var $modalLink = $('<a href="#" class="itinerary-modal" data-toggle="modal" data-target="#itineraryModal">Plan Itinerary</a>')

        var $address = '<p>Address: ' + address[0] + ', ' + address[1] + '</p>';
        var $number = '<p>Contact: ' + business.display_phone + '</p>';
        var $ratings = '<p>Ratings: ' + business.rating + '</p>';
        var $alias = '<p>Alias: ' + business.alias.replace(/-/g, ' ') + '</p>';
        $modalLink.data('name', business.name);

        $link
            .text(business.name)
            .attr('data-name', business.name)
            .addClass('information-link');

        $div
            .append($address)
            .append($number)
            .append($alias)
            .append($ratings)
            .append($modalLink);

        $li
            .append($link)
            .append($div);

        $list
            .append($li);
    })
    
    if (details.geo) {
        $details
            .append($h2)
            .append($h3);
    }

    $topDetails 
        .append($h4)
        .append($list);

}

// Declare Yelp Restaurant API
function yelpRestaurantData(destinationData, key) {
    yelpConfiguration.url = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=' + destinationData.destination + '&term=restaurants&radius=20000&limit=10';

    $.ajax(yelpConfiguration)
        .then(function(response){
            handleResponse(response, destinationData, details['restaurant'], key);
        });
}

// Declare Yelp Event API
function yelpEventData(destinationData, key) {
    yelpConfiguration.url = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=' + destinationData.destination + '&categories=' + categories + '&radius=20000&limit=10';
    
    $.ajax(yelpConfiguration)
        .then(function(response){
            handleResponse(response, destinationData, details['event'], key);
        });
}

// Create HTML placeholder 
function createItinerarySection(key) {
    var $itinerarySection = $('#itinerarySection');
    var $row = $('<div class="row"></div>');
    var $firstColumn = $('<div class="col-12 details"></div>');
    var $secondColumn = $('<div class="col-12 google-map"></div>');
    var $thirdColumn = $('<div class="col-6 restaurant-details"></div>');
    var $fourthColumn = $('<div class="col-6 event-details"></div>');

    $secondColumn.attr('id', key + 'googleMap');

    $row
        .attr('id', key)
        .append($firstColumn)
        .append($secondColumn)
        .append($thirdColumn)
        .append($fourthColumn);
        
    $itinerarySection
        .append($row);

}

// Create map
function initMap(key, geolocation) {
    var $googleMap = document.getElementById(key + 'googleMap');
    return new google.maps.Map($googleMap, {
        center: geolocation,
        zoom: 15
    });
}
// Geocoder converts the address to long/lat
function geoCodeAddress (destination, key){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 
        address: destination
    }, function(results, status) {
        console.log(results);
        if (status == 'OK') { 
            var geolocation = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            }
            // creates the map
            var map = initMap(key, geolocation);
            map.setCenter(results[0].geometry.location);
            // Creates the marker 
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
}

$('#itinerarySection').on('click', '.information-link', function (e) {
    e.preventDefault();
    $(this).next().toggle();
});

$('#itinerarySection').on('click', '.itinerary-modal', function(e) {
    e.preventDefault();
    var $el = $(this);
    var $modal = $('#itineraryModal');
    var $title = $modal.find('.modal-title');
    var name = $el.data('name');
    $title.text(name);
    console.log(name)
})

$('#viewItinerary').on('click', function(e) {
    e.preventDefault();
    
})



