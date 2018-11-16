var itineraryData = {
    uid: 0,
    destination: 'Bronx, NY',
    startDate: '11/11/2018',
    endDate: '11/14/2018'
};

var eventData = {
    rid: 0,
    name: 'Go karts',
    time: '5:00PM'
};

var restaurantData = {
    rid: 0,
    name: 'Cajun Queen',
    time: '8:00PM'
};


// pushes data to fb 

itineraryRef.push(itineraryData);


// itineraryRef.set(obj);    // Overwrites the path
// itineraryRef.update(obj); // Updates only the specified attributes 

// var form = {
//     destination: 'Bronx, New York',
//     startDate: '11/11/2018',
//     endDate: '11/14/2018',
//     trainTime: trainTime,
//     frequency: frequency
// };
// pushes the data to firebase database
// database.ref().push(form);