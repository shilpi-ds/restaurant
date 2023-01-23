import { useAnswersState } from '@yext/answers-headless-react';
import { useState } from 'react';
import ClassFacets from './ClassFacets';
import { Divider } from './StaticFilters';

export default function MobileFilterLayout() {
  const [isPopupUpOpen, setIsPopupOpen] = useState(false);

  const resultsCount = useAnswersState((state) => state.vertical.resultsCount);

  const toggleFilterPopup = () => {
    setIsPopupOpen(!isPopupUpOpen);
    if (document.body.style.overflow !== 'hidden') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }
  };

  return (
    <div>
      {isPopupUpOpen && (
        <div className="absolute top-0 left-0 right-0 z-10 flex h-full w-full flex-col bg-black sm:top-0">
          <div className="my-8 flex w-full justify-center font-heading text-2xl text-black">Filter</div>
          <Divider customCssClasses={{ divider: 'w-full h-px bg-gray-200 my-1' }} cssCompositionMethod="assign" />
          <div className="mb-24 overflow-y-auto">
            <ClassFacets isMobile />
          </div>
          <div className="absolute bottom-0 w-full bg-black">
            <div className="mb-5 flex w-full flex-col items-center">
              <Divider customCssClasses={{ divider: 'w-full h-px bg-gray-200 mb-2' }} cssCompositionMethod="assign" />
              <div
                className="flex h-16 w-5/6 items-center justify-center rounded-3xl border-4 bg-black"
                onClick={() => toggleFilterPopup()}>
                <div className="text-center font-heading text-xl text-black">{`VIEW ${resultsCount} RESULTS`}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
