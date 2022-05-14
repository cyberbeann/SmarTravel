window.parent.document.getElementById("goCamera").addEventListener("click", () => loadRoute());

function loadRoute() {
    var arr = window.parent.window.places;
    var ramps = window.parent.window.ramps;
    renderPlaces(arr);
    renderRamps(ramps);
}

function renderRamps(places) {
    if (places.length == 0) {
        return
    }
    let scene = document.querySelector('a-scene');
    
    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;
    
        let model = document.createElement('a-image');
        

        model.setAttribute('look-at', "[gps-camera]");
        model.setAttribute('scale', '1 1 1');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        model.setAttribute('src', './assets/nearest_ramp_g.png');
        
        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });

        scene.appendChild(model);
    });
}



function renderPlaces(places) {
    if (places.length == 0) {
        return
    }

    let scene = document.querySelector('a-scene');

    let end = document.createElement('a-entity');
    let end_lat = places[0].location.lat;
    let end_lng = places[0].location.lng;
    let end_id = places[0].name;


    end.setAttribute('id', "node" + end_id);
    end.setAttribute('gps-entity-place', `latitude: ${end_lat}; longitude: ${end_lng};`);
    end.setAttribute('gltf-model', './assets/map_pointer_3d_icon/scene.gltf');
    end.setAttribute('scale', '0.5 0.5 0.5');
    end.setAttribute('position', '1 2 3');
    end.setAttribute('position', 'absolute');

    scene.appendChild(end);


    places.shift();


    if (places.length == 0) {
        return
    }

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;
        let id = place.name;
        
 
        let parent = document.createElement('a-entity');
        let model = document.createElement('a-entity');
        parent.setAttribute('id', "node" + id.toString());
        parent.setAttribute('look-at', "#node" + (id+1).toString());
        parent.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        parent.setAttribute('scale', '0.01 0.01 0.01');
        parent.setAttribute('position', 'absolute');
                
        model.setAttribute('position', '1 2 -0.001');
        model.setAttribute('position', 'absolute');
        model.setAttribute('rotation', '90 -90 0');
        model.setAttribute('scale', '1 1 1');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        model.setAttribute('gltf-model', './assets/red_arrow_chevrons_wayfinding/scene.gltf');
        


        parent.appendChild(model);

        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });


        parent.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });
        
        
        scene.appendChild(parent);
        
    });

}