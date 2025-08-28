import { Navigate, Route, Routes } from 'react-router-dom';
import { Container } from "react-bootstrap";
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Store from './components/Store';
import About from './components/About';
import OrderPage from './components/OrderPage';
import LocationPage from './components/LocationPage';
import ProductDetail from './components/ProductDetail';
import MyOrdersPage from './components/MyOrdersPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ShoppingCartProvider from './context/ShoppingCartContext';
import RefrshHandle from './RefrshHandler';
import './App.css';


import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user');
  
  const PrivateRoute = ({ element, requiredRole = 'user' }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (requiredRole === 'admin' && userRole !== 'admin') {
      return <Navigate to="/home" />;
    }
    return element;
  };

  const AdminLayout = ({ children }) => (
    <>
      <Navbar />
      <Container fluid className="main-content">
        {children}
      </Container>
    </>
  );

  const AuthenticatedLayout = () => (
    <>
      <Navbar />
      <Container fluid className="main-content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/about" element={<About />} />
          <Route path="/LocationPage" element={<LocationPage />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        </Routes>
      </Container>
    </>
  );

  return (
    <ShoppingCartProvider>
      <RefrshHandle 
        setIsAuthenticated={setIsAuthenticated} 
        setUserRole={setUserRole} 
      />
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} 
        />
        <Route path="/signup" element={<Signup />} />
        
        {/* Routes publiques */}
        <Route path="/*" element={<PrivateRoute element={<AuthenticatedLayout />} />} />
        
        {/* Routes admin */}
        <Route 
          path="/admin" 
          element={
            <PrivateRoute requiredRole="admin" 
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              
              } 
            />
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <PrivateRoute requiredRole="admin" 
              element={
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              } 
            />
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <PrivateRoute requiredRole="admin" 
              element={
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              } 
            />
          } 
        />
    
        <Route 
          path="/admin/users" 
          element={
            <PrivateRoute requiredRole="admin" 
              element={
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              } 
            />
          } 
        />
      </Routes>
    </ShoppingCartProvider>
  );
}

export default App;