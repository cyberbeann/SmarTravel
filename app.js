function initMap() {
    var init_lat;
    var init_long;


    navigator.geolocation.getCurrentPosition((position) => {
        init_lat =  parseFloat(position.coords.latitude);
        init_long =  parseFloat(position.coords.longitude);
    });

    console.log(init_lat);

    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById("map"),{
        zoom: 14,
        center: {lat:1.3521, lng:  103.8198},
    });

    directionsRenderer.setMap(map);
    document.getElementById("click").addEventListener("click", () => {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    });

}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    
    directionsService
    .route({
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        
        travelMode: google.maps.TravelMode["WALKING"],

    })
    .then((response)=> {
        directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Direction request failed due to " + status));

}