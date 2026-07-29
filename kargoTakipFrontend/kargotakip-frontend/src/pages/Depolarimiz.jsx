import { useState, useEffect } from 'react';
import axios from 'axios';
// Harita Kütüphaneleri
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

function Depolarimiz() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null); // Tıklanan depoyu tutacak state

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:9000/api/v1/warehouses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setWarehouses(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Depolar çekilemedi:", error);
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <h3 style={{ color: '#2c3e50', backgroundColor: 'white', padding: '20px 40px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        ⏳ Depolar Yükleniyor...
      </h3>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '50px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Üst Başlık Kartı */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#2c3e50', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            🏢 Depolarımız
          </h2>
          
          {/* Eğer bir depo seçiliyse Geri Dön butonu çıksın */}
          {selectedWarehouse && (
            <button 
              onClick={() => setSelectedWarehouse(null)} 
              style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
            >
              ⬅ Listeye Dön
            </button>
          )}
        </div>
        
        {/* EKRAN 1: DEPO LİSTESİ (Bir depo seçilmediyse çalışır) */}
        {!selectedWarehouse && (
          warehouses.length === 0 ? (
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
              <h3 style={{ color: '#888', fontWeight: 'normal' }}>Kayıtlı depo bulunmamaktadır.</h3>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
              {warehouses.map((wh) => (
                <div 
                  key={wh.id}
                  onClick={() => setSelectedWarehouse(wh)} 
                  style={{ 
                    padding: '25px', 
                    backgroundColor: 'white', 
                    borderRadius: '20px', 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    borderTop: '5px solid #3498db',
                    transition: '0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    cursor: 'pointer' // Tıklanabilir olduğunu belli etmek için
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.transform = 'translateY(-5px)'; 
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'; 
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = 'translateY(0)'; 
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; 
                  }}
                >
                  <h3 style={{ margin: '0', color: '#2c3e50', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    {wh.name}
                    <span style={{ fontSize: '14px', color: '#3498db', fontWeight: 'normal' }}>Detay ➔</span>
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#555', fontSize: '15px' }}>
                    {(wh.city || wh.district) && (
                      <p style={{ margin: 0 }}>
                        <strong style={{ color: '#f39c12' }}>🗺️ Bölge:</strong> {wh.city} {wh.district ? `/ ${wh.district}` : ''}
                      </p>
                    )}
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: '#27ae60' }}>📞 Telefon:</strong> {wh.phone || 'Belirtilmemiş'}
                    </p>
                    {wh.latitude && wh.longitude && (
                       <p style={{ margin: 0, color: '#7f8c8d', fontSize: '13px' }}>📍 Harita konumu mevcut</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* EKRAN 2: SEÇİLEN DEPO DETAYI VE HARİTA (Bir depo seçildiyse çalışır) */}
        {selectedWarehouse && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <h3 style={{ margin: 0, fontSize: '24px', color: '#2c3e50', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' }}>
              {selectedWarehouse.name} Detayları
            </h3>

            {/* Bilgi Kutuları */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '10px' }}>
              <div style={{ flex: '1 1 200px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #f39c12' }}>
                <div style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold' }}>BÖLGE</div>
                <div style={{ fontSize: '16px', color: '#2c3e50', fontWeight: '600', marginTop: '5px' }}>
                  {selectedWarehouse.city} {selectedWarehouse.district ? `/ ${selectedWarehouse.district}` : ''}
                </div>
              </div>
              <div style={{ flex: '1 1 200px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #27ae60' }}>
                <div style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold' }}>TELEFON</div>
                <div style={{ fontSize: '16px', color: '#2c3e50', fontWeight: '600', marginTop: '5px' }}>
                  {selectedWarehouse.phone || 'Belirtilmemiş'}
                </div>
              </div>
              <div style={{ flex: '1 1 100%', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3498db' }}>
                <div style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold' }}>AÇIK ADRES</div>
                <div style={{ fontSize: '16px', color: '#2c3e50', fontWeight: '600', marginTop: '5px' }}>
                  {selectedWarehouse.address || 'Belirtilmemiş'}
                </div>
              </div>
            </div>

            {/* Harita Alanı */}
            <h4 style={{ margin: '10px 0 0 0', color: '#34495e' }}>📍 Harita Konumu</h4>
            
            {selectedWarehouse.latitude && selectedWarehouse.longitude ? (
              <div style={{ height: '400px', width: '100%', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e1e1e1', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>
                <MapContainer 
                  center={[selectedWarehouse.latitude, selectedWarehouse.longitude]} 
                  zoom={13} 
                  scrollWheelZoom={true} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[selectedWarehouse.latitude, selectedWarehouse.longitude]}>
                    <Popup>
                      <strong>{selectedWarehouse.name}</strong><br />
                      {selectedWarehouse.city}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <div style={{ padding: '40px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '12px', textAlign: 'center', border: '1px solid #ffeeba' }}>
                ⚠️ Bu deponun harita koordinatları sisteme henüz kaydedilmemiş.
              </div>
            )}
            
          </div>
        )}

      </div>
    </div>
  );
}

export default Depolarimiz;