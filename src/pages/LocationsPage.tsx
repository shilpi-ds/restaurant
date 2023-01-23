import ResultsCount from '../components/ResultsCount';
import DirectAnswer from '../components/DirectAnswer';
import SpellCheck from '../components/SpellCheck';
import LocationBias from '../components/LocationBias';
import usePageSetupEffect from '../hooks/usePageSetupEffect';
import { LocationCard } from '../components/cards/LocationCard';
import { LocationProvider } from '../components/LocationContext';
import { useAnswersState } from '@yext/answers-headless-react';
import LocationResults from '../components/LocationResults';
import MapToggleButton from '../components/MapToggleButton';
import Footer from '../components/Footer';


export default function LocationsPage({ verticalKey }: { verticalKey: string }) {
  usePageSetupEffect(verticalKey);
  const screenSize = 'sm';  
  const results = useAnswersState((state) => state.vertical.results) || [];
  
  return (
    <><LocationProvider>
      <div className="flex">
        <div className="flex-grow">
          <DirectAnswer />
          <SpellCheck
            cssCompositionMethod="assign"
            customCssClasses={{
              container: 'font-body text-xl',
              helpText: '',
              link: 'text-gold font-bold cursor-pointer hover:underline focus:underline',
            }} />
          <ResultsCount cssCompositionMethod="assign" customCssClasses={{ text: 'text-sm font-body' }} />
          {screenSize === 'sm' && (
            <div className="pb-2">
              <MapToggleButton />
            </div>
          )}
          <LocationResults results={results} verticalKey={verticalKey} cardConfig={{ CardComponent: LocationCard }} />
          <LocationBias customCssClasses={{ container: 'p-8' }} />
        </div>
      </div>
    </LocationProvider><Footer /></>
  );
}
