
import { useEffect, useState } from 'react';
import '../components-styles/clockStyle.css';
import PropTypes from 'prop-types';
import axios from 'axios';

const apiKey = "AIzaSyCQPrUWUcLSggmk1g2_CplnAKZGxeuqphs"


function Clock ({ city, searching }) {
  const [flagSvg, setFlagSvg] = useState('');
  const [time, setTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [date,setDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (searching) {
        setIsLoading(true);
        try {
          const apiUrl = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`);
          const results = apiUrl.data.results;

           if (!results || !results.length) {
            throw new Error('City not found');
          }
          const addressComponents = results[0].address_components[results[0].address_components.length - 1];
           if (addressComponents.types[0] !== 'country') {
            throw new Error('City not found');
          }
          const cityShortName = addressComponents.short_name;
          
          const flagSvg = `https://flagcdn.com/${cityShortName.toLowerCase()}.svg`;
          const timeZone = await axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${results[0].geometry.location.lat},${results[0].geometry.location.lng}&timestamp=${Date.now() / 1000}&key=${apiKey}`);
           
          const localTime = await axios.get(`https://worldtimeapi.org/api/timezone/${timeZone.data.timeZoneId}/`);
          
          const currentTime = localTime.data.datetime.slice(11, 16);
          const currentDate = localTime.data.datetime.slice(0,10);
          
          const currentDateString = new Date(currentDate);
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = currentDateString.toLocaleDateString('en-US', options);
          setDate(formattedDate);
          
          
          setTime(currentTime);
          setFlagSvg(flagSvg);
          setIsLoading(false);
          setError('');
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setError('City not found');
        } finally {
          setHasSearched(true);
        }
      } else {
        setError('');
        setHasSearched(false);
      }
    };

    fetchData();
  }, [city,searching]);

  return (
    <div className="clockContainer">
      {isLoading ? (
        <span className="loader"></span>
        ) : (
        <div>
          {error && hasSearched && (
             <div className='errorMsg'>{error}</div>
            )}  
                {flagSvg && (
                  <div
                    className="flagSvg"
                    dangerouslySetInnerHTML={{
                    __html: `<img src="${flagSvg}" alt="Flag" width="150" />`,
                      }}
                  />
                )}
          <h3 className="time">{date} {time} </h3>
            </div>  
            )}
    </div>
  );
}

Clock.propTypes = {
  city: PropTypes.string.isRequired,
  searching: PropTypes.bool.isRequired,
};

export default Clock;
