import { useState, useEffect } from 'react';
import axios from 'axios';
// Harita Kütüphaneleri
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// React-Leaflet'te default marker ikonunun bozuk çıkmasını önleyen fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DepoYonetimi = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    district: '',
    address: '',
    phone: ''
  });
  
  // Harita Konumu için State (Varsayılan: Ankara)
  const [position, setPosition] = useState([39.92077, 32.85411]);

  // Depoları Getir (Listele)
  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:9000/api/v1/warehouses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setWarehouses(response.data.data); 
      setLoading(false);
    } catch (error) {
      console.error("Depolar getirilirken hata oluştu:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Form elemanları değiştiğinde state'i güncelle
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Haritaya tıklama olayını yakalayan alt bileşen
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return position === null ? null : <Marker position={position}></Marker>;
  };

  // Yeni Depo Ekle
  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Form verilerine haritadan gelen koordinatları da ekliyoruz
      const payload = {
        ...formData,
        latitude: position[0],
        longitude: position[1]
      };

      await axios.post('http://localhost:9000/api/v1/warehouses', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      alert("✅ Depo ve konumu başarıyla eklendi!");
      
      // Formu ve haritayı temizle
      setFormData({ name: '', city: '', district: '', address: '', phone: '' });
      setPosition([39.92077, 32.85411]); 
      
      // Listeyi yenile
      fetchWarehouses();
    } catch (error) {
      console.error("Depo eklenirken hata:", error);
      alert("❌ Depo eklenirken bir hata oluştu.");
    }
  };

  // Depo Sil
  const handleDeleteWarehouse = async (id) => {
    if (window.confirm("Bu depoyu silmek istediğinize emin misiniz?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:9000/api/v1/warehouses/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("✅ Depo başarıyla silindi!");
        fetchWarehouses(); // Listeyi yenile
      } catch (error) {
        console.error("Depo silinirken hata:", error);
        alert("❌ Depo silinirken bir hata oluştu.");
      }
    }
  };

  // Ortak Stiller
  const inputStyle = {
    padding: '15px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '12px',
    border: '1px solid #e1e1e1',
    outline: 'none',
    fontSize: '15px',
    backgroundColor: '#f8f9fa',
    transition: '0.3s'
  };

  const tableHeaderStyle = {
    padding: '15px',
    textAlign: 'left',
    color: '#2c3e50',
    fontWeight: 'bold',
    borderBottom: '2px solid #e1e1e1',
    backgroundColor: '#f8f9fa',
    whiteSpace: 'nowrap'
  };

  const tableCellStyle = {
    padding: '15px',
    color: '#555',
    verticalAlign: 'middle',
    borderBottom: '1px solid #f0f0f0'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <h3 style={{ color: '#2c3e50', backgroundColor: 'white', padding: '20px 40px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        ⏳ Yükleniyor...
      </h3>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '40px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Sayfa Başlığı */}
        <h2 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '30px', fontSize: '28px' }}>
          ⚙️ Depo Yönetimi
        </h2>

        {/* Depo Ekleme Kartı */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', marginBottom: '40px' }}>
          <h3 style={{ marginTop: 0, color: '#34495e', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' }}>
            ➕ Yeni Depo Ekle
          </h3>
          
          <form onSubmit={handleAddWarehouse} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ flex: '1 1 30%', minWidth: '200px' }}>
              <input type="text" name="name" placeholder="Depo Adı (Örn: Merkez Depo)" value={formData.name} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3498db'} onBlur={(e) => e.target.style.borderColor = '#e1e1e1'} />
            </div>
            <div style={{ flex: '1 1 30%', minWidth: '200px' }}>
              <input type="text" name="city" placeholder="Şehir" value={formData.city} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3498db'} onBlur={(e) => e.target.style.borderColor = '#e1e1e1'} />
            </div>
            <div style={{ flex: '1 1 30%', minWidth: '200px' }}>
              <input type="text" name="district" placeholder="İlçe" value={formData.district} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3498db'} onBlur={(e) => e.target.style.borderColor = '#e1e1e1'} />
            </div>
            <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
              <input type="text" name="phone" placeholder="Telefon Numarası" value={formData.phone} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3498db'} onBlur={(e) => e.target.style.borderColor = '#e1e1e1'} />
            </div>
            <div style={{ flex: '1 1 100%' }}>
              <input type="text" name="address" placeholder="Açık Adres" value={formData.address} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3498db'} onBlur={(e) => e.target.style.borderColor = '#e1e1e1'} />
            </div>
            
            {/* HARİTA ALANI EKLENDİ */}
            <div style={{ flex: '1 1 100%', marginTop: '10px' }}>
              <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block', color: '#2c3e50' }}>
                📍 Haritadan Depo Konumunu Seçin (Tıklayın):
              </label>
              <div style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e1e1e1' }}>
                <MapContainer center={position} zoom={6} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#7f8c8d', textAlign: 'right' }}>
                Seçilen Koordinat: <strong>{position[0].toFixed(5)}, {position[1].toFixed(5)}</strong>
              </div>
            </div>

            <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button 
                type="submit" 
                style={{ 
                  backgroundColor: '#27ae60', 
                  color: 'white', 
                  padding: '12px 25px', 
                  border: 'none', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  fontSize: '15px',
                  transition: '0.3s',
                  boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)'
                }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#219653'; e.target.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = '#27ae60'; e.target.style.transform = 'translateY(0)'; }}
              >
                Sisteme Kaydet
              </button>
            </div>
          </form>
        </div>

        {/* Depo Listesi Kartı */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, color: '#34495e', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' }}>
            🏢 Kayıtlı Depolar
          </h3>
          
          {warehouses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
              <h4 style={{ fontWeight: 'normal' }}>Sistemde henüz kayıtlı depo bulunmamaktadır.</h4>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Depo Adı</th>
                    <th style={tableHeaderStyle}>Şehir / İlçe</th>
                    <th style={tableHeaderStyle}>Telefon</th>
                    <th style={tableHeaderStyle}>Adres</th>
                    <th style={{...tableHeaderStyle, textAlign: 'center'}}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map(w => (
                    <tr key={w.id} style={{ transition: '0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{...tableCellStyle, fontWeight: 'bold', color: '#3498db'}}>
                        {w.name}
                        {/* Tabloda küçük bir koordinat ipucu gösterelim */}
                        {w.latitude && w.longitude && (
                          <div style={{ fontSize: '11px', color: '#95a5a6', marginTop: '4px' }}>📍 Haritada İşaretli</div>
                        )}
                      </td>
                      <td style={tableCellStyle}>{w.city} / {w.district}</td>
                      <td style={tableCellStyle}>{w.phone}</td>
                      <td style={{...tableCellStyle, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={w.address}>
                        {w.address}
                      </td>
                      <td style={{...tableCellStyle, textAlign: 'center'}}>
                        <button 
                          onClick={() => handleDeleteWarehouse(w.id)}
                          style={{ 
                            backgroundColor: '#e74c3c', 
                            color: 'white', 
                            padding: '8px 15px', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: '0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          onMouseEnter={(e) => { e.target.style.backgroundColor = '#c0392b'; e.target.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(e) => { e.target.style.backgroundColor = '#e74c3c'; e.target.style.transform = 'scale(1)'; }}
                        >
                          ✕ Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DepoYonetimi;