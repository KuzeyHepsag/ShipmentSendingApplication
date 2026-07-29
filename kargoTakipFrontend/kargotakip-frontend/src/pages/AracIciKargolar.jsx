import { useState, useEffect } from 'react';
import axios from 'axios';

const AracIciKargolar = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  const [shipments, setShipments] = useState([]); 
  const [shipmentsLoading, setShipmentsLoading] = useState(false); 
  const [mesaj, setMesaj] = useState('');

  const getAuthHeader = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/v1/vehicles', getAuthHeader());
      setVehicles(response.data.data || response.data);
    } catch (error) {
      console.error('Araçlar yüklenirken hata oluştu:', error);
      setMesaj('❌ Araç verileri çekilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleClick = async (vehicle) => {
    if (selectedVehicle?.id === vehicle.id) {
      setSelectedVehicle(null);
      setShipments([]);
    } else {
      setSelectedVehicle(vehicle);
      setShipmentsLoading(true);
      setShipments([]);
      try {
        const response = await axios.get(`http://localhost:9000/api/v1/vehicles/${vehicle.id}/shipments`, getAuthHeader());
        setShipments(response.data.data || response.data || []);
      } catch (error) {
        console.error("Araç kargoları çekilirken hata:", error);
        setMesaj(`❌ ${vehicle.plateNumber} plakalı aracın kargoları getirilemedi.`);
      } finally {
        setShipmentsLoading(false);
      }
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <h3 style={{ color: '#2c3e50', backgroundColor: 'white', padding: '20px 40px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>⏳ Filo Yükleniyor...</h3>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '40px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* BAŞLIK */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ color: '#2c3e50', margin: 0 }}>🚛 Araç ve Yük Takibi</h2>
          <p style={{ color: '#7f8c8d', marginTop: '10px', fontSize: '15px' }}>İçindeki kargoları detaylı görmek istediğiniz aracın üzerine tıklayın.</p>
        </div>

        {mesaj && (
          <div style={{ padding: '15px', backgroundColor: '#fdedec', color: '#c0392b', borderRadius: '12px', border: '1px solid #f5b7b1', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
            {mesaj}
          </div>
        )}

        {/* ARAÇ KARTLARI (GRID) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {vehicles.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px', color: '#7f8c8d', backgroundColor: 'white', borderRadius: '15px' }}>
              Sistemde henüz kayıtlı araç bulunmuyor.
            </div>
          ) : (
            vehicles.map(arac => {
              const isSelected = selectedVehicle?.id === arac.id;
              const musaitMi = arac.isAvailable === true || arac.available === true;
              const depoAdi = arac.currentWarehouse?.name || 'Yolda / Belirsiz';
              const kargoSayisi = arac.shipmentDTOList?.length || arac.shipments?.length || 0;

              return (
                <div 
                  key={arac.id} 
                  onClick={() => handleVehicleClick(arac)}
                  style={{ 
                    backgroundColor: 'white', padding: '20px', borderRadius: '15px', cursor: 'pointer',
                    boxShadow: isSelected ? '0 8px 25px rgba(52, 152, 219, 0.4)' : '0 4px 15px rgba(0,0,0,0.05)',
                    border: isSelected ? '3px solid #3498db' : '3px solid transparent',
                    transition: 'all 0.3s ease',
                    display: 'flex', flexDirection: 'column', gap: '12px'
                  }}
                  onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.transform = 'translateY(-5px)'; }}
                  onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: '#2c3e50', letterSpacing: '1px' }}>{arac.plateNumber}</span>
                    <span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: musaitMi ? '#d4edda' : '#f8d7da', color: musaitMi ? '#155724' : '#721c24' }}>
                      {musaitMi ? '✅ Müsait' : '🚧 Yolda / Dolu'}
                    </span>
                  </div>
                  
                  <div style={{ color: '#34495e', fontSize: '14px', fontWeight: '600' }}>
                    📍 Konum: <span style={{ color: '#7f8c8d', fontWeight: 'normal' }}>{depoAdi}</span>
                  </div>
                  
                  {/* KAPASİTE SİLİNDİ, KARGO SAYISI ORTALANDI */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#95a5a6', fontWeight: 'bold' }}>İÇİNDEKİ KARGO</span>
                      <span style={{ fontSize: '16px', color: '#2980b9', fontWeight: '900' }}>{kargoSayisi} Adet</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* TIKLANAN ARACIN KARGO LİSTESİ */}
        {selectedVehicle && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', animation: 'fadeIn 0.5s ease' }}>
            <h3 style={{ marginTop: 0, color: '#34495e', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📦 {selectedVehicle.plateNumber} Plakalı Aracın Yük Listesi</span>
              <button onClick={() => setSelectedVehicle(null)} style={{ padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Kapat ✕</button>
            </h3>

            {shipmentsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d', fontSize: '16px', fontWeight: 'bold' }}>
                Kargolar getiriliyor... ⏳
              </div>
            ) : shipments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '15px', color: '#7f8c8d', fontSize: '16px' }}>
                🪹 Bu aracın kasası şu an tamamen boş.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', color: '#2c3e50', textAlign: 'left' }}>
                      <th style={{ padding: '15px', borderBottom: '2px solid #dee2e6' }}>Takip No</th>
                      <th style={{ padding: '15px', borderBottom: '2px solid #dee2e6' }}>Durum</th>
                      <th style={{ padding: '15px', borderBottom: '2px solid #dee2e6' }}>Gönderici</th>
                      <th style={{ padding: '15px', borderBottom: '2px solid #dee2e6' }}>Alıcı</th>
                      <th style={{ padding: '15px', borderBottom: '2px solid #dee2e6' }}>Hedef Depo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((kargo) => (
                      <tr key={kargo.id} style={{ borderBottom: '1px solid #eee', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#2c3e50' }}>{kargo.trackingNumber}</td>
                        <td style={{ padding: '15px' }}><span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>{kargo.status}</span></td>
                        <td style={{ padding: '15px', color: '#555' }}>{kargo.sender?.firstName} {kargo.sender?.lastName}</td>
                        <td style={{ padding: '15px', color: '#555' }}>{kargo.receiver?.firstName} {kargo.receiver?.lastName}</td>
                        <td style={{ padding: '15px', color: '#27ae60', fontWeight: '600' }}>{kargo.toWarehouse?.name || kargo.toWarehouseName || 'Belirtilmemiş'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AracIciKargolar;