let endPageContainer = document.querySelector("#end__container");
let ARCameraPageContainer = document.querySelector("#AR__container");
let welcomePageContainer = document.querySelector("#welcome__container");

function ARCamToEndPage() {
    ARCameraPageContainer.style.transform = "translateX(-90%)";
    ARCameraPageContainer.addEventListener("transitionend", ()=>{welcomePageContainer.style.display="none"})
    ARCameraPageContainer.style.display = "none";
  
    endPageContainer.style.transform = "translateX(0)";
    endPageContainer.style.display = "block"
  }

const jlgRoute = {
    distance:
    "0.37km",
    duration:
    "5 mins",
    difficulty:
    "Easy",
    ramps:
    [ 103.72244,1.3414,
    103.72275,1.34117,
    103.72329,1.341,
     103.72318,1.34102,
     103.72364,1.34091,
     103.72363,1.34086,
    
    ],
    coords:
    [  
          103.72245,1.34138,
          103.72252,1.34133,
          103.72267,1.34123,
          103.72342,1.34099,
          103.72364,1.34096,
          103.72364,1.34089,
          103.72362,1.34083,
          103.72361,1.3408,
          103.72369,1.34077,
          103.72378,1.34072,
          103.72388,1.34065,
          103.72396,1.34057,
          103.72405,1.34044,
          103.72412,1.3403,
          103.7242,1.34013,
          103.72427,1.34003,
          103.72432,1.33999,
          103.72437,1.34003,
          103.72439,1.34012,
          
    ]
};

const boonLayRoute = {
    distance: 
    "0.60km",
    duration:
    "11 mins",
    difficulty:
    "Hard",
    ramps: 
    [
        103.7047,1.33826,
        103.70477,1.33796,
        103.70493,1.3376,
        103.70522,1.33704,
        103.70603,1.33663,
        103.70634,1.3364,
        103.70624,1.33604,
        103.70585,1.33536,

    ],
    coords:
    [
        103.70585,1.3387,
          103.70573,1.33866,
          103.70541,1.33855,
          103.70538,1.33854,
          103.70535,1.33852,
          103.70532,1.33849,
          103.7053,1.33848,
          103.70515,1.33842,
          103.70475,1.33811,
          103.70476,1.33807,
          103.70476,1.33806,
          103.70476,1.33804,
          103.70476,1.33802,
          103.70477,1.33797,
          103.70477,1.33794,
          103.70476,1.33793,
          103.70481,1.33795,
          103.70483,1.33788,
          103.7049,1.3377,
          103.70495,1.33755,
          103.70497,1.33742,
          103.70501,1.33734,
          103.70503,1.3373,
          103.70506,1.33723,
          103.70509,1.33719,
          103.70513,1.33715,
          103.7053,1.33699,
          103.70534,1.33696,
          103.7054,1.33693,
          103.70546,1.3369,
          103.70552,1.33688,
          103.70557,1.33686,
          103.70559,1.33685,
          103.70574,1.33683,
          103.70613,1.33659,
          103.70622,1.33651,
          103.70636,1.33646,
          103.7063,1.33632,
          103.7063,1.33628,
          103.70629,1.33622,
          103.70627,1.33616,
          103.7061,1.33575,
          103.70605,1.33565,
          103.70598,1.33554,
          103.7059,1.33542,
          103.70588,1.33534,
          103.70591,1.33531,
          103.70595,1.33526,
          103.70596,1.33524,
          103.70596,1.33522,
          103.70596,1.33519,
          103.70596,1.33517,
          103.70596,1.33515,
          103.70596,1.33512,
          103.70595,1.33512,
    ]
};

var mylatlng = {lat:1.3521, lng:  103.8198};

var map, marker;

var commMarkerO, commMarkerD, flightPath;

let customRoute = document.querySelector("#route_name");
let origin = document.querySelector("#from");
let dest = document.querySelector("#to");

