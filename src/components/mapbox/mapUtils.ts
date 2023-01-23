import Geocode from 'react-geocode'; 

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
} 

export function distanceInKmBetweenCoordinates(lat1?: number, lon1?: number, lat2?: number, lon2?: number) {
  // returns 0 km if any params are missing
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

//prettier-ignore
export interface GoogleLocation {
  lng?: number,
  lat?: number,
  city?: string,
  state?: string
}

export async function getGeocodeForQuery(query: string): Promise<GoogleLocation> {
  if (process.env.REACT_APP_GOOGLE_API_KEY) {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
    try {
      const response = await Geocode.fromAddress(query);

      if (response) {
        const { lng, lat } = response.results[0].geometry.location;

        let city, state;
        for (let i = 0; i < response.results[0].address_components.length; i++) {
          for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
            switch (response.results[0].address_components[i].types[j]) {
              case 'locality':
                city = response.results[0].address_components[i].long_name;
                break;
              case 'administrative_area_level_1':
                state = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }

        return { lng, lat, city, state };
      } else {
        return {};
      }
    } catch (error) {
      console.log('Invalid Address');
      return {};
    }
  } else {
    return {};
  }
}
