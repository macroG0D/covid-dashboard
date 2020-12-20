const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoieWVtZGlnaXRhbCIsImEiOiJjanl0eHMxNm0wMGVpM2JtbDVydnJqcGE4In0.R8jEQo8vpMY91It7RDTuwA';
const map = new mapboxgl.Map({
  // renderWorldCopies: false,
  container: 'MAP',
  style: 'mapbox://styles/yemdigital/ckix544js5g6i19qkmoh51nbz',
  continuousWorld: false,
  noWrap: true,
  zoom: 1,
  center: [40, 40],
});

export default class Map {
  static updateMap(countriesData) {
    // disable map rotation using right click + drag
    map.dragRotate.disable();
    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    // set coutries markers on map
    Map.setMarkers(countriesData, map);
  }

  static setMaekerSize(number) {
    // console.log(country);
    let size = 0;
    if (number < 1000) {
      size = 0.4;
    } else if (number < 3000) {
      size = 0.6;
    } else if (number < 20000) {
      size = 0.8;
    } else if (number < 50000) {
      size = 1.1;
    } else if (number < 100000) {
      size = 1.4;
    } else if (number < 250000) {
      size = 1.9;
    } else if (number < 500000) {
      size = 2.3;
    } else if (number < 1000000) {
      size = 2.8;
    } else if (number < 5000000) {
      size = 3;
    } else if (number >= 5000000) {
      size = 5;
    }
    return size;
  }

  static setMarkers(countriesData) {
    countriesData.forEach((country) => {
      const { long } = country.countryInfo;
      const { lat } = country.countryInfo;

      const marker = document.createElement('div');
      marker.className = 'marker';

      const popup = document.createElement('div');
      popup.className = 'mapPopup';

      const markerSize = Map.setMaekerSize(country.cases);
      marker.style.width = `${markerSize}rem`;
      marker.style.height = `${markerSize}rem`;
      new mapboxgl.Marker(marker)
        .setLngLat([long, lat])
        .setPopup(new mapboxgl.Popup(popup)
          .setHTML(`${country.country}: ${Number(country.cases).toLocaleString()}`)) // add popup
        .addTo(map);
    });
  }
}
