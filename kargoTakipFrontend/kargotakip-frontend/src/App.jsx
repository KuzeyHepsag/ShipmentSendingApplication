import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// --- Sayfaların İçe Aktarılması ---
import Login from './pages/Login';
import KargoSorgula from './pages/KargoSorgula';
import KargoListesi from './pages/KargoListesi';
import Kargolarim from './pages/Kargolarim';
import KargoGonder from './pages/KargoGonder';
import Register from './pages/Register';
import DepoYonetimi from './pages/DepoYonetimi';
import Depolarimiz from './pages/Depolarimiz'; 
import DepoKargoYonetimi from './pages/DepoKargoYonetimi';
import AracYonetimi from './pages/AracYonetimi';
import AracIciKargolar from './pages/AracIciKargolar'; 
import Profil from './pages/Profil'; // 🔥 YENİ EKLENDİ

import './index.css';

// NavLink bileşeni
const NavLink = ({ to, label }) => {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? '#00d4ff' : 'white',
        margin: '0 15px',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: hover ? 'bold' : 'normal',
        transition: 'all 0.3s ease',
        transform: hover ? 'scale(1.1)' : 'scale(1)',
        display: 'inline-block'
      }}
    >
      {label}
    </Link>
  );
};

const AdminRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role !== 'ROLE_ADMIN') return <div style={{ textAlign: 'center', marginTop: '50px' }}><h2>Yetkisiz Erişim!</h2></div>;
  return element;
};

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

// NAVBAR'I VE YAPIYI BARINDIRAN ANA BİLEŞEN
const MainLayout = ({ isLoggedIn, username, customerId, handleLogout }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', minHeight: '100vh', background: '#f4f7f6', margin: 0, padding: 0 }}>
      
      {!isAuthPage && (
        <nav style={{ 
          backgroundColor: '#2c3e50', 
          padding: '20px', 
          textAlign: 'center', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NavLink to="/" label="Kargo Sorgula" />
            <NavLink to="/my-shipments" label="Kargolarım" />
            <NavLink to="/gonder" label="Kargo Gönder" />
            <NavLink to="/depolarimiz" label="Depolarımız" /> 
            <NavLink to="/profil" label="Profilim" /> {/* 🔥 YENİ EKLENDİ */}
            
            {/* Sadece Adminlerin Göreceği Alan */}
            {localStorage.getItem('role') === 'ROLE_ADMIN' && (
              <>
                <NavLink to="/liste" label="Tüm Kargolar" />
                <NavLink to="/depolar" label="Depo Yönetimi" />
                <NavLink to="/araclar" label="Araç Yönetimi" />
                <NavLink to="/depo-kargo" label="Depo Kargo Yönetimi" /> 
                <NavLink to="/arac-icerikleri" label="Araç Yükleri" />
              </>
            )}
          </div>
          
          {isLoggedIn && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* 🔥 YENİ: Sağ üstteki kullanıcı adına tıklandığında da Profil sayfasına yönlendirecek */}
              <Link to="/profil" style={{ textDecoration: 'none' }}>
                <span style={{ color: '#00ff00', fontSize: '16px', cursor: 'pointer' }} title="Profilime Git">
                  👤 {username} <span style={{ fontSize: '12px', color: '#ccc' }}>(ID: {customerId})</span>
                </span>
              </Link>
              <button 
                onClick={handleLogout} 
                style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: '#e74c3c', color: 'white', cursor: 'pointer', transition: '0.3s' }}
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </nav>
      )}

      <div style={{ padding: isAuthPage ? '0' : '20px' }}>
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<KargoSorgula />} />} />
          <Route path="/my-shipments" element={<ProtectedRoute element={<Kargolarim />} />} />
          <Route path="/gonder" element={<ProtectedRoute element={<KargoGonder />} />} />
          <Route path="/depolarimiz" element={<ProtectedRoute element={<Depolarimiz />} />} /> 
          <Route path="/profil" element={<ProtectedRoute element={<Profil />} />} /> {/* 🔥 YENİ EKLENDİ */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Rotaları */}
          <Route path="/liste" element={<AdminRoute element={<KargoListesi />} />} />
          <Route path="/depolar" element={<AdminRoute element={<DepoYonetimi />} />} />
          <Route path="/araclar" element={<AdminRoute element={<AracYonetimi />} />} />
          <Route path="/depo-kargo" element={<AdminRoute element={<DepoKargoYonetimi />} />} /> 
          <Route path="/arac-icerikleri" element={<AdminRoute element={<AracIciKargolar />} />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setUsername(localStorage.getItem('username') || '');
      axios.get('http://localhost:9000/api/v1/customers/my-id', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => setCustomerId(response.data))
        .catch(error => console.error("ID çekilemedi", error));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Router>
      <MainLayout isLoggedIn={isLoggedIn} username={username} customerId={customerId} handleLogout={handleLogout} />
    </Router>
  );
}

export default App;