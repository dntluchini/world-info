import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../components-styles/moreInfoStyle.css';
import BtnShowInfo from './btnShowInfo';

const apiKeyWeather = "ZQT3LWBDQ7R99RZ7C7Y6379VG";

function MoreInfo({ city, showInfo }) {
    const [weatherData, setWeatherData] = useState(null);
    const [weatherIcon, setWeatherIcon] = useState(null);
    const [sevenDaysForecast, setSevenDaysForecast] = useState(null);
    const [weatherIcons, setWeatherIcons] = useState(null);
    const [showSevenDaysForecast, setShowSevenDaysForecast] = useState(null);

    const handleShowForecast = () => {
        setShowSevenDaysForecast(!showSevenDaysForecast);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (showInfo) {
                try {
                    const results = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKeyWeather}&contentType=json`);
                    setWeatherData(results.data);
                    const icon = await getWeatherIcon(results.data.currentConditions.icon);
                    setWeatherIcon(icon);
                    
                    setSevenDaysForecast(results.data.days);
                } catch (error) {
                    console.error("Error fetching data", error);
                }
            }
        };
        fetchData();
    }, [city, showInfo]);
    
    useEffect (() => {
        const fecthWeatherIcon = async () => {
            if (showInfo && sevenDaysForecast) {
                const icons = await Promise.all (sevenDaysForecast.slice(1,8).map(day => getWeatherIcon(day.icon)));
                setWeatherIcons(icons)
            }
        }
        fecthWeatherIcon()
    },[showInfo, sevenDaysForecast])


    const getWeatherIcon = async (icon) => {
        try {
            const { default: weatherIcon } = await import(`../assets/weather-icons/${icon}.svg`);
            return weatherIcon;
        } catch (error) {
            console.error("Error fetching data", error);
            return null;
        }
    };

    return (
        <li className="weatherContainer">
            {weatherData && (
                <div className = 'weatherInfo'>
                    <h2>Weather today </h2>
                    {weatherIcon && (
                        <img
                            className="iconWeather"
                            src={weatherIcon}
                            alt="Weather Icon"
                        />
                    )}
                    <ul className="extraInfoWeather">
                        <li>Condition : {weatherData.currentConditions.conditions}</li>
                        <li>Temperature : {weatherData.currentConditions.temp}°C</li>
                        <li>Feels like : {weatherData.currentConditions.feelslike}°C</li>
                        <li>Temp max : {weatherData.days[0].tempmax}°C</li>
                        <li>Temp min : {weatherData.days[0].tempmin}°C</li>
                        <li>Wind : {weatherData.currentConditions.windspeed} km/h</li>
                        <li>Humidity : {weatherData.currentConditions.humidity}%</li>
                    </ul>
                    <BtnShowInfo topic = '7 days forecast' functionName = {handleShowForecast} validation = {showSevenDaysForecast} className = 'btnForecast' btnStyle='btnStyle'/>
                    {showSevenDaysForecast && weatherData && (
                        <>
                            <h2 className='titleForecast'> 7 days forecast </h2>
                            <ul className='sevenDayForecast'>
                                {sevenDaysForecast && sevenDaysForecast.slice(1,8).map((day, index) =>{
                                    const date = new Date(day.datetime);
                                    const dayOfTheWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                                    const dayAndMonth = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
                                    const icon = weatherIcons && weatherIcons[index];
                                    return <li key ={index} className='dayItem'> 
                                                <span className='dayInfo'><h4>{dayOfTheWeek}</h4> {dayAndMonth}</span>
                                                <div className = 'daysWeatherContainer'>
                                                    {icon && (
                                                            <img
                                                                className="iconWeather"
                                                                src={icon}
                                                                alt="Weather Icon"
                                                            />
                                                        )} 
                                                        <div className="weatherInfo">
                                                            <span className='titleCondition'>{day.conditions}</span>
                                                            <div className='tempInfo'>
                                                                <h3>Min : {day.tempmin}°C </h3>
                                                                <h3>Max : {day.tempmax}°C </h3>
                                                            </div>
                                                        </div> 
                                                </div>
                                            </li>
                                        })}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </li>
    );
}

MoreInfo.propTypes = {
    city: PropTypes.string.isRequired,
    showInfo: PropTypes.bool.isRequired
};

export default MoreInfo;
