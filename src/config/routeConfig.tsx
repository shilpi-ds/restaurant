import UniversalSearchPage from '../pages/UniversalSearchPage';
import FAQsPage from '../pages/FAQsPage';
import { universalResultsConfig } from './universalResultsConfig';
import LocationsPage from '../pages/LocationsPage'; 
import PlansPage from '../pages/PlansPage';
import VideoPage from '../pages/VideoPage';
import SwitchPage from '../pages/SwitchPage';
import MenusPage from '../pages/MenusPage';


export const routeConfig = [
  {
    path: '/',
    exact: true,
    page: <UniversalSearchPage universalResultsConfig={universalResultsConfig} />
  },
  {
    path: '/locations',
    page: <LocationsPage verticalKey="locations" />
  },
  // {
  //   path: '/plans',
  //   page: <PlansPage verticalKey='cf-plans' />
  // },
  // {
  //   path: '/switch',
  //   page: <SwitchPage verticalKey='switch' />
  // },
  // {
  //   path: '/videos',
  //   page: <VideoPage verticalKey='videos' />
  // },
  {
    path: '/faqs',
    page: <FAQsPage verticalKey='faqs'/>
  },
  {
    path: '/menus',
    page: <MenusPage verticalKey='menu_items'/>
  },
 
];