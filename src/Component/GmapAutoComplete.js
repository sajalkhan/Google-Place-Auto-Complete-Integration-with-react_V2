import React, { useState, useEffect, useRef } from "react";

let autoComplete;
const API_KEY = 'AIzaSyBLVHqBpK4pTUHkxRLctTj6a3nHrt1d-uI';

const loadScript = (url, callback) => {
    let script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        script.onload = () => callback();
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(setQuery, setMapState, autoCompleteRef) {
    autoComplete = new window.google.maps.places.Autocomplete(
        autoCompleteRef.current,
        { types: ["geocode"] }
    );
    autoComplete.setFields(["address_components", "formatted_address"]);
    autoComplete.addListener("place_changed", () =>
        handlePlaceSelect(setQuery, setMapState)
    );
}

async function handlePlaceSelect(setQuery, setMapState) {

    const place = autoComplete.getPlace();
    const query = place.formatted_address;

    var Gmap_Address = "";
    var streetNumber = "";
    var street = "";
    var city = "";
    var stateCode1 = "";
    var stateCode2 = "";
    var county = "";
    var zipCode = "";
    
    for (var i = 0; i < place.address_components.length; i++) {

        var addressType = place.address_components[i].types[0];

        switch (addressType) {
            case "street_number":
                streetNumber = place.address_components[i]["short_name"];
                Gmap_Address += streetNumber + " ";
                break;
            case "route":
                street = place.address_components[i]["long_name"];
                Gmap_Address += street + ", ";
                break;
            case "locality":
                city = place.address_components[i]["long_name"];
                Gmap_Address += city + ", ";
                break;
            case "administrative_area_level_1":
                stateCode1 = place.address_components[i]["long_name"];
                stateCode2 = place.address_components[i]["short_name"];
                Gmap_Address += stateCode2 + " ";
                break;
            case "administrative_area_level_2":
                county = place.address_components[i]["long_name"];
                Gmap_Address += county;
                break;
            case "postal_code":
                zipCode = place.address_components[i]["short_name"];
                Gmap_Address += zipCode;
                break;
            default:
                break;
        }
    }

    setQuery(query);
    setMapState({
        location: Gmap_Address,
        streetNumber: streetNumber,
        street: street,
        city: city,
        stateCode: [{ label: stateCode1, value: stateCode2 }],
        zipCode: zipCode,
        county: county
    });

}

const SearchLocationInput = ({ result})=> {
    const [query, setQuery] = useState("");
    const [MapState, setMapState] = useState({
        location: '',
        streetNumber: '',
        street: '',
        city: '',
        stateCode: [{
            label: '',
            value: ''
        }],
        zipCode: '',
        county: '',
    });

    const autoCompleteRef = useRef(null);

    useEffect(() => {
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`,
            () => handleScriptLoad(setQuery, setMapState, autoCompleteRef)
        );
    }, []);

    useEffect(() => {
        console.log('map - ', MapState)
        result(MapState);
    }, [MapState]);

    return (
        <div>
            <input
                type="text"
                ref={autoCompleteRef}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search Address.."
                value={query}
            />
        </div>
    );
}

export default SearchLocationInput;