const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoieWVtZGlnaXRhbCIsImEiOiJjanl0eHMxNm0wMGVpM2JtbDVydnJqcGE4In0.R8jEQo8vpMY91It7RDTuwA';
const map = new mapboxgl.Map({
  // renderWorldCopies: false,
  container: 'MAP',
  style: 'mapbox://styles/yemdigital/ckix544js5g6i19qkmoh51nbz',
  zoom: 1,
  center: [0, 0],
});
// disable map rotation using right click + drag
map.dragRotate.disable();
// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

export default class Map {
  static selectCountryOnMap(long, lat) {
    const WORDMARKERLONG = -15;
    const WORDMARKERLAT = -20;
    // if selected country is World
    if (long === WORDMARKERLONG && lat === WORDMARKERLAT) {
      map.flyTo({ center: [0, 0], zoom: 1 });
    } else {
      map.flyTo({ center: [long, lat], zoom: 4 });
    }
  }

  static updateMap(countriesData) {
    // set coutries markers on map
    Map.setMarkers(countriesData, map);
  }

  static setMarkerSize(number) {
    let size = 0;
    if (number < 1000) {
      size = 0.5;
    } else if (number < 3000) {
      size = 0.6;
    } else if (number < 20000) {
      size = 0.7;
    } else if (number < 50000) {
      size = 0.8;
    } else if (number < 100000) {
      size = 0.9;
    } else if (number < 250000) {
      size = 1;
    } else if (number < 500000) {
      size = 1.2;
    } else if (number < 1000000) {
      size = 1.3;
    } else if (number < 5000000) {
      size = 1.5;
    } else if (number >= 5000000) {
      size = 1.8;
    }
    return size;
  }

  static setMarkers(countriesData) {
    countriesData.forEach((country) => {
      const { long } = country.countryInfo;
      const { lat } = country.countryInfo;

      const marker = document.createElement('div');
      marker.className = 'marker';

      const markerSize = Map.setMarkerSize(country.cases);
      marker.style.width = `${markerSize}rem`;
      marker.style.height = `${markerSize}rem`;
      new mapboxgl.Marker(marker)
        .setLngLat([long, lat])
        .setPopup(new mapboxgl.Popup({
          closeButton: false,
        })
          .setHTML(`${country.country}: ${Number(country.cases).toLocaleString()}`)) // add popup
        .addTo(map);
      // console.log(mapboxgl);
    });
  }
}