var mapOptions = {
    center: mylatlng,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var places = [];
var ramps = [];
var rampPoints = [];

map = new google.maps.Map(document.getElementById("map"), mapOptions);

var directionsService = new google.maps.DirectionsService();

var directionDisplay = new google.maps.DirectionsRenderer();

directionDisplay.setMap(map);

document.getElementById("click").addEventListener("click",() => calcRoute());

function getCoordinates(result) {
    var currentRouteArray = result.routes[0];  //Returns a complex object containing the results of the current route
    var currentRoute = currentRouteArray.overview_path; //Returns a simplified version of all the coordinates on the path
    const arr = [];

    obj_newPolyline = new google.maps.Polyline({ map: map }); //a polyline just to verify my code is fetching the coordinates
    var path = obj_newPolyline.getPath();
    for (var x = 0; x < currentRoute.length; x++) {
        arr.push(currentRoute[x].lng());
        arr.push(currentRoute[x].lat());
    }
    return arr;
}

function calcRoute() {
    var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC
    }

    if (customRoute.value == "none") {
        directionsService.route(request, (result,status) => {
            if (status == google.maps.DirectionsStatus.OK) {
                directionDisplay.setDirections(result);
                const arr = getCoordinates(result);
                ramps = [];
                places = arrToPlaces(arr);
                if (commMarkerD) {
                    commMarkerD.setMap(null);
                    commMarkerO.setMap(null);
                    flightPath.setMap(null);
                }
                document.getElementById("selectHead").innerHTML = "Distance: " + result.routes[0].legs[0].distance.text + "<br />Duration: " + result.routes[0].legs[0].duration.text;
            } else {
                directionDisplay.setDirections({routes: []});
                document.getElementById("selectHead").innerHTML = "Try selecting route again";

            }
        });
    }

    else if (customRoute.value == "jlg") {
        plotCommunityRoute(jlgRoute);
    }

    else if (customRoute.value == "jw") {
       plotCommunityRoute(boonLayRoute);
    }
}

function plotCommunityRoute(route) {
    directionDisplay.setDirections({routes: []});
        plotRoute(route.coords);
        ramps = arrToPlaces(route.ramps);     
        plotRamps(ramps);  
        document.getElementById("selectHead").innerHTML = "Distance: " + route.distance + "<br />Duration: " + route.duration 
        + "<br />Difficulty: ";
        
        if (route.difficulty == "Easy") {
            document.getElementById("selectHead").innerHTML = document.getElementById("selectHead").innerHTML 
            + '<i class="fa-solid fa-face-smile"></i>';
        } else {
            document.getElementById("selectHead").innerHTML = document.getElementById("selectHead").innerHTML 
            + '<i class="fa-solid fa-face-frown"></i>';
        }
        

}


function zoomToObject(obj){
    var bounds = new google.maps.LatLngBounds();
    var points = obj.getPath().getArray();
    for (var n = 0; n < points.length ; n++){
        bounds.extend(points[n]);
    }
    map.fitBounds(bounds);
}

function plotRamps(places) {

    if (rampPoints.length == 0) {

    } else {
        rampPoints.forEach((point) => { 
            point.setMap(null);
        });
        rampPoints = [];
    }

    if (places.length == 0) {
        return
    }

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        let pos = {
            lat: latitude,
            lng: longitude
        };

        let new_marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: 'Ramp',
            label: 'Ramp'
        });
        
        rampPoints.push(new_marker);
        });
}

function plotRoute(arr) {
    places = arrToPlaces(arr);
    const posO = {
        lat: places[places.length-1].location.lat,
        lng:  places[places.length-1].location.lng
      };
    commMarkerO = new google.maps.Marker({
        position: posO,
        map: map,
        title: 'Origin',
        label: 'A'
    });

    const posD = {
        lat: places[0].location.lat,
        lng:  places[0].location.lng
      };
    commMarkerD = new google.maps.Marker({
        position: posD,
        map: map,
        title: 'Destination',
        label: 'B'
    });

    const flightPlanCoordinates = arrToPolyline(arr);
    flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#0088FF',
       strokeWeight: 6,
       strokeOpacity: 0.6
      });

      flightPath.setMap(map);
      zoomToObject(flightPath);
}

