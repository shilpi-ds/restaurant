import { MapLocationData } from './mapbox/Mapbox';

// prettier-ignore
type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key,
        payload: M[Key]
      }
};

export enum LocationActionTypes {
  ToggleMap = 'TOGGLE_MAP',
  SetHoveredLocation = 'SET_HOVERED_LOCATION',
  SetSelectedLocation = 'SET_SELECTED_LOCATION',
  ClearHoveredLocation = 'CLEAR_HOVERED_LOCATION',
  ClearSelectedLocation = 'CLEAR_SELECTED_LOCATION',
  SetMapLocations = 'SET_MAP_LOCATIONS',
  ClearMapLocations = 'CLEAR_MAP_LOCATIONS',
  SetNoGymsMessage = 'SET_NO_GYMS_MESSAGE',
  ClearNoGymsMessage = 'CLEAR_NO_GYMS_MESSAGE',
}

// Map Toggle

// prettier-ignore
type MapPayload = {
  [LocationActionTypes.ToggleMap]: {
    toggleMap: boolean
  }
}

export type MapActions = ActionMap<MapPayload>[keyof ActionMap<MapPayload>];

export const toggleShowMapReducer = (state: boolean, action: MapActions | LocationActions) => {
  switch (action.type) {
    case LocationActionTypes.ToggleMap:
      return action.payload.toggleMap;
    default:
      return state;
  }
};

// Location(s)

//prettier-ignore
type LocationPayload = {
  [LocationActionTypes.SetHoveredLocation]: {
    hoveredLocation: MapLocationData
  },
  [LocationActionTypes.SetSelectedLocation]: {
    selectedLocation: MapLocationData
  },
  [LocationActionTypes.ClearHoveredLocation]: {},
  [LocationActionTypes.ClearSelectedLocation]: {},
  [LocationActionTypes.SetMapLocations]: {
    mapLocations: MapLocationData[]
  },
  [LocationActionTypes.ClearMapLocations]: [],
  [LocationActionTypes.SetNoGymsMessage]: string,
  [LocationActionTypes.ClearNoGymsMessage]: undefined
}

export type LocationActions = ActionMap<LocationPayload>[keyof ActionMap<LocationPayload>];

export const hoveredLocationReducer = (state: MapLocationData | undefined, action: MapActions | LocationActions) => {
  switch (action.type) {
    case LocationActionTypes.SetHoveredLocation:
      return action.payload.hoveredLocation;
    case LocationActionTypes.ClearHoveredLocation:
      return undefined;
    default:
      return state;
  }
};

export const selectedLocationReducer = (state: MapLocationData | undefined, action: MapActions | LocationActions) => {
  switch (action.type) {
    case LocationActionTypes.SetSelectedLocation:
      return action.payload.selectedLocation;
    case LocationActionTypes.ClearSelectedLocation:
      return undefined;
    default:
      return state;
  }
};

export const mapLocationsReducer = (state: MapLocationData[], action: MapActions | LocationActions) => {
  switch (action.type) {
    case LocationActionTypes.SetMapLocations:
      return action.payload.mapLocations;
    case LocationActionTypes.ClearMapLocations:
      return [];
    default:
      return state;
  }
};

export const noGymsLocationReducer = (state: string | undefined, action: MapActions | LocationActions) => {
  switch (action.type) {
    case LocationActionTypes.SetNoGymsMessage:
      return action.payload;
    case LocationActionTypes.ClearNoGymsMessage:
      return undefined;
    default:
      return state;
  }
};
