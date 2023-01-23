import ResultsCount from '../components/ResultsCount';
import AlternativeVerticals from '../components/AlternativeVerticals';
import AppliedFilters from '../components/AppliedFilters';
import DirectAnswer from '../components/DirectAnswer';
import VerticalResults from '../components/VerticalResults';
import SpellCheck from '../components/SpellCheck';
import LocationBias from '../components/LocationBias';
import usePageSetupEffect from '../hooks/usePageSetupEffect';
import { ResponsiveContext } from '../App';
import { useContext } from 'react';
import { useAnswersState } from '@yext/answers-headless-react';
import MobileFilterLayout from '../components/MobileFilterLayout';
import ClassFacets from '../components/ClassFacets';
import { SwitchCard } from '../components/cards/SwitchCard';
import Footer from '../components/Footer';

export default function PlansPage({ verticalKey }: { verticalKey: string }) {
  const screenSize = useContext(ResponsiveContext);
  usePageSetupEffect( verticalKey );

  const classFacetOptions = useAnswersState((state) => state.filters.facets?.flatMap((facet) => facet.options));

  return (
    <><div>
          <DirectAnswer />
          <SpellCheck
              cssCompositionMethod="assign"
              customCssClasses={{
                  container: 'font-body text-xl',
                  helpText: '',
                  link: 'text-cforange font-bold cursor-pointer hover:underline focus:underline',
              }} />
          <ResultsCount cssCompositionMethod="assign" customCssClasses={{ text: 'text-sm font-body' }} />
          <AlternativeVerticals
              currentVerticalLabel="Switch"
              verticalsConfig={[
                  { label: 'Locations', verticalKey: 'locations' },
                  { label: 'Faqs', verticalKey: 'faqs' },
                  { label: 'Plans', verticalKey: 'cf-plans' },
                  { label: 'Video', verticalKey: 'video' },
              ]}
              cssCompositionMethod="assign"
              customCssClasses={{
                  container: 'flex flex-col justify-between mb-4 p-4 shadow-sm',
                  noResultsText: 'text-lg font-heading pb-2',
                  categoriesText: 'font-body',
                  suggestions: 'pt-4 ',
                  suggestion: 'pb-4 text-cforange font-heading',
                  allCategoriesLink: 'text-cforange cursor-pointer hover:underline focus:underline',
              }} />
          {classFacetOptions && classFacetOptions.length > 0 && screenSize !== 'sm' && <ClassFacets />}
          <div className="justify-center space-x-4">
              <VerticalResults
                  CardComponent={SwitchCard}
                  displayAllOnNoResults={true}
                  customCssClasses={{ container: 'sm:flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:w-4/5 gap-4' }} />
          </div>
          <LocationBias customCssClasses={{ container: 'p-8' }} />
          {classFacetOptions && classFacetOptions.length > 0 && screenSize === 'sm' && <MobileFilterLayout />}
      </div><Footer /></>
  );
}