function arrToPolyline(arr) {
    const arr2 = [];

    let count = 0;

    var temp = new Array();
    for (let i = 0; i < arr.length;i++) {
    
        if (count == 0) {
            temp.push(arr[i]);
            count += 1;
        } else if (count == 1) {
            temp.push(arr[i]);
            count += 1;
        }
        if (count == 2) {
            arr2.push(temp);
            count = 0;
            temp = [];
        }
    }

    const polyline = [];
    for (let i = 0; i < arr2.length; i++) {
        polyline.push({lat: arr2[i][1], lng: arr2[i][0]});
    }

    return polyline;
}


function arrToPlaces(arr1) {
    const arr2 = [];

    let count = 0;

    var temp = new Array();
    for (let i = 0; i < arr1.length;i++) {
    
        if (count == 0) {
            temp.push(arr1[i]);
            count += 1;
        } else if (count == 1) {
            temp.push(arr1[i]);
            count += 1;
        }
        if (count == 2) {
            arr2.push(temp);
            count = 0;
            temp = [];
        }
    }


    const places = [];

    for (let i = 0; i < arr2.length; i++) {
        places.push({name: i, location: {lat: arr2[i][1], lng: arr2[i][0],}});
    }

   places.reverse();    
   return places;
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2);

function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            
            map.setCenter(pos);
        },
        () => {
        });
}

function getUserLocation(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var point = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            if (typeof getUserLocation.user_marker == 'undefined') {
                marker = new google.maps.Marker({
                    position:point,
                    map:map,
                    title: 'update'
                });
                getUserLocation.user_marker = marker;
                getUserLocation.user_marker_window = new google.maps.InfoWindow({
                    content:'You'
                });

                google.maps.event.addListener(getUserLocation.user_marker, 'click', function () {
                    getUserLocation.user_marker_window.open(getUserLocation.user_marker);
                });
            }
            getUserLocation.user_marker.setPosition(point);
            return point;
        });
    }
}

function setCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var point = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            if (typeof getUserLocation.user_marker == 'undefined') {
                marker = new google.maps.Marker({
                    position:point,
                    map:map,
                    title: 'update'
                });
                getUserLocation.user_marker = marker;
                getUserLocation.user_marker_window = new google.maps.InfoWindow({
                    content:'You'
                });

                google.maps.event.addListener(getUserLocation.user_marker, 'click', function () {
                    getUserLocation.user_marker_window.open(getUserLocation.user_marker);
                });
            }
            getUserLocation.user_marker.setPosition(point);
            origin.value = point.toString().replace(/[()]/g, "");
        });
    }
}

function calculateDist() {
    if (places.length == 0) {

    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var p1 = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);
                var p2 = new google.maps.LatLng(places[0].location.lat, places[0].location.lng);
                const dist =  Math.round(google.maps.geometry.spherical.computeDistanceBetween(p1, p2));
                if (dist <= 10) {
                    document.getElementById("distance").innerHTML = "You have arrived!"
                    ARCamToEndPage();
                } else {
                    document.getElementById("distance").innerHTML = dist + "m";
                }
            });
        }
    }
}


if (navigator.geolocation) {
    calculateDist();
    getUserLocation(map);
    setInterval(function () {
        getUserLocation(map);
        calculateDist();
    }, 5000);
}

customRoute.onchange = function() {
    let d = customRoute.value;
    if (d === "none") {
      origin.disabled = false;
      dest.disabled = false;
      origin.value = "";
      dest.value = "";
      document.getElementById("set_curr_loc").disabled = false;
    } else if (d === "jlg") {
      origin.disabled = true;
      dest.disabled = true;
      origin.value = "Yuan Ching Rd Bus Stop";
      dest.value = "Clusia Cove";
      document.getElementById("set_curr_loc").disabled = true;
    } else if (d === "jw") {
      origin.disabled = true;
      dest.disabled = true;
      origin.value = "Boon Lay MRT";
      dest.value = "Jurong Safra";
      document.getElementById("set_curr_loc").disabled = true;
    }
}






document.getElementById("currentLocation").addEventListener("click",() => { getCurrentLocation(); getUserLocation(map); });
document.getElementById("set_curr_loc").addEventListener("click", setCurrentLocation);
