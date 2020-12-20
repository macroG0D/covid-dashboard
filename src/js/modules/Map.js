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

  static setMarkers(countriesData) {
    countriesData.forEach((country) => {
      const { long } = country.countryInfo;
      const { lat } = country.countryInfo;
      new mapboxgl.Marker().setLngLat([long, lat]).addTo(map);
    });
  }
}
