import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";

export function Navbar() {
  const { openCart, cartQuantity, cartItems } = useShoppingCart();
  
  // Récupérer les informations utilisateur depuis localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isAdmin = userData.role === 'admin';

  // Debug: afficher le contenu du panier
  console.log("Cart Items:", cartItems);
  console.log("Cart Quantity:", cartQuantity);

  return (
    <BootstrapNavbar sticky="top" className="bg-white shadow-sm" expand="lg" style={{ width: '100%' }}>
      <Container fluid style={{ padding: '0 1rem', maxWidth: '100%' }}>
        <BootstrapNavbar.Brand 
          as={Link} 
          to="/home"
          className="me-4 fw-bold"
          style={{ minWidth: '120px' }}
        >
          ShopMe
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto" style={{ gap: '1rem' }}>
            <Nav.Link as={Link} to="/home" className="px-2">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/store" className="px-2">
              Store
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="px-2">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/LocationPage" className="px-2">
              location
            </Nav.Link>
            <Nav.Link as={Link} to="/my-orders" className="px-2">
              Mes commandes
            </Nav.Link>
            
            {/* Lien Admin seulement pour les administrateurs */}
            {isAdmin && (
              <Nav.Link as={Link} to="/admin" className="px-2 text-danger fw-bold">
                Admin Dashboard
              </Nav.Link>
            )}
          </Nav>

          <div style={{ minWidth: '120px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
            {/* Bouton panier - toujours visible mais avec badge conditionnel */}
            <Button
              onClick={openCart}
              variant="outline-primary"
              className="rounded-circle p-0 position-relative"
              style={{ 
                width: "2.5rem", 
                height: "2.5rem",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              🛒
              {cartQuantity > 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute"
                  style={{
                    top: "-5px",
                    right: "-5px",
                    fontSize: '0.7rem',
                    minWidth: '1.3rem',
                    height: '1.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cartQuantity}
                </Badge>
              )}
            </Button>
            
            {/* Menu déroulant utilisateur */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-user">
                👤 {userData.name || 'Utilisateur'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/my-orders">
                  Mes commandes
                </Dropdown.Item>
                {isAdmin && (
                  <Dropdown.Item as={Link} to="/admin" className="text-danger">
                    Admin Dashboard
                  </Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Item 
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    window.location.href = '/login';
                  }}
                >
                  Déconnexion
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
export default Navbar;