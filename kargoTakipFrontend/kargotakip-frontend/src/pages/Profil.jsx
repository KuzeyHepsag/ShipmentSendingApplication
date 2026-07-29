import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet ikon düzeltmesi
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function Profil() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mesaj, setMesaj] = useState('');

  // Güncellenecek form state'leri
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const getAuthHeader = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/v1/customers/me', getAuthHeader());
      
      // 🔥 KRİTİK DÜZELTME 1: Backend veriyi "data" objesi içinde dönüyor olabilir!
      // Bu sayede veri sarmalanmış gelse bile Frontend çökmez.
      const data = response.data.data || response.data;
      
      setCustomer(data);
      setAddress(data.address || '');
      setLatitude(data.latitude || 39.0);
      setLongitude(data.longitude || 35.0);
      setLoading(false);
    } catch (error) {
      console.error("Profil yüklenirken hata:", error);
      setMesaj('❌ Profil bilgileri alınamadı.');
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMesaj('');

    if (!latitude || !longitude) {
      setMesaj('❌ Lütfen haritadan konumunuzu seçin.');
      return;
    }

    try {
      const payload = {
        ...customer, 
        address: address,
        latitude: latitude,
        longitude: longitude
      };

      // Güncelleme İsteği
      await axios.put(`http://localhost:9000/api/v1/customers/${customer.id}`, payload, getAuthHeader());
      
      // 🔥 KRİTİK DÜZELTME 2: Güncellemeden hemen sonra güncel veriyi veritabanından (DB) TEKRAR çekiyoruz.
      // Bu sayede ekrandaki isim, soyisim vb. hiçbir bilgi kaybolmaz, depo saniyesinde güncellenir.
      await fetchMyProfile();
      
      setMesaj('✅ Profiliniz ve deponuz başarıyla güncellendi!');
      
      setTimeout(() => setMesaj(''), 4000);
    } catch (error) {
      setMesaj('❌ Güncelleme başarısız: ' + (error.response?.data?.message || 'Hata oluştu.'));
    }
  };

  // Haritaya tıklanınca konumu alacak yardımcı bileşen
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });

    return latitude === null ? null : (
      <Marker position={[latitude, longitude]}></Marker>
    );
  };

  const inputStyle = { padding: '15px', width: '100%', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid #e1e1e1', outline: 'none', fontSize: '15px', backgroundColor: '#f8f9fa', transition: '0.3s' };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <h3>⏳ Profil Yükleniyor...</h3>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '50px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* PROFİL KARTI */}
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#764ba2', color: 'white', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', fontWeight: 'bold' }}>
            {customer?.firstName?.charAt(0)}{customer?.lastName?.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{customer?.firstName} {customer?.lastName}</h2>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '15px' }}>📧 {customer?.email} | 📞 {customer?.phone}</p>
            <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '15px', fontWeight: 'bold' }}>Müşteri ID: <span style={{ color: '#3498db' }}>{customer?.id}</span></p>
          </div>
          
          {/* AKTİF DEPO BİLGİSİ */}
          <div style={{ backgroundColor: '#e8f6ff', padding: '20px', borderRadius: '15px', border: '1px solid #b3e0ff', minWidth: '200px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#34495e', fontWeight: 'bold', marginBottom: '5px' }}>📍 Size Hizmet Veren Depo</div>
            <div style={{ fontSize: '18px', color: '#2980b9', fontWeight: 'bold' }}>
              {customer?.closestWarehouse?.name || 'Depo Atanmamış'}
            </div>
          </div>
        </div>

        {/* KONUM GÜNCELLEME KARTI */}
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, color: '#34495e', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' }}>
            🌍 Taşındınız mı? Konumunuzu Güncelleyin
          </h3>
          <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '20px' }}>
            Yeni adresinizi girin ve haritadan tam konumunuzu işaretleyin. Sistem, adresinize en yakın depoyu bularak profilinizi otomatik olarak güncelleyecektir.
          </p>

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50', fontSize: '14px' }}>Açık Adresiniz</label>
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                required 
                rows="3"
                style={{...inputStyle, resize: 'none'}} 
                placeholder="Örn: Çankaya Mah. Atatürk Bulvarı No:1..."
                onFocus={(e) => e.target.style.borderColor = '#3498db'}
                onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50', fontSize: '14px' }}>📍 Haritadan Yeni Konumunuzu Seçin</label>
              <div style={{ borderRadius: '15px', overflow: 'hidden', border: '2px solid #e1e1e1', height: '300px' }}>
                <MapContainer 
                  center={[latitude || 39.0, longitude || 35.0]} 
                  zoom={latitude ? 13 : 5} 
                  style={{ height: '100%', width: '100%', zIndex: 1 }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
            </div>

            <button 
              type="submit" 
              style={{ 
                padding: '15px', 
                backgroundColor: '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontSize: '16px', 
                fontWeight: 'bold',
                transition: '0.3s',
                boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#2980b9'; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = '#3498db'; e.target.style.transform = 'translateY(0)'; }}
            >
              Konumumu ve Depomu Güncelle
            </button>
          </form>

          {mesaj && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              textAlign: 'center', 
              fontWeight: '600', 
              borderRadius: '12px',
              backgroundColor: mesaj.includes('✅') ? '#e8f8f5' : '#fdedec',
              color: mesaj.includes('✅') ? '#117a65' : '#c0392b',
              border: `1px solid ${mesaj.includes('✅') ? '#a3e4d7' : '#f5b7b1'}`,
            }}>
              {mesaj}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profil;