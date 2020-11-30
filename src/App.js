import React, {useState} from 'react'
import GoogleMap from './Component/GmapAutoComplete'

const App =()=> {

  const [state, setMapState] = useState({
    location: '',
    streetNumber: '',
    street: '',
    city: '',
    stateCode: [],
    zipCode: '',
    county: '',
  });

  const updateMapInfo = (data) => {
    setMapState({
      location: data.location,
      streetNumber: data.streetNumber,
      street: data.street,
      city: data.city,
      stateCode: data.stateCode,
      zipCode: data.zipCode
    });
  }

  return (
    <div>
      
      <GoogleMap result={updateMapInfo} />

        location: {state.location} <br/>
        Street Number: {state.streetNumber} <br />
        street: {state.street} <br />
        city: {state.city} <br />
        stateCode: {state.stateCode[0]?.label} <br />
        zipCode: {state.zipCode} <br />

    </div>
  )
}

export default App;