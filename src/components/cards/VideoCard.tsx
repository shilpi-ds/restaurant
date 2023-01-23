import { useComposedCssClasses } from '../../hooks/useComposedCssClasses';
import { CardProps } from '../../models/cardComponent';

//prettier-ignore
export interface ClassCardConfig {
  showOrdinal?: boolean
}

//prettier-ignore
export interface ClassCardProps extends CardProps {
  configuration: ClassCardConfig
}

//prettier-ignore
export interface ClassData {
  videos: any;
  name?: string,
}

//prettier-ignore
export interface VideoCardCssClasses {
  title?: string,
  ctaButton?: string,
}

const builtInCssClasses: VideoCardCssClasses = {
  title: 'text-lg font-medium font-body font-bold text-cforange truncate',
  ctaButton: 'flex justify-center place-items-center border w-full rounded-md mt-4 hover:bg-orange-900 h-9 ',
};

export function VideoCard(props: ClassCardProps): JSX.Element {
  const { result } = props;
  const videodata = result.rawData as unknown as ClassData;
  const namea = videodata.name;
  const NewVideosData : any = result.rawData as unknown ; 
  const NewVideos = NewVideosData.videos ? NewVideosData.videos[0].video.url : null;
  const cssClasses = useComposedCssClasses(builtInCssClasses);

  return (
    <>
    <iframe width="420" height="345" src={NewVideos}>
    </iframe>
    <div>
    <a className={cssClasses.title} href="https://communityfibre.co.uk/">{namea}</a>
    <a className={cssClasses.ctaButton} href="https://communityfibre.co.uk/">Check Availability</a>
    <a className={cssClasses.ctaButton} href="https://communityfibre.co.uk/">Read more</a>
    </div>
    </>
  );
}
