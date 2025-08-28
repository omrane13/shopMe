import React from 'react';
import {  Row, Col } from 'react-bootstrap';
import './Location.css';

function Location() {
  const stores = [
    {
      city: "SEATTLE",
      address: "University Village",
      mapLink: "https://maps.google.com/?q=University+Village+Seattle"
    },
    {
      city: "SAN FRANCISCO",
      address: "Valencia Street, San Francisco",
      mapLink: "https://maps.google.com/?q=Valencia+Street+San+Francisco"
    },
    {
      city: "PALO ALTO",
      address: "Stanford",
      mapLink: "https://maps.google.com/?q=Stanford+University+Palo+Alto"
    },
    {
    city: "NEW YORK",
    address: "Via Sigieri",
    mapLink: "https://maps.google.com/?q=5th+Avenue+New+York"
  },
   {
    city: "MONACO",
    address: "Louis Aureglie",
    mapLink: "https://maps.app.goo.gl/pzwkerjciQ5c8kXv5"
  },
   {
    city: "MILANO",
    address: "5th Avenue",
    mapLink: "https://maps.app.goo.gl/6iBDZFc9MSK4dZm3A"
  }
  ];

  return (
    <div className="location-page">
     
        {/* Section Titre */}
        <section className="location-header text-center mb-5">
          <h1>We are here</h1>
          <p className="lead">Find one of our 6 stores nearest you.</p>
        </section>

        {/* Liste des boutiques */}
        <section className="store-list">
          <Row>
            {stores.map((store, index) => (
              <Col md={4} key={index} className="mb-4">
                <div className="store-card">
                  <h3>{store.city}</h3>
                  <p>{store.address}</p>
                  <a 
                    href={store.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="map-link"
                  >
                    View on Map
                  </a>
                </div>
              </Col>
            ))}
          </Row>
        </section>
      
    </div>
  );
}

export default Location;