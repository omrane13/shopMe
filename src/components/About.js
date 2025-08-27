import React from 'react';
import {  Row, Col,Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './About.css';

function About() {
  const navigate = useNavigate();
  return (
    <div className="about-page">
      {/* Section Hero */}
      <section className="about-section hero-section">
        <div className="section-overlay"></div>
        
          <div className="section-content">
            <h1>We believe<br />we can all<br />make<br />a difference.</h1>
            <p className="section-subtitle">Our way: Exceptional quality.<br />Ethical factories. Radical Transparency.</p>
          </div>
        
      </section>

 {/* Section Qualité */}
<section className="quality-section">
  <Row className="g-0">
    {/* Première ligne - Texte + Photo */}
    <Col md={12}>
      <div className="top-row">
        <div className="text-content">
          <h2>OUR QUALITY</h2>
          <p className="subtitle">Designed<br />to last.</p>
          <p className="description">
            At Luxury Shop, we're not big on trends. We want you to wear our pieces for years, 
            even decades, to come. That's why we source the finest materials and factories for 
            our timeless products—like our Grade-A cashmere sweaters, Italian shoes, and Peruvian Pima tees.
          </p>
        </div>
        <div className="top-image"></div>
      </div>
    </Col>

    {/* Deuxième ligne - Photo pleine largeur */}
    <Col md={12}>
      <div className="bottom-image"></div>
    </Col>
  </Row>
</section>

      {/* Section Values */}
<section className="about-section values-section">
  
    <h2 className="text-center mb-5">Our Core Values</h2>
    <Row>
      {/* Quality Value */}
      <Col md={4} className="value-item">
        <div className="value-card" onClick={() => navigate('/Store')}>
          <div className="value-image" style={{backgroundImage: "url('/imgs/store.jpg')"}}></div>
          <div className="value-content">
            <h3>Our product</h3>
            <p>Only the finest materials crafted to perfection</p>
            <Button variant="link" className="value-link">Explore</Button>
          </div>
        </div>
      </Col>

      {/* Ethics Value */}
      <Col md={4} className="value-item">
        <div className="value-card" onClick={() => navigate('/LocationPage')}>
          <div className="value-image" style={{backgroundImage: "url('/imgs/location.jpg')"}}></div>
          <div className="value-content">
            <h3>our location</h3>
            <p>Fair wages and safe working conditions</p>
            <Button variant="link" className="value-link">Explore</Button>
          </div>
        </div>
      </Col>

      {/* Transparency Value */}
      <Col md={4} className="value-item">
        <div className="value-card" onClick={() => navigate('/Home')}>
          <div className="value-image" style={{backgroundImage: "url('/imgs/new.jpg')"}}></div>
          <div className="value-content">
            <h3>Home</h3>
            <p>Full disclosure of our production process</p>
            <Button variant="link" className="value-link">Explore</Button>
          </div>
        </div>
      </Col>
    </Row>
  
</section>

      {/* Footer */}
      <footer className="about-footer">
          <Row>
            <Col md={3}>
              <h4>More to Explore</h4>
              <ul>
                <li>Our Products</li>
                <li>Our Stores</li>
                <li>Careers</li>
              </ul>
            </Col>
            <Col md={3}>
              <h4>INFORMATIONS LÉGALES</h4>
              <ul>
                <li>Livraison</li>
                <li>Conditions d'utilisation</li>
                <li>Paiement sécurisé</li>
              </ul>
            </Col>
            <Col md={3}>
              <h4>Company</h4>
              <ul>
                <li>About</li>
                <li>Environmental Initiatives</li>
                <li>Factories</li>
                <li>DEI</li>
                <li>Careers</li>
              </ul>
            </Col>
            <Col md={3}>
              <h4>Connect</h4>
              <ul>
                <li>Facebook</li>
                <li>Instagram</li>
                <li>Twitter</li>
              </ul>
            </Col>
          </Row>
          <div className="footer-bottom">
            <div className="footer-links">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>© 2023 All Rights Reserved</span>
            </div>
          </div>
      </footer>
    </div>
  );
}

export default About;