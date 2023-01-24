import { useAnswersState } from '@yext/answers-headless-react';
import { useContext } from 'react';
import { ResponsiveContext } from '../../App';
import { useComposedCssClasses } from '../../hooks/useComposedCssClasses';
import { CardProps } from '../../models/cardComponent';
//import GetDirection from '../GetDirection';

//prettier-ignore
export interface TrainerCardConfig {
  showOrdinal?: boolean
}

//prettier-ignore
export interface TrainerCardProps extends CardProps {
  configuration: TrainerCardConfig
}

//prettier-ignore
export interface SimpleImage {
  url: string,
  width: number,
  height: number
}

//prettier-ignore
export interface Image extends SimpleImage {
  sourceUrl: string,
  thumbnails: SimpleImage[]
}

//prettier-ignore
interface PrimaryPhoto {
  image?: Image
}

interface CtaData { 
  label: string,
  link: string,
  linkType: string
}

function isCtaData(data: unknown): data is CtaData {
  //console.log(data);
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const expectedKeys = ['label', 'link', 'linkType'];
  return expectedKeys.every(key => {
    return key in data;
  });
}


//prettier-ignore
export interface TrainerData {
  id: any | null | undefined;
  answer: string | undefined;
  name?: string,
  description?:string,
  c_inspirationalQuote?: string,
  primaryPhoto?: PrimaryPhoto,
  c_orderNow?: CtaData,
 // c_orderNowUrl?: string,
}

//prettier-ignore
export interface TrainerCardCssClasses {
  container?: string,
  descriptionContainer?: string,
  name?: string,
  // TODO: why can't I use the tailwind pixels here
  trainerPhoto?: string,
  ctaButton?: string,
  ctaButtonText?: string
}

//prettier-ignore
const builtInCssClasses: TrainerCardCssClasses = {
  container: 'flex flex-col p-4 shadow-sm my-2 align-items-center',
  descriptionContainer: 'w-full text-sm font-heading ',
  name: 'text-xl font-medium font-body font-bold',
  ctaButton: 'flex border rounded-md mt-4 px-4 bg-black justify-center hover:bg-orange-900',
  ctaButtonText: 'font-heading text-black font-bold text-base px-3 py-3 sm:py-0',
};

// TODO: format hours, hours to middle, fake CTAs on the right, hours to show current status and then can be expanded, limit to 3 results for now, margin between map
export function MenuItemCard(props: TrainerCardProps): JSX.Element {
  const { result } = props;
  const trainer = result.rawData as unknown as TrainerData;
  const trainerImg = trainer.primaryPhoto?.image?.url ?? '';
 // const trainerCta=trainer.c_orderNow?.link??'';
  // const smallestThumbnail = trainer.logo?.image?.thumbnails[trainer.logo?.image?.thumbnails.length - 1].url

  const cta = isCtaData(result.rawData.c_orderNow) ? result.rawData.c_orderNow : undefined;
  console.log(cta);
 // const cta2 = isCtaData(result.rawData.c_secondaryCTA) ? result.rawData.c_secondaryCTA : undefined;

  // TODO (cea2aj) We need to handle the various linkType so these CTAs are clickable
  function renderCTAs(cta?: CtaData) {
    return (<>
      {(cta) && 
        <div>
          {cta && <a href={cta.link}>{cta.label}</a>}
       
        </div>
      }
    </>);
  }

  const screenSize = useContext(ResponsiveContext);

  const cssClasses = useComposedCssClasses(builtInCssClasses);

  function renderName(name?: string) {
    return <div className={cssClasses.name}>{name}</div>;
  }
  function renderDescription(description?: string) {
    return <div className={cssClasses.name}>{description}</div>;
  }
  function renderQuote(quote?: string) {
    return <div className={cssClasses.descriptionContainer}>{quote}</div>;
  }
  function renderPhoto(primaryPhoto?: PrimaryPhoto) {
    return <div className={cssClasses.descriptionContainer}><img src={trainerImg} height="200px" width="200px"/></div>;
  }
  const isVertical = useAnswersState((s) => s.meta.searchType) === 'vertical';

  return (
 <>




            <div className='text-red-600'>{renderName(trainer.name)}</div>
            <div>{renderDescription(trainer.description)}</div>
            <div>{renderPhoto(trainer.primaryPhoto)}</div>
            <div>{renderCTAs(cta)}</div>
           
           
            </>
  );
}
