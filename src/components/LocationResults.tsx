import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { SectionConfig } from '../models/sectionComponent';
import AlternativeVerticals from './AlternativeVerticals';
import { StandardCard } from './cards/StandardCard';
import { LocationContext } from './LocationContext';
import { LocationActionTypes } from './locationReducers';
import Mapbox, { MapLocationData } from './mapbox/Mapbox';
import { VerticalResultsDisplay } from './VerticalResults'; 
import MapGoogle  from './mapbox/MapGoogle';

interface LocationResultsProps extends SectionConfig {}

export default function LocationResults(props: LocationResultsProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { state, dispatch } = useContext(LocationContext);
  const screenSize = 'xl';

  const { results, cardConfig } = props;
  const cardComponent = cardConfig?.CardComponent || StandardCard;
  
  useEffect(() => {
    const mapLocations: MapLocationData[] = [];
    for (const result of results) {
      const location = result.rawData as unknown as MapLocationData;
      if (result.id && location.yextDisplayCoordinate) {
        mapLocations.push({
          id: result.id ?? '',
          name: location.name,
          address: location.address,
          yextDisplayCoordinate: {
            latitude: location.yextDisplayCoordinate.latitude,
            longitude: location.yextDisplayCoordinate.longitude,
          },
          mainPhone: location.mainPhone
        });
      }
    }
    dispatch({ type: LocationActionTypes.SetMapLocations, payload: { mapLocations } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const renderMap = () => {
    if (!state.mapLocations) return null;

    return <MapGoogle />;
  };

  return (
    <div className="flex">
      <div
        className={classNames('overflow-y-auto sm:overflow-auto sm:border lg:w-1/3', {
          hidden: state.showMap,
          'w-full': !state.showMap,
        })}
        style={{ maxHeight: '580px' }}>
        {state.mapLocations && state.mapLocations.length > 0 ? (
          <VerticalResultsDisplay
            results={results}
            CardComponent={cardComponent}
            {...(cardConfig && { cardConfig })}
            customCssClasses={{ container: 'px-4 sm:px-0' }}
          />
        ) : state.noGymsMessage ? (
          <div className="flex h-full items-center justify-center">
            <span className="font-heading text-xl">{state.noGymsMessage}</span>
          </div>
        ) : (
          <AlternativeVerticals
            currentVerticalLabel="Locations"           
            verticalsConfig={[
              { label: 'FAQs', verticalKey: 'faqs' },
              { label: 'Plans', verticalKey: 'cf-plans' },
              { label: 'Switch', verticalKey: 'switch' },
              { label: 'Videos', verticalKey: 'videos' },
            ]}
            cssCompositionMethod="assign"
            customCssClasses={{
              container: 'flex flex-col justify-between mb-4 p-4 shadow-sm',
              noResultsText: 'text-lg font-heading pb-2',
              categoriesText: 'font-body',
              suggestions: 'pt-4 ',
              suggestion: 'pb-4 text-gold font-heading',
              allCategoriesLink: 'text-gold cursor-pointer hover:underline focus:underline',
            }}
          />
        )}
      </div>
      <div className={classNames('w-full xl:w-3/4', { hidden: screenSize !== 'xl' && !state.showMap })}>
        {renderMap()}
      </div>
    </div>
  );
}
