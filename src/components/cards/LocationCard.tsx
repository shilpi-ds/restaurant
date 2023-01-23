import { useComposedCssClasses } from '../../hooks/useComposedCssClasses';
import { CardProps } from '../../models/cardComponent';
import { JSXElementConstructor, ReactElement, ReactNodeArray, ReactPortal, useContext } from 'react';
import { LocationContext } from '../LocationContext';
import { LocationActionTypes } from '../locationReducers';


//prettier-ignore
export interface LocationCardConfig {
  showOrdinal?: boolean
}

//prettier-ignore
export interface LocationCardProps extends CardProps {
  configuration: LocationCardConfig
}

//prettier-ignore
interface Address {
  line1: string,
  city: string,
  countryCode: string,
  postalCode: string,
  region: string
}

//prettier-ignore
export interface Interval {
  start: string,
  end: string
}

//prettier-ignore
interface DayHours {
  isClosed: boolean,
  // TODO: change to optional field
  openIntervals: Interval[]
}

//prettier-ignore
export interface Hours {
  monday: DayHours,
  tuesday: DayHours,
  wednesday: DayHours,
  thursday: DayHours,
  friday: DayHours,
  saturday: DayHours,
  sunday: DayHours
}

//prettier-ignore
export interface LocationData {
  mainPhone: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined;
  id: string,
  address?: Address,
  name?: string,
  hours?: Hours,
  photoGallery?: any,
  
}

const builtInCssClasses = {
  container: 'flex flex-col justify-between border-b p-4 shadow-sm hoverlist result',
  header: 'flex text-base',
  body: 'flex justify-between pt-2.5 text-sm font-body',
  descriptionContainer: 'text-sm',
  ctaContainer: 'flex flex-col justify-between ml-4',
  cta1: 'min-w-max bg-blue-600 text-white font-medium rounded-lg py-2 px-5 shadow',
  cta2: 'min-w-max bg-white text-blue-600 font-medium rounded-lg py-2 px-5 mt-2 shadow',
  ordinal: 'mr-1.5 text-lg font-medium',
  title: 'text-lg font-medium font-body font-bold',
  ctaButton: 'flex justify-center border-2 w-2/5 rounded-md self-center	align-middle mt-4 hover:bg-gray-400',
};

// TODO: format hours, hours to middle, fake CTAs on the right, hours to show current status and then can be expanded, limit to 3 results for now, margin between map
export function LocationCard(props: LocationCardProps): JSX.Element {
  const { result } = props;
  const location = result.rawData as unknown as LocationData;

  const cssClasses = useComposedCssClasses(builtInCssClasses);

  const screenSize = 'sm';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { state, dispatch } = useContext(LocationContext);




 

  function renderHours(hours?: Hours) {
    // if day has openIntervals
    let classTime = '';
    switch (new Date().getDay()) {
      case 0:
        if (hours?.monday.isClosed) {
          return getGymText(true, '');
        } else {
          return getGymText(false, hours?.monday.openIntervals[0].end);
        }
      case 1:
        if (hours?.tuesday.isClosed) {
          return getGymText(true, '');
        } else {
          return getGymText(false, hours?.tuesday.openIntervals[0].end);
        }
      case 2:
        if (hours?.wednesday.isClosed) {
          return getGymText(true, '');
        } else {
          return getGymText(false, hours?.wednesday.openIntervals[0].end);
        }
      case 3:
        if (hours?.thursday.isClosed) {
          return getGymText(true, '');
        } else {
          return getGymText(false, hours?.thursday.openIntervals[0].end);
        }
      case 4:
        if (hours?.friday.isClosed) {
          return getGymText(true, '');
        } else {
          return getGymText(false, hours?.friday.openIntervals[0].end);
        }
      case 5:
        if (hours?.saturday.isClosed) {
          return getGymText(true, '');
        } else {
          return getGymText(false, hours?.saturday.openIntervals[0].end);
        }
      case 6:
        if (hours?.sunday.isClosed) {
          return getGymText(true, '');
        } else {
          return getGymText(false, hours?.sunday.openIntervals[0].end);
        }
    }

    if (!classTime) return;

    return <div className={cssClasses.body}>{classTime}</div>;
  }

  function getGymText(isClosed: boolean, time?: string) {
    return (
      <div className="flex flex-col text-sm">
        <span className="font-bold">{isClosed ? 'Closed' : 'Open'}</span>
        <span>{isClosed ? `Opens at ${time}` : `Closes at ${formatTime(time)}`}</span>
      </div>
    );
  }

  // TODO: move to util class and use in ClassCard
  function formatTime(time?: string) {
    if (!time) return;
    let hour: string | number = time.slice(0, 2);
    const ampm = +hour < 12 ? 'AM' : 'PM';
    hour = +hour % 12 || 12;
    return `${hour}:${time.slice(3, 5)}${ampm}`;
  }

  const setHoveredLocation = () =>
    dispatch({ type: LocationActionTypes.SetHoveredLocation, payload: { hoveredLocation: location } });

  const clearHoveredLocation = () => dispatch({ type: LocationActionTypes.ClearHoveredLocation, payload: {} });

  return (
    <div
      id={"result-"+location.id}
      className={cssClasses.container}
      onMouseOver={() => setHoveredLocation()}
      onMouseLeave={() => clearHoveredLocation()}>
      <div className={cssClasses.header}>
        {/* {configuration.showOrdinal && result.index && renderOrdinal(result.index)} */}

      </div>




      <a className={cssClasses.title} href="https://communityfibre.co.uk/">{location.name}</a>

      <div className={cssClasses.descriptionContainer}>
        <img className=" " src="https://www.kindpng.com/picc/m/705-7056384_address-png-file-address-icon-png-transparent-png.png" width="28" height="28"
                alt="" />
        <div>{location.address?.line1}</div>
        <div>{`${location.address?.city},${location.address?.postalCode}`}</div>
        <div>{`${location.address?.region}`}</div>
      </div>


      {/* {renderHours(location.hours)} */}

<div className="flex flex-row  items-center lp-param-results lp-subparam-phoneNumber map-add">
<div className="mr-2 mt-1"><img className=" " src="https://static.vecteezy.com/system/resources/thumbnails/003/720/476/small/phone-icon-telephone-icon-symbol-for-app-and-messenger-vector.jpg" width="28" height="28" alt="" />
</div>
<div className="phone "><a id="address" className="" href={`tel:${location.mainPhone}`}>{location.mainPhone}</a>
</div></div>
      <a className={cssClasses.ctaButton} href="https://communityfibre.co.uk/">Get Directions</a>
      
      {screenSize !== 'sm' && (
        <div className={cssClasses.ctaButton}>
          <div className="sm:text-body align-middle font-heading text-3xl font-bold sm:text-base">JOIN US</div>
        </div>
      )}
    </div>
  );
}
