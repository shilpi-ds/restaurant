import { Link } from 'react-router-dom';
import { AppliedFiltersDisplay, AppliedFiltersProps } from '../components/AppliedFilters';
import { ResultsCountConfig } from '../components/ResultsCount';
import { useComposedCssClasses, CompositionMethod } from '../hooks/useComposedCssClasses';
import { useAnswersState } from '@yext/answers-headless-react';
import { DisplayableFilter } from '../models/displayableFilter';
import { ResponsiveContext } from '../App';
import { useContext } from 'react';
import { LocationContext } from '../components/LocationContext';
import { LocationActionTypes } from '../components/locationReducers';
import MapToggleButton from '../components/MapToggleButton';

//prettier-ignore
interface SectionHeaderCssClasses {
  sectionHeaderContainer?: string,
  sectionHeaderIconContainer?: string,
  sectionHeaderLabel?: string,
  viewMoreContainer?: string,
  viewMoreLink?: string,
  appliedFiltersContainer?: string
}

// TODO: change back to default classes and pass in custom
const builtInCssClasses: SectionHeaderCssClasses = {
  sectionHeaderContainer: 'flex items-center w-full pl-1 mb-4',
  sectionHeaderIconContainer: 'w-5 h-5',
  sectionHeaderLabel: 'font-bold font-body text-3xl ',
  viewMoreContainer: 'flex justify-end flex-grow ml-auto font-medium text-gray-800',
  viewMoreLink: 'text-cforange pr-1 pl-3',
  appliedFiltersContainer: 'ml-3',
};

// prettier-ignore
interface SectionHeaderConfig {
  label: string,
  resultsCountConfig?: ResultsCountConfig,
  appliedFiltersConfig?: AppliedFiltersProps,
  customCssClasses?: SectionHeaderCssClasses,
  cssCompositionMethod?: CompositionMethod,
  verticalKey: string,
  viewAllButton?: boolean,
  viewMapButton?: boolean
}

// TODO: Create Locations Header
export default function SectionHeader(props: SectionHeaderConfig): JSX.Element {
  const {
    label,
    verticalKey,
    viewAllButton = false,
    viewMapButton = false,
    appliedFiltersConfig,
    customCssClasses,
    cssCompositionMethod,
  } = props;
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);
  const latestQuery = useAnswersState((state) => state.query.mostRecentSearch);
  const screenSize = useContext(ResponsiveContext);
  const displayableFilters =
    appliedFiltersConfig?.appliedQueryFilters?.map((appliedQueryFilter): DisplayableFilter => {
      return {
        filterType: 'NLP_FILTER',
        filter: appliedQueryFilter.filter,
        groupLabel: appliedQueryFilter.displayKey,
        label: appliedQueryFilter.displayValue,
      };
    }) ?? [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { state, dispatch } = useContext(LocationContext);

  return (
    <div className={cssClasses.sectionHeaderContainer}>
      {/* <div className={cssClasses.sectionHeaderIconContainer}> 
        <CollectionIcon></CollectionIcon>
      </div> */}
      <h2 className={cssClasses.sectionHeaderLabel}>{label}</h2>
      {/* TODO (cea2aj): Add support for ResultsCountDisplay once we get the mocks from UX
        {resultsCountConfig &&
           <ResultsCountDisplay resultsLength={resultsCountConfig.resultsLength} resultsCount={resultsCountConfig.resultsCount} />} */}
      {appliedFiltersConfig && (
        <div className={cssClasses.appliedFiltersContainer}>
          <AppliedFiltersDisplay displayableFilters={displayableFilters} />
        </div>
      )}
      {/* TODO: clean up logic */}
      {viewAllButton && screenSize !== 'sm' && (!viewMapButton || (viewMapButton && screenSize === 'xl')) && (
        <div className={cssClasses.viewMoreContainer}>
          <Link className={cssClasses.viewMoreLink} to={`/${verticalKey}?query=${latestQuery}`}>
            View all
          </Link>
        </div>
      )}
      {viewMapButton && screenSize !== 'xl' && <MapToggleButton />}
    </div>
  );
}
