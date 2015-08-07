
// Userlist data array for filling in info box
var userListData = [];
var user_ids = new Set();
var location_ids = new Set()

// DOM Ready =============================================================
$(document).ready(function() {
    console.log(document);
    // Populate the user table on initial page load
    populateTable();

    // Map
    initialize();
    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    // Add User button click
    $('#btnAddUser').on('click', addUser);

    $('#btnMap').on('click', switchToMap);
    // Add Delete user link
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    $('#locations table tbody').on('click', 'td a.linkdeleteuser', deleteUser);



});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';
    var locationTable = '';


    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
        // Stick our user data array into a userlist variable in the global object
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){

            // Stick our user data array into a userlist variable in the global object
            userListData = data;
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';

            user_ids.add(this._id);
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });

    $.getJSON('/points/locations', function(data){
        locationData = data;
        $.each(data, function(){
            locationTable += '<tr>';
            locationTable += '<td>' + this.latitude + '</td>';
            locationTable += '<td>' + this.longitude + '</td>';
            // Modify delete method for locations
            locationTable += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            locationTable += '</tr>';

            location_ids.add(this._id);
        })
        
        $('#locations table tbody').html(locationTable);
        
    })
};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {
    event.preventDefault();
    
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {
        // Get id and determind where to delete
        id = $(this).attr('rel');
        if (user_ids.has(id)){
            $.ajax({
                type: 'DELETE',
                url: '/users/deleteuser/' + id
            }).done(function( response ) {

                // Check for a successful (blank) response
                if (response.msg === '') {
                }
                else {
                    alert('Error: ' + response.msg);
                }

                // Update the table
                populateTable();
                user_ids.delete(id);

            });
        } else if (location_ids.has(id)){
            $.ajax({
                type: 'DELETE',
                url: '/points/deletelocation/' + id
            }).done(function( response ) {

                // Check for a successful (blank) response
                if (response.msg === '') {
                }
                else {
                    alert('Error: ' + response.msg);
                }

                // Update the table
                populateTable();
                location_ids.delete(id);
            });
        }
    }
    else {

        // If they said no to the confirm, do nothing
        return false;
    }
};



// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

// ====================== Map Stuff ================================================ 

function initialize(){
    var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644)
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    // Adding listeners
    google.maps.event.addListener(map, 'dblclick', function(event){
        console.log(event);
        placeMarker(event.latLng, map);
    });
}

function placeMarker(position, map) {
    console.log("Added marker");
        var marker = new google.maps.Marker({
            position: position,
            map: map
        });
}
