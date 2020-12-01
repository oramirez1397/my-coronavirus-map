import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';
import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';
const LOCATION = {
  lat: 0,
  lng: 0,
};

const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;
const IndexPage = () => {
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    // let response;
    let states;

    try {
      states = await axios.get( 'https://disease.sh/v3/covid-19/jhucsse/counties' );
    } catch ( e ) {
      console.log( `Failed to fetch countries: ${e.message}`, e );
      return;
    }

    const { data = [] } = states;
    const hasD = Array.isArray( data ) && data.length > 0;
    if ( !hasD ) return;
    const geoJson = {
      type: 'FeatureCollection',
      // features: data.map((county = {}, confirmed, deaths, recovered,) => {
      features: data.map(( county = {}) => {
        const { stats = {} } = county;
        const { coordinates = {} } = county;
        const { latitude: lat, longitude: lng } = coordinates;
        const { confirmed } = stats;
        const { deaths } = stats;
        const { recovered } = stats;
        const { updatedAt } = county;
        const name = county.county;
        return {
          type: 'Feature',
          properties: {
            county,
            updatedAt,
            confirmed,
            deaths,
            recovered,
            name,
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        };
      }),
    };

    const geoJsonLayers = new L.GeoJSON( geoJson, {
      pointToLayer: ( feature = {}, latlng ) => {
        const { properties = {} } = feature;
        let casesString;
        const { confirmed, deaths, recovered, updatedAt, name } = properties;
        casesString = `${confirmed}`;
        if ( confirmed > 1000 ) {
          casesString = `${casesString.slice( 0, -3 )}k+`;
        }
        // if ( updated ) {
        //   updatedFormatted = new Date(updated).toLocaleString();
        // }

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${name}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${confirmed}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Recovered:</strong> ${recovered}</li>
                <li><strong>Last Update:</strong> ${updatedAt}</li>
              </ul>
            </span>
            ${casesString}
          </span>
        `;
        return L.marker( latlng, {
          icon: L.divIcon({
            className: 'icon',
            html,
          }),
          riseOnHover: true,
        });
      },
    });
    geoJsonLayers.addTo( map );
  }
  //--------------------end of trying--------------------

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect,
  };
  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Map {...mapSettings} />
      <Container type="content" className="text-center home-start">
        <h2>
          <a href="/countries/">Click Here To See Country Map!</a>
        </h2>
        <p>Run the following in your terminal!</p>
        <pre>
          <code>gatsby new [directory] https://github.com/colbyfayock/gatsby-starter-leaflet</code>
        </pre>
        <p className="note">Note: Gatsby CLI required globally for the above command</p>
      </Container>
    </Layout>
  );
};
export default IndexPage;
