// Functioning Scripts for google maps


const hotelAddress = document.getElementById("hotelAddress");
const hotelCountry = document.getElementById("hotelCountry");
console.log(hotelAddress.innerText);
console.log(hotelCountry.innerText);
// const address = hotelAddress+" , "+hotelCountry;

// Replace 'YOUR_API_KEY' with your actual Google Maps API key
async function getLatLng(address) {
const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAn_I0dpENSrMCKEZ0fRs-F-P8XUtSwM4g`;

// Improved error handling using Fetch API
return fetch(geocodingUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Geocoding API request failed with status ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Extract latitude and longitude from the response (assuming successful response)
    const lat = data.results[0].geometry.location.lat;
    const lng = data.results[0].geometry.location.lng;
    // return { lat, lng };
    initMap(lat,lng);
  })
  .catch(error => {
    console.error("Error fetching geolocation:", error);
    // Handle errors gracefully, e.g., display an error message to the user
    return null; // Or provide a default value or handle differently based on your app logic
  });
}

// Example usage
const userEnteredAddress = hotelAddress.innerText + " , " + hotelCountry.innerText;
getLatLng(userEnteredAddress)
.then(coordinates => {
  if (coordinates) {
    console.log(`Latitude: ${coordinates.lat}, Longitude: ${coordinates.lng}`);
    initMap(coordinates.lat, coordinates.lng)
    // Use the coordinates to position a marker on your Google Map
  } else {
    console.error("Failed to get geolocation coordinates");
  }
})
.catch(error => {
  console.error("Error:", error);
});


    function initMap(latitude,longitude)
    {
        // let bathinda = {lat:30.2110, lng:74.9455};
        let city = {lat:latitude, lng:longitude}
        var customIcon = 
        {
            url:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Eo_circle_red_letter-a.svg/1024px-Eo_circle_red_letter-a.svg.png?20200417173508",
            scaledSize: new google.maps.Size(30,30), // Size of the icon  
        };
        let map = new google.maps.Map(
            document.getElementById('map'),
            {
                zoom:12,
                center:city,
                disableDefaultUI: true, // This will remove the useless options of gmaps (like zoom in, satellite, street etc).
                // styles:
                // [
                //     // {elementType: "geometry", stylers: [{color: "#242F3E"}]} for the background color of gMaps.
                //     // {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]}, for the text color of gMaps.
                //     // {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                // ]
            },

        );
        let marker = new google.maps.Marker(
            {
                position:city,
                map:map,
                title:city,
                icon: customIcon,
            }
        )
    }
