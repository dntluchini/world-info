import axios from "axios";
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BtnShowInfo from "./btnShowInfo";
import '../components-styles/locationStyle.css';
const apiKeyGoogleMaps = "AIzaSyCQPrUWUcLSggmk1g2_CplnAKZGxeuqphs";

function LocationData({ city, showLocation }) {
    const [region, setRegion] = useState(null);
    const [cityName, setCityName] = useState(null);
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [country, setCountry] = useState(null);

    const handleMoreInfo = () => {
        setShowMoreInfo(!showMoreInfo);
    }

    useEffect(() => {
        const getData = async () => {
            if (showLocation) {
                try {
                    const results = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKeyGoogleMaps}`);
                    const regionName = results.data.results[0].address_components[results.data.results[0].address_components.length - 2].long_name;
                    const cityName = results.data.results[0].address_components[results.data.results[0].address_components.length - 3].long_name;
                    const country = results.data.results[0].address_components[results.data.results[0].address_components.length - 1].long_name;
                    setCountry(country);
                    setRegion(regionName);
                    setCityName(cityName);

                } catch (error) {
                    console.error("Error fetching data", error);
                }
            }
        };

        getData();
    }, [city, showLocation]);

    return (
        <li className="geoData">
            <h2>Location</h2>
            <div className="locationData">
            <h3>Country: {country}</h3>
            <h3>Region: {region}</h3>
            <h3>City : {cityName}</h3>
            <aside>
                <iframe
                    title="map"
                    width="300"
                    height="200"
                    src={`https://www.google.com/maps/embed/v1/place?q=${city}&key=${apiKeyGoogleMaps}`}
                    allowFullScreen>
                </iframe>
            </aside>
        <BtnShowInfo topic = 'Main attractions' functionName = {handleMoreInfo} validation = {showLocation} className = 'btnLocation btnStyle'/>    
        </div>
        </li>
    );
}

LocationData.propTypes = {
    city: PropTypes.string.isRequired,
    showLocation: PropTypes.bool.isRequired
}

export default LocationData;
