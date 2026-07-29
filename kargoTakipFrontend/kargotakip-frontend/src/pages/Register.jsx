import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet ikonlarının React'te düzgün görünmesi için standart düzeltme
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function Register() {
  // 🔥 YENİ: address, latitude ve longitude eklendi
  const [formData, setFormData] = useState({
    username: '', password: '', firstName: '', lastName: '', email: '', phone: '', address: '', latitude: null, longitude: null
  });
  const [mesaj, setMesaj] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Konum seçilmemişse uyarı ver
    if (!formData.latitude || !formData.longitude) {
      setMesaj('❌ Lütfen haritaya tıklayarak konumunuzu seçin.');
      return;
    }

    try {
      // 1. Kayıt isteği
      await axios.post('http://localhost:9000/api/v1/auth/register', formData);
      setMesaj('✅ Kayıt başarılı! En yakın deponuz eşleştirildi, giriş yapılıyor...');

      // 2. Otomatik giriş isteği
      const loginResponse = await axios.post('http://localhost:9000/api/v1/auth/login', {
        username: formData.username,
        password: formData.password
      });

      // 3. Bilgileri kaydet
      const token = loginResponse.data.token;
      const decoded = jwtDecode(token);
      localStorage.setItem('token', token);
      localStorage.setItem('username', decoded.sub);
      localStorage.setItem('role', decoded.role);
      
      setTimeout(() => { window.location.href = '/'; }, 1500);
    } catch (error) {
      const errorMessage = (typeof error.response?.data === 'string') 
        ? error.response.data 
        : (error.response?.data?.message || 'Hata oluştu.');
        
      setMesaj('❌ Kayıt başarısız: ' + errorMessage);
    }
  };

  // Haritaya tıklanınca konumu alacak olan yardımcı bileşen
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
      },
    });

    return formData.latitude === null ? null : (
      <Marker position={[formData.latitude, formData.longitude]}></Marker>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '550px', // Harita daha rahat sığsın diye biraz genişlettik
        padding: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '25px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        textAlign: 'center',
        color: 'white'
      }}>
        
        {/* LOGO KISMI */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '800', 
            letterSpacing: '2px', 
            textShadow: '2px 4px 6px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            📦 KargoTakip
          </h1>
        </div>

        <h2 style={{ marginBottom: '25px', fontWeight: '300', letterSpacing: '1px', fontSize: '20px', opacity: '0.9' }}>
          Hesap Oluştur
        </h2>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {[
              { name: 'username', placeholder: 'Kullanıcı Adı' },
              { name: 'password', placeholder: 'Şifre', type: 'password' },
              { name: 'firstName', placeholder: 'Ad' },
              { name: 'lastName', placeholder: 'Soyad' },
              { name: 'email', placeholder: 'E-posta' },
              { name: 'phone', placeholder: 'Telefon' }
            ].map((field) => (
              <input 
                key={field.name}
                name={field.name}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                onChange={handleChange}
                required
                style={{
                  padding: '12px 20px',
                  borderRadius: '50px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  outline: 'none',
                  fontSize: '15px'
                }}
              />
            ))}
          </div>

          <input 
            name="address"
            type="text"
            placeholder="Açık Adresiniz"
            onChange={handleChange}
            required
            style={{
              padding: '12px 20px',
              borderRadius: '20px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              outline: 'none',
              fontSize: '15px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />

          <div style={{ textAlign: 'left', marginTop: '5px' }}>
            <label style={{ fontSize: '14px', opacity: '0.9', marginLeft: '10px', fontWeight: 'bold' }}>📍 Haritadan Konumunuzu İşaretleyin:</label>
            <div style={{ borderRadius: '15px', overflow: 'hidden', border: '2px solid rgba(255, 255, 255, 0.3)', marginTop: '8px' }}>
              <MapContainer 
                center={[39.0, 35.0]} // Türkiye geneli başlangıç koordinatı (Adana civarına göre de ayarlanabilir)
                zoom={5} 
                style={{ height: '200px', width: '100%', zIndex: 1 }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <LocationMarker />
              </MapContainer>
            </div>
          </div>
          
          <button type="submit" style={{ 
            padding: '12px',
            marginTop: '10px',
            background: 'white',
            color: '#764ba2',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: '0.4s',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Kayıt Ol
          </button>

          {/* Giriş Yap Linki */}
          <Link to="/login" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '14px', 
            opacity: '0.8',
            transition: '0.3s',
            marginTop: '10px',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.8'}
          >
            Zaten hesabın var mı? Giriş Yap
          </Link>
        </form>
        {mesaj && <p style={{ marginTop: '20px', fontWeight: '500', backgroundColor: mesaj.includes('❌') ? 'rgba(231, 76, 60, 0.8)' : 'rgba(46, 204, 113, 0.8)', padding: '10px', borderRadius: '10px' }}>{mesaj}</p>}
      </div>
    </div>
  );
}

export default Register;