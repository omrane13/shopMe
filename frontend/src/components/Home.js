import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import { Col,Row,Card, Button, Spinner } from 'react-bootstrap';
import './Home.css';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const stats = [
        { value: "200+", label: "International Brands" },
        { value: "2,000+", label: "High-Quality Products" },
        { value: "30,000+", label: "Happy Customers" },
        { value: "5,000+", label: "Orders Day" }
    ];

    const brands = ["VERSACE", "LOUIS VUITTON", "GUCCI", "PRADA", "DIOR","FENDI"];

    

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (!user) navigate('/login');
        setLoggedInUser(user);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('You have been logged out successfully');
        setTimeout(() => navigate('/login'), 1000);
    };
    

   const fetchProducts = async () => {
    try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/products", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        // Debug: Affiche la réponse
        console.log('API Response:', response);

        if (!response.ok) {
            // Utilisez des données mockées si l'API échoue
            const mockProducts = [
                { id: 1, name: "Prada Bag", price: 570, imgUrl: "/imgs/Prada.jpg" },
                { id: 2, name: "Gucci Ophidia", price: 920, imgUrl: "/imgs/Gucci.jpg" },
                { id: 3, name: "New Balance", price: 200, imgUrl: "/imgs/balance.jpg" },
                { id: 4, name: "Louis Vuitton", price: 1200, imgUrl: "/imgs/lui.jpg" },
                { id: 5, name: "Dior Glasses", price: 450, imgUrl: "/imgs/dior.jpg" }
            ];
            setProducts(mockProducts);
            return;
        }

        const result = await response.json();
        setProducts(Array.isArray(result) ? result : []);
        
    } catch (err) {
        console.error("Fetch error:", err);
        handleError(err.message || 'Error loading products');
        // Utilisez des données mockées en cas d'erreur
        setProducts([
            { id: 1, name: "Prada Bag", price: 570, imgUrl: "/imgs/Prada.jpg" },
            {id: 2,name: "Gucci Ophidia",price: 920,imgUrl: "/imgs/Gucci.jpg" },
            {id: 3,name: "New balance",price: 200,imgUrl: "/imgs/balance.jpg"},
            {id: 4,name: "Louis Vuitton",price: 1200,imgUrl: "/imgs/lui.jpg"},
            {id: 5,name: "Dior lunettes",price: 450,imgUrl: "/imgs/dior.jpg"}
        ]);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="home-page">
            {/* Navbar intégrée */}
            <header className="home-header">
                <h1>LUXURY SHOP</h1>
                <Button 
                    variant="outline-light" 
                    onClick={handleLogout}
                    className="logout-btn"
                >
                    Logout
                </Button>
            </header>

            {/* Contenu principal unifié */}
            <main className="home-content">
                {/* Section Bienvenue */}
                <section className="welcome-section">
                    <h2>
                        Welcome back, <span className="username">{loggedInUser}</span>
                    </h2>
                    
                    {/* Statistiques horizontales */}
                    <div className="stats-container">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section Marques */}
                <section className="brands-section">
                    <h2 className="section-title">OUR BRANDS</h2>
                    <div className="brands-container">
                        {brands.map((brand, index) => (
                            <div key={index} className="brand-item">
                                {brand}
                            </div>
                        ))}
                    </div>
                </section>
            
                {/* Section Produits */}
                <section className="products-section">
                    <h2 className="section-title">FEATURED PRODUCTS</h2>
                    
                    {loading ? (
                        <div className="loading-spinner">
                            <Spinner animation="border" variant="light" />
                        </div>
                    ) : products.length > 0 ? (
                        <div className="products-container">
                            {products.map((item) => (
                                <Card key={item.id} className="product-card">
                                    <div className="product-image-container">
                                        {item.imgUrl ? (
                                            <Card.Img variant="top" src={item.imgUrl} />
                                        ) : (
                                            <div className="image-placeholder"></div>
                                        )}
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <div className="product-price">${item.price.toFixed(2)}</div>
                                        <Button variant="primary" className="view-btn">
                                            coming soon...
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">
                            <h4>No products available</h4>
                        </div>
                    )}
                </section>
                </main>
                <section className="mission-section">
                    <div className="mission-content">
                        <h2>We're on a Mission To Clean Up the Industry</h2>
                        <p>Read about our progress in our latest impact report.</p>
                        <Button 
                            variant="primary" 
                            className="mission-btn"
                            onClick={() => navigate('/about')}
                        >
                            LEARN MORE
                        </Button>
                    </div>
                </section>
             
                
    {/* Nouveau Footer pour livraison */}
<footer className="delivery-footer">
  <div className="delivery-content">
    <div className="delivery-columns">
      <div className="delivery-column">
        <h4>LIVRAISON & RETOURS</h4>
        <ul>
          <li>Livraison Express 24h</li>
          <li>Retours Gratuits sous 30 jours</li>
          <li>Options de livraison premium</li>
          <li>Emballage cadeau offert</li>
        </ul>
        <div className="delivery-contact">
          <p>COMMANDER MAINTENANT</p>
        </div>
      </div>
      
      <div className="delivery-column">
        <h4>NOTRE SERVICE CLIENT</h4>
        <ul>
          <li>Conseillers dédiés 7j/7</li>
          <li>Service personnalisé</li>
          <li>Assistance après-vente</li>
          <li>Réparation et entretien</li>
        </ul>
        <div className="delivery-contact">
          <p>NOUS CONTACTER</p>
        </div>
      </div>
      
      <div className="delivery-column">
        <h4>INFORMATIONS</h4>
        <ul>
          <li>Email: service@luxuryshop.com</li>
          <li>Téléphone: +216 3 77 45 89 0</li>
          <li>Horaires: 9h-20h du lundi au samedi</li>
          <li>Showroom: 123 Avenue du Luxe, Paris</li>
        </ul>
      </div>
    </div>
    
    <div className="delivery-bottom">
      <div className="delivery-links">
        <span>Politique de Confidentialité</span>
        <span >© 2023 LUXURY SHOP. Tous droits réservés</span>
      </div>
    </div>
  </div>
</footer>
            

            <ToastContainer />
        </div>
    );
}

export default Home;