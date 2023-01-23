import { useRef, useEffect, useState, useContext } from 'react';
import { ReactComponent as PinIcon } from '../../icons/pin.svg';
import mapboxgl, { LngLat, Map } from 'mapbox-gl';  // eslint-disable-line import/no-webpack-loader-syntax   
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactDOM from 'react-dom';
import { LocationContext } from '../LocationContext';
import { LocationData } from '../cards/LocationCard';
import { LocationActionTypes } from '../locationReducers';
import { LngLatBounds } from 'mapbox-gl'; 
import { distanceInKmBetweenCoordinates } from './mapUtils';
import { Matcher, useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import { renderSelectedLocation } from './renderSelectedLocation';
import { renderSearchAreaButton } from './renderSearchAreaButton';
import Address from "../Address";
import Hours from "../hours";

import { 
  GoogleMap,
  useJsApiLoader,
  Marker,
  MarkerClusterer,
  InfoWindow
  } from "@react-google-maps/api";

// prettier-ignore
export interface MapGoogleLocationData extends LocationData {
  yextDisplayCoordinate?: {
    latitude: number,
    longitude: number
  }
}

// prettier-ignore
type MapMarkers = {
  [locationId: string]: mapboxgl.Marker 
};

type MapboxSearchType = 'none' | 'button' | 'google';

export default function MapGoogle(): JSX.Element {
 
  const [activeMarker, setActiveMarker] = useState(null);
  const [map, setMap] = useState(null);
  const { state, dispatch } = useContext(LocationContext);
  const [mapRef, setMapRef] = useState(null);

  const answersActions = useAnswersActions();
  const searchType = useAnswersState((state) => state.meta.searchType);
 // const mostRecentSearch = useAnswersState((state) => state.query.mostRecentSearch);
  const query = useAnswersState((state) => state.query.input);

  const handleActiveMarker = (marker:any) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);      
  };

  const markers:any = [];
  let mapCenter = {lat: 0, lng: 0};
  let MapZoom = 2;

  state.mapLocations?.forEach((location, index) => { 
    console.log(location);
    if(location.yextDisplayCoordinate){
      markers.push({      
        name: location.name,
        id: location.id,
        item: location,
        position: { lat: location.yextDisplayCoordinate.latitude, lng: location.yextDisplayCoordinate.longitude }
      });
      
      if(index == 0){
        mapCenter = { lat: location.yextDisplayCoordinate.latitude, lng: location.yextDisplayCoordinate.longitude };
      }

    }

  });


  const fitBounds = (map:any) => {
    const bounds = new window.google.maps.LatLngBounds();    
    state.mapLocations?.forEach((location) => { 
      if(location.yextDisplayCoordinate){
        bounds.extend({ lat: location.yextDisplayCoordinate.latitude, lng: location.yextDisplayCoordinate.longitude });        
        return location.id;        
      }  
    });    
    map.fitBounds(bounds);    
  };

  const loadHandler = (map:any) => {
    // Store a reference to the google map instance in state
    setMapRef(map);
    // Fit map bounds to contain all markers
    fitBounds(map);
    MapZoom = map.getZoom();
		mapCenter = map.getCenter();
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDZNQlSlEIkFAct5VzUtsP4dSbvOr2bE18" // Add your API key
  });
  
  const options = {imagePath:"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"};
		
  return isLoaded ? (
    <>     
    <div className="relative justify-center">
      <GoogleMap      	  
      center={mapCenter}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={{ width: "100%", height: "600px" }}
      onLoad={loadHandler}
      zoom={MapZoom}      
    >
      <MarkerClusterer options={options}>
        {(clusterer) =>
          markers.map(({ id, name, position, item }:any) => (
            <Marker
              key={id}
			        position={position}
              onClick={() => handleActiveMarker(id)}
              clusterer={clusterer}              
            >
            {activeMarker === id ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>
                <h2>{name}</h2>
                <div className='address'>
                  <div>{item.address?.line1}</div>
                  <div>{`${item.address?.city}, ${item.address?.region} ${item.address?.postalCode}`}</div>
                </div>                             
              </div>
            </InfoWindow>
			) : null}
            </Marker>
          ))
        }
      </MarkerClusterer>
    </GoogleMap>	  
    </div>
    </>
  ) : <></>;


}
