import DataFetcher from './DataFetcher';
import CurrentCountry from './CurrentCountry';
import Summary from './Summary';
import Global from './Global';
import Graph from './Graph';

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoieWVtZGlnaXRhbCIsImEiOiJjanl0eHMxNm0wMGVpM2JtbDVydnJqcGE4In0.R8jEQo8vpMY91It7RDTuwA';
const map = new mapboxgl.Map({
  container: 'MAP',
  style: 'mapbox://styles/yemdigital/ckix544js5g6i19qkmoh51nbz',
  zoom: 1,
  center: [0, 0],
  attributionControl: false,
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
      size = 0.3;
    } else if (number < 3000) {
      size = 0.5;
    } else if (number < 20000) {
      size = 0.7;
    } else if (number < 50000) {
      size = 0.9;
    } else if (number < 100000) {
      size = 1.1;
    } else if (number < 250000) {
      size = 1.3;
    } else if (number < 500000) {
      size = 1.5;
    } else if (number < 1000000) {
      size = 1.7;
    } else if (number < 5000000) {
      size = 2;
    } else if (number >= 5000000) {
      size = 2.3;
    }
    return size;
  }

  static setMarkers(countriesData) {
    const mapPopupsData = [];
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
        .addTo(map);

      mapPopupsData.push({
        type: 'Feature',
        properties: {
          description: `${country.country}: ${Number(country.cases).toLocaleString()}`,
          country: `${country.country}`,
        },
        geometry: {
          type: 'Point',
          coordinates: [long, lat],
        },
      });
    });

    map.addSource('places', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: mapPopupsData,
      },
    });

    // Add a layer showing the places.
    map.addLayer({
      id: 'places',
      type: 'circle',
      source: 'places',
      paint: {
        'circle-radius': 20,
        'circle-opacity': 0,
      },
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: false,
    });

    map.on('mouseenter', 'places', (e) => {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';

      const coordinates = e.features[0].geometry.coordinates.slice();
      const { description } = e.features[0].properties;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on('mouseleave', 'places', () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    // zoom in onclick
    map.on('click', 'places', (e) => {
      Map.selectCountryOnMap(e.lngLat.lng, e.lngLat.lat);
      const { country } = e.features[0].properties;
      CurrentCountry.selectedCountryName = country;

      // select country on countries table
      const countriesRows = document.querySelectorAll('.countryRow');
      countriesRows.forEach((countryRow) => {
        if (countryRow.getAttribute('name') === CurrentCountry.selectedCountryName.toLowerCase()) {
          const previouslySelected = document.getElementById(`${CurrentCountry.selectedCountryID}`);
          previouslySelected.classList.remove('selected');
          CurrentCountry.selectedCountryID = countryRow.getAttribute('id');
          if (!countryRow.classList.contains('selected')) {
            countryRow.classList.add('selected');
          }

          // scroll countires table to selected country
          // eslint-disable-next-line no-unused-vars
          const promise = new Promise(() => {
            setTimeout(() => {
              countryRow.scrollIntoView({ block: 'center', behavior: 'smooth' });
              // need timeout becouse showChart is changing focus on itself
              // and preventing scrollIntoView function
            }, 300);
          }).then(Graph.showChart(),
            Summary.updateSummary(DataFetcher.data),
            Global.updateGlobal(DataFetcher.data),
            CurrentCountry.updateCurrentCountryLongLat());
        }
      });
    });
  }
}
