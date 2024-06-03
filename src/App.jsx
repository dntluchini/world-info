
import { useState } from 'react'
import './App.css'
import Clock from './components/clock'
import MoreInfo from './components/weatherInfo';
import BtnShowInfo from './components/btnShowInfo';
import LocationData from './components/location';



function App() {
  const [city,setCity] = useState('');
  const [cityInput,setCityInput] = useState('');
  const [searching,setSearching] = useState(false);
  const [showWeather,setShowWeather] = useState(false);
  const [showLocation,setShowLocation] = useState(false);
  
  const handleInputChange = (e) => {
    if (e.target.value === '') {
      setCity('');
      setSearching(false);
    }
    setCityInput(e.target.value);
  } 

  const handleSearch = () => {
    setCity(cityInput);
    setSearching(true);
  }

  const handleMoreInfo = () =>{
    setShowWeather(!showWeather);
  }

  const handleShowLocation = () => {
    console.log('show location')
    setShowLocation(!showLocation);
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>World Info <span>🌍</span></h1>
      </header>
      <main>
        <input type="text" 
        className = "inputPlace " 
        placeholder= 'Type any place in the world...'
        value = {cityInput}
        onChange = {handleInputChange}
        />
      </main>
      <div className='btnContainer'>
      <button className = 'btnStyle' onClick = {handleSearch}>Search</button>
      {city && <Clock city = {city} searching = {searching}/>}
      <BtnShowInfo
        topic={city.replace(/\b\w/g, (char) => char.toUpperCase()) + ' weather'}
        functionName={handleMoreInfo}
        validation={showWeather}
        className='btnLocation btnStyle'
      />
      <BtnShowInfo
        topic={city.replace(/\b\w/g, (char) => char.toUpperCase()) + ' details'}
        functionName={handleShowLocation}
        validation={showLocation}
        className='btnLocation btnStyle'
      />
      </div>
        {city && (
          <ul className = 'extraInfo'>
            {showWeather && city && <MoreInfo city = {city} showInfo = {showWeather}/>}
            {showLocation && city && <LocationData city = {city} showLocation = {showLocation}/>}
          </ul>
      )}
    </div>
  )
}

export default App
