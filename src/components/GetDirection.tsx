import * as React from "react";
import svgIcons  from "../assets/image/svgIcons.svg";
type Cta = {
  buttonText: any;
  address: any;
  latitude?: any;
  longitude?: any;
  label: any;


};

const GetDirection = (props: Cta) => {
  const { buttonText, label } = props;
//console.log(props.latitude);
  const getDirectionUrl = () => {
    var origin: any = null;
    if (props.address.city) {
      origin = props.address.city;
    } else if (props.address.region) {
      origin = props.address.region;
    } else {
      origin = props.address.country;
    }
    if (navigator.geolocation) {
      const error = (error: any) => {
        var getDirectionUrl =
          "https://www.google.com/maps/dir/?api=1&destination=" +
          props.latitude +
          "," +
          props.longitude +
          "&origin=" +
          origin;

        window.open(getDirectionUrl, "_blank");
      };
      navigator.geolocation.getCurrentPosition(
        function (position) {
          let currentLatitude = position.coords.latitude;
          let currentLongitude = position.coords.longitude;
          let getDirectionUrl =
            "https://www.google.com/maps/dir/?api=1&destination=" +
            props.latitude.latitude+
            "," +
            props.longitude.longitude +
            "&origin=" +
            currentLatitude +
            "," +
            currentLongitude;
          window.open(getDirectionUrl, "_blank");
        },
        error,
        {
          timeout: 10000,
        }
      );
    }
  };

  return (
    <>
      <a
        onClick={getDirectionUrl}
        className="direction notHighlight"
        rel="noopener noreferrer"
      >
        {" "}
       
        {label}
      </a>
    </>
  );
};

export default GetDirection;
