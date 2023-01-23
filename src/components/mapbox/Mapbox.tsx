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

mapboxgl.accessToken = 'pk.eyJ1IjoiYXBhdmxpY2siLCJhIjoiY2t5NHJkODFvMGV3ZDJ0bzRnNDI1ZTNtZiJ9.VA2eTvz6Cf9jX_MG2r6u0g';

// prettier-ignore
export interface MapLocationData extends LocationData {
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

export default function Mapbox(): JSX.Element {
  const [markers, setMarkers] = useState<MapMarkers>({});
  const [bounds, setBounds] = useState<mapboxgl.LngLatBounds>();
  //prettier-ignore
  const [mapState, setMapState] = useState<{ mapCenter?: LngLat, mapBounds?: LngLatBounds, zoom?: number } | undefined>();
  //prettier-ignore
  const [prevMapState, setPrevMapState] = useState<{ mapCenter?: LngLat, mapBounds?: LngLatBounds, zoom?: number } | undefined>();
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [mapboxSearchType, setMapboxSearchType] = useState<MapboxSearchType>('none');
  const [newCenter, setFlyTo] = useState<LngLat | undefined>();

  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);
  const { state, dispatch } = useContext(LocationContext);

  const answersActions = useAnswersActions();
  const searchType = useAnswersState((state) => state.meta.searchType);
 // const mostRecentSearch = useAnswersState((state) => state.query.mostRecentSearch);
  const query = useAnswersState((state) => state.query.input);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current || '',
      style: 'mapbox://styles/mapbox/light-v10',
      interactive: true,
      zoom: 9,
    });

    // disable map rotation using right click + drag
    map.current.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map.current.touchZoomRotate.disableRotation();

    // Add zoom and rotation controls to the map.
    map.current.addControl(new mapboxgl.NavigationControl());
  }, []);

  useEffect(() => { 
    if (map.current && bounds) {
      state.mapLocations?.forEach((location) => {
        if (
          location.yextDisplayCoordinate &&
          map.current &&
          !map.current
            ?.getBounds()
            .contains([location.yextDisplayCoordinate.longitude, location.yextDisplayCoordinate.latitude])
        ) {
          dispatch({ type: LocationActionTypes.ClearSelectedLocation, payload: {} });
          map.current.setCenter(bounds.getCenter());
          map.current.fitBounds(bounds, { padding: { top: 25, bottom: 25, left: 25, right: 25 }, maxZoom: 15 });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  // resize map when showMap is clicked
  useEffect(() => {
    state.showMap && map.current && map.current.resize();
  }, [state.showMap]);

  useEffect(() => {
    if (!mapState) return;

    if (!prevMapState) {
      setPrevMapState(mapState);
    }

    if (prevMapState && !map.current?.isMoving()) {
      // set showSearchButton to true if zoom changes by more than 2 of if center of map moves more than 1 km
      if (
        Math.abs((prevMapState.zoom || 0) - (mapState?.zoom || 0)) > 2 ||
        distanceInKmBetweenCoordinates(
          prevMapState.mapCenter?.lat,
          prevMapState.mapCenter?.lng,
          mapState.mapCenter?.lat,
          mapState.mapCenter?.lng
        ) > 1
      ) {
        setShowSearchButton(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapState]);

  useEffect(() => {
    let markerRecord: MapMarkers = markers;
    if (map && map.current) {
      if (state.mapLocations && state.mapLocations.length !== 0) {
        dispatch({
          type: LocationActionTypes.ClearNoGymsMessage,
        });

        const bounds = new mapboxgl.LngLatBounds();

        // render new map pins
        for (const marker of (state.mapLocations || []).values()) {
          if (marker.yextDisplayCoordinate) {
            const coord: [number, number] = [
              marker.yextDisplayCoordinate.longitude,
              marker.yextDisplayCoordinate.latitude,
            ];
            marker.yextDisplayCoordinate && bounds.extend(coord);

            if (marker.id && !markers[marker.id]) {
              const pin_el = generateMapPin(marker);

              ReactDOM.render(<PinIcon />, pin_el);

              const mapMarker = new mapboxgl.Marker(pin_el);

              markerRecord = {
                ...markerRecord,
                [marker.id]: mapMarker,
              };

              new mapboxgl.Marker(pin_el).setLngLat(coord).addTo(map.current);
            }
          }
        }

        setBounds(bounds);
        setMarkers(markerRecord);
        setMapboxSearchType('none');
      } else if (mapboxSearchType === 'none') {
        // positionMapForNoResults();
        dispatch({
          type: LocationActionTypes.SetNoGymsMessage,
          payload: `Sorry! We don't have any locations here.`,
        });
      } else if (mapboxSearchType === 'google') {
        resizeToPoint();
        setMapboxSearchType('none');
      } else if (mapboxSearchType === 'button') {
        setMapboxSearchType('none');
      }

      // event listener to change map state after pins are placed
      map.current.on('moveend', () => {
        setMapState({
          mapBounds: map.current?.getBounds(),
          mapCenter: map.current?.getCenter(),
          zoom: Math.floor(map.current?.getZoom() || 0),
        });
      });
    }

    // remove pins not in search results
    for (const marker of Object.entries(markers)) {
      const [id, pin] = marker;
      if (!state.mapLocations || !state.mapLocations.map((ml) => ml.id).includes(id)) {
        pin.remove();
        delete markerRecord[id];
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.mapLocations]);

  // Handle when user hovers on Location Card
  useEffect(() => {
    Object.entries(markers).forEach((entry) => {
      const [locationId, marker] = entry;

      if (state.hoveredLocation?.id === locationId) {
        marker.getElement().style.color = '#f1c553';
      } else if (state.selectedLocation?.id !== locationId) {
        marker.getElement().style.color = 'white';
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hoveredLocation]);

  // Handle when user clicks on Location Pin
  useEffect(() => {
    Object.entries(markers).forEach((entry) => {
      const [locationId, marker] = entry;

      if (state.selectedLocation?.id === locationId) {
        marker.getElement().style.color = '#f1c553';
      } else if (state.hoveredLocation?.id !== locationId) {
        marker.getElement().style.color = 'white';
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedLocation]);

  function generateMapPin(marker: MapLocationData) {
    const pin_el = document.createElement('div');

    pin_el.setAttribute('id', `${marker.id}_pin`);
    pin_el.addEventListener('click', () => {
      handlePinClick(marker);
    });
    pin_el.addEventListener('mouseover', () =>
      dispatch({ type: LocationActionTypes.SetHoveredLocation, payload: { hoveredLocation: marker } })
    );
    pin_el.addEventListener('mouseleave', () =>
      dispatch({ type: LocationActionTypes.ClearHoveredLocation, payload: {} })
    );

    return pin_el;
  }

  function handlePinClick(selectedLocation: MapLocationData) {
    dispatch({ type: LocationActionTypes.SetSelectedLocation, payload: { selectedLocation } });
  }

  function handleSearchAreaButtonClick() {
    dispatch({ type: LocationActionTypes.ClearSelectedLocation, payload: {} });
    setShowSearchButton(false);
    setPrevMapState(undefined);
    const lastQuery = query;

    setMapboxSearchType('button');

    // set blank query with location filter
    answersActions.setQuery('');
    answersActions.setStaticFilters([
      {
        fieldId: 'builtin.location',
        selected: true,
        matcher: Matcher.Near,
        value: {
          radius:
            1000 *
            distanceInKmBetweenCoordinates(
              mapState?.mapCenter?.lat,
              mapState?.mapCenter?.lng,
              mapState?.mapBounds?.getNorthEast().lat,
              mapState?.mapCenter?.lng
            ),
          lat: mapState?.mapCenter?.lat as number,
          lng: mapState?.mapCenter?.lng as number,
        },
      },
    ]);
    answersActions.setUserLocation({
      latitude: mapState?.mapCenter?.lat as number,
      longitude: mapState?.mapCenter?.lng as number,
    });
    answersActions.setVertical('locations');

    answersActions.executeVerticalQuery();

    // reset state back from before button click
    answersActions.setQuery(lastQuery || '');
    answersActions.setStaticFilters([]);

    dispatch({
      type: LocationActionTypes.SetNoGymsMessage,
      payload: `Sorry! We don't have any locations here.`,
    });
  }
  
  //  no-lone-blocks
  {/* async function positionMapForNoResults() {
    const googleLocation = await getGeocodeForQuery(query || '');

    if (googleLocation.lng && googleLocation.lat) {
      setFlyTo(new LngLat(googleLocation.lng, googleLocation.lat));
      answersActions.setUserLocation({
        latitude: googleLocation.lat,
        longitude: googleLocation.lng,
      });
    }

    if (googleLocation.city || googleLocation.state) {
      let noGymsMessage = `Sorry! We don't have any locations in `;
      if (googleLocation.city && googleLocation.state) {
        noGymsMessage = noGymsMessage.concat(`${googleLocation.city}, ${googleLocation.state}.`);
      } else if (googleLocation.city) {
        noGymsMessage = noGymsMessage.concat(`${googleLocation.city}.`);
      } else if (googleLocation.state) {
        noGymsMessage = noGymsMessage.concat(`${googleLocation.state}.`);
      }

      dispatch({
        type: LocationActionTypes.SetNoGymsMessage,
        payload: noGymsMessage,
      });
      answersActions.setQuery(`${googleLocation.city}, ${googleLocation.state}`);
      answersActions.executeVerticalQuery();
      answersActions.setQuery(mostRecentSearch || '');
      setMapboxSearchType('google');
    } else {
      dispatch({
        type: LocationActionTypes.ClearNoGymsMessage,
      });
    }
  } */}

  function resizeToPoint() {
    if (map.current && newCenter) {
      map.current.setCenter(newCenter);
      map.current.resize();
      setFlyTo(undefined);
    }
  }

  return (
    <div className="relative justify-center">
      {/* TODO: remove inline style */}
      <div
        ref={mapContainer}
        style={{
          height: '580px',
        }}
      />
      {showSearchButton && searchType === 'vertical' && renderSearchAreaButton(handleSearchAreaButtonClick)}
      {state.selectedLocation &&
        renderSelectedLocation(
          state.selectedLocation.name,
          state.selectedLocation.address?.line1,
          `${state.selectedLocation.address?.city}, ${state.selectedLocation.address?.region}, ${state.selectedLocation.address?.postalCode}`
        )}
    </div>
  );
}
