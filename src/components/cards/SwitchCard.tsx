import { useComposedCssClasses } from '../../hooks/useComposedCssClasses';
import { CardProps } from '../../models/cardComponent';
import { Hours, Interval } from './LocationCard';
import { ResponsiveContext } from '../../App';
import { useContext } from 'react';
import { useAnswersState } from '@yext/answers-headless-react';
import classNames from 'classnames';


//prettier-ignore
export interface ClassCardConfig {
  showOrdinal?: boolean
}

//prettier-ignore
export interface ClassCardProps extends CardProps {
  configuration: ClassCardConfig
}

//prettier-ignore
interface Trainer {
  entityId: string,
  name: string
}



//prettier-ignore
export interface ClassData {
  name?: string,
  c_trainer?: Trainer[],
  c_time?: Hours
}

//prettier-ignore
export interface TrainerCardCssClasses {
  container?: string,
  descriptionContainer?: string,
  title?: string,
  body?: string,
  ctaButton?: string,
  ctaButtonText?: string
}

const builtInCssClasses: TrainerCardCssClasses = {
  container: 'flex sm:justify-between border-b p-4 shadow-sm max-w-64',
  descriptionContainer: 'w-full text-sm',
  title: 'text-lg font-medium font-body font-bold text-cforange truncate',
  body: 'text-base font-medium font-body',
  ctaButton: 'flex justify-center place-items-center border w-full rounded-md mt-4 hover:bg-orange-900 h-9 ',
  ctaButtonText: 'font-heading font-bold text-base',
};

// TODO: format hours, hours to middle, fake CTAs on the right, hours to show current status and then can be expanded, limit to 3 results for now, margin between map
export function SwitchCard(props: ClassCardProps): JSX.Element {
  const { result } = props;
  const description = result.description;
  const name = result.name;
  const screenSize = useContext(ResponsiveContext);
  const cssClasses = useComposedCssClasses(builtInCssClasses);

  return (
    <>
    <div>{name}</div>
    <div>{description}</div>
    <div className="my-2 mx-4 flex max-w-xl py-4 sm:flex-col">
      {screenSize !== 'sm' && (
        <div className={cssClasses.ctaButton}>
          <div className={cssClasses.ctaButtonText}>Check availability</div>
        </div>
      )}
      {screenSize !== 'sm' && (
        <div className={cssClasses.ctaButton}>
          <div className={cssClasses.ctaButtonText}>Read more</div>
        </div>
      )}
    </div></>
  );
}
