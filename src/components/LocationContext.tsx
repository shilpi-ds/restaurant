import { createContext, Dispatch, useReducer } from 'react';
import {
  toggleShowMapReducer,
  hoveredLocationReducer,
  selectedLocationReducer,
  MapActions,
  LocationActions,
  mapLocationsReducer,
  noGymsLocationReducer,
} from './locationReducers';
import { MapLocationData } from './mapbox/Mapbox';

//prettier-ignore
type LocationStateType = {
  hoveredLocation?: MapLocationData,
  selectedLocation?: MapLocationData,
  mapLocations?: MapLocationData[],
  showMap: boolean,
  noGymsMessage?: string
};

const locationState = {
  showMap: false,
};

//prettier-ignore
export const LocationContext = createContext<{ state: LocationStateType, dispatch: Dispatch<MapActions | LocationActions> }>({
  state: locationState,
  dispatch: () => null,
});

const mainReducer = (
  { hoveredLocation, selectedLocation, mapLocations, showMap, noGymsMessage }: LocationStateType,
  action: MapActions | LocationActions
): LocationStateType => {
  const newState = {
    hoveredLocation: hoveredLocationReducer(hoveredLocation, action),
    selectedLocation: selectedLocationReducer(selectedLocation, action),
    mapLocations: mapLocationsReducer(mapLocations ?? [], action),
    showMap: toggleShowMapReducer(showMap, action),
    noGymsMessage: noGymsLocationReducer(noGymsMessage, action),
  };
  return newState;
};

export const LocationProvider: React.FC = ({ children }: any) => {
  const [state, dispatch] = useReducer(mainReducer, locationState);

  return <LocationContext.Provider value={{ state, dispatch }}>{children}</LocationContext.Provider>;
};
