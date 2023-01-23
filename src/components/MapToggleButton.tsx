import { useContext } from 'react';
import { LocationContext } from './LocationContext';
import { LocationActionTypes } from './locationReducers';
import { ReactComponent as MapIcon } from '../icons/map.svg';
import { ReactComponent as ListIcon } from '../icons/list.svg';

export default function MapToggleButton() {
  const { state, dispatch } = useContext(LocationContext);

  return (
    <div
      className="ml-auto flex justify-center space-x-3  font-heading text-base text-gold hover:underline"
      onClick={() => dispatch({ type: LocationActionTypes.ToggleMap, payload: { toggleMap: !state.showMap } })}>
      {state.showMap ? <ListIcon /> : <MapIcon />}
      <div>{state.showMap ? 'SHOW LIST' : 'SHOW MAP'}</div>
    </div>
  );
}
