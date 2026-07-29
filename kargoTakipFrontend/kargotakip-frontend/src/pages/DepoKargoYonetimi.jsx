import { useState, useEffect } from 'react';
import axios from 'axios';

function DepoKargoYonetimi() {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [vehicles, setVehicles] = useState([]); 
  const [mesaj, setMesaj] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const getAuthHeader = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    fetchWarehouses();
    fetchVehicles(); 
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/v1/warehouses', getAuthHeader());
      setWarehouses(response.data.data || response.data);
    } catch (error) {
      setMesaj('❌ Depolar yüklenirken bir hata oluştu.');
      console.error(error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/v1/vehicles', getAuthHeader());
      setVehicles(response.data.data || response.data);
    } catch (error) {
      console.error('Araçlar yüklenirken hata oluştu:', error);
    }
  };

  const handleWarehouseClick = async (warehouse) => {
    setSelectedWarehouse(warehouse);
    setSelectedVehicle(null);
    setYukleniyor(true);
    setMesaj('');
    setShipments([]);
    
    try {
      const response = await axios.get(`http://localhost:9000/api/v1/warehouses/${warehouse.id}/shipments`, getAuthHeader());
      setShipments(response.data.data || response.data);
    } catch (error) {
      setMesaj('❌ Bu depoya ait kargolar çekilirken hata oluştu.');
      console.error(error);
    } finally {
      setYukleniyor(false);
    }
  };

  const handleDispatch = async (vehicleId) => {
    if (!selectedWarehouse) return;
    setYukleniyor(true);
    try {
      await axios.post(`http://localhost:9000/api/v1/vehicles/${vehicleId}/dispatch/${selectedWarehouse.id}`, {}, getAuthHeader());
      setMesaj('🚀 Rota hesaplandı, kargolar yüklendi ve araç dağıtıma çıktı!');
      setSelectedVehicle(null);
      fetchVehicles();
      handleWarehouseClick(selectedWarehouse);
    } catch (error) {
      console.error(error);
      setMesaj('❌ Dağıtım işlemi başarısız: ' + (error.response?.data?.message || "Bir hata oluştu."));
    } finally {
      setYukleniyor(false);
    }
  };

  const handleDeload = async (vehicleId) => {
    if (!selectedWarehouse) return;
    setYukleniyor(true);
    try {
      await axios.post(`http://localhost:9000/api/v1/vehicles/${vehicleId}/deload/${selectedWarehouse.id}`, {}, getAuthHeader());
      // 🔥 YENİ: Başarı mesajı yeni otomatik yükleme sistemine göre güncellendi
      setMesaj('✅ İşlem Tamam! İlgili kargolar indirildi, rotadaki yeni kargolar araca yüklendi.');
      setSelectedVehicle(null);
      fetchVehicles(); 
      handleWarehouseClick(selectedWarehouse); 
    } catch (error) {
      console.error(error);
      setMesaj('❌ Boşaltma işlemi başarısız: ' + (error.response?.data?.message || "Bir hata oluştu."));
    } finally {
      setYukleniyor(false);
    }
  };

  const geriDon = () => {
    setSelectedWarehouse(null);
    setShipments([]);
    setSelectedVehicle(null);
    setMesaj('');
  };

  const getWarehouseVehicles = () => {
    if (!selectedWarehouse) return [];
    return vehicles.filter(arac => {
      const aracDepoId = arac.currentWarehouse?.id || arac.currentWarehouseId || arac.currentWarehouse;
      const isHere = aracDepoId === selectedWarehouse.id;
      
      const isIncoming = arac.shipments && arac.shipments.some(s => 
        (s.toWarehouse?.id || s.toWarehouseId || s.toWarehouse) === selectedWarehouse.id
      );

      return isHere || isIncoming;
    });
  };

  const warehouseVehicles = getWarehouseVehicles();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '50px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🏢 Depo & Kargo Yönetimi
          </h2>
          {selectedWarehouse && (
            <button onClick={geriDon} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
            >
              ⬅ Depolara Dön
            </button>
          )}
        </div>

        {mesaj && (
          <div style={{ padding: '15px', backgroundColor: mesaj.includes('❌') ? '#fdedec' : '#e8f6f3', color: mesaj.includes('❌') ? '#c0392b' : '#27ae60', borderRadius: '12px', border: '1px solid #f5b7b1', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
            {mesaj}
          </div>
        )}

        {!selectedWarehouse ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {warehouses.map((depo) => (
              <div 
                key={depo.id} 
                onClick={() => handleWarehouseClick(depo)}
                style={{ 
                  backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer',
                  borderTop: '5px solid #3498db', transition: '0.3s', display: 'flex', flexDirection: 'column', gap: '10px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)'; }}
              >
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>{depo.name}</div>
                <div style={{ color: '#7f8c8d', fontSize: '14px', display: 'flex', gap: '5px' }}>📍 {depo.city} / {depo.district}</div>
                {depo.phone && (<div style={{ color: '#7f8c8d', fontSize: '14px', display: 'flex', gap: '5px' }}>📞 {depo.phone}</div>)}
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#3498db', fontWeight: 'bold', textAlign: 'right' }}>İçine Gir & İncele ➔</div>
              </div>
            ))}
          </div>
        ) : (
          
          <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            
            <div style={{ flex: '1 1 65%', minWidth: '300px' }}>
              <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
                <h3 style={{ marginTop: 0, color: '#34495e', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{selectedWarehouse.name} İçindeki Kargolar</span>
                  <span style={{ backgroundColor: '#e8f6ff', color: '#3498db', padding: '5px 15px', borderRadius: '20px', fontSize: '14px' }}>Toplam: {shipments.length}</span>
                </h3>

                {yukleniyor ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d', fontWeight: 'bold' }}>İşlem yapılıyor... ⏳</div>
                ) : shipments.length > 0 ? (
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
                          <tr key={kargo.id} style={{ borderBottom: '1px solid #eee' }}>
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
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '15px', color: '#7f8c8d', marginTop: '20px' }}>📦 Bu depoda şu an aktif bir kargo bulunmuyor.</div>
                )}
              </div>
            </div>

            <div style={{ flex: '1 1 30%', minWidth: '300px', position: 'sticky', top: '20px' }}>
              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
                <h3 style={{ marginTop: 0, color: '#34495e', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🚚 Kamyon Filosu</span>
                  <span style={{ fontSize: '12px', backgroundColor: '#eee', padding: '4px 8px', borderRadius: '10px' }}>{warehouseVehicles.length} Araç</span>
                </h3>
                
                {warehouseVehicles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: '#7f8c8d', backgroundColor: '#f8f9fa', borderRadius: '12px', marginTop: '10px' }}>
                    <span style={{ fontSize: '24px', display: 'block', marginBottom: '10px' }}>🚫</span>
                    Bu depoda şu an bekleyen veya buraya gelmekte olan araç bulunmuyor.
                  </div>
                ) : (
                  warehouseVehicles.map(arac => {
                    const musaitMi = arac.status === 'AVAILABLE';
                    const tamDolu = arac.status === 'FULL';
                    const loadAmount = arac.load || 0; 
                    
                    const isSelected = selectedVehicle?.id === arac.id;
                    const aracDepoId = arac.currentWarehouse?.id || arac.currentWarehouseId || arac.currentWarehouse;
                    const isHere = aracDepoId === selectedWarehouse.id;

                    return (
                      <div 
                        key={arac.id} 
                        onClick={() => setSelectedVehicle(isSelected ? null : arac)} 
                        style={{ 
                          padding: '15px', marginBottom: '10px', borderRadius: '12px', cursor: 'pointer',
                          backgroundColor: isSelected ? '#e8f6ff' : '#f8f9fa',
                          border: isSelected ? '2px solid #3498db' : '1px solid #eee'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{arac.plateNumber}</span>
                          
                          <span style={{ color: musaitMi ? '#27ae60' : (tamDolu ? '#c0392b' : (isHere ? '#e67e22' : '#8e44ad')), fontWeight: 'bold', fontSize: '13px' }}>
                            {musaitMi ? '✅ Müsait' : (tamDolu ? '🛑 Full' : (isHere ? '🚧 İşlemde' : '🚚 Geliyor'))}
                          </span>
                        </div>

                        <div style={{ fontSize: '13px', color: '#7f8c8d', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          📦 Kapasite: <strong style={{ color: tamDolu ? '#c0392b' : '#34495e' }}>{loadAmount} / 100</strong>
                        </div>
                        
                        {isSelected && isHere && (
                          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button onClick={(e) => { e.stopPropagation(); handleDeload(arac.id); }}
                              style={{ flex: 1, padding: '10px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', opacity: loadAmount === 0 ? 0.5 : 1 }}
                              disabled={loadAmount === 0}>
                              ⬇️ İndir/Yükle
                            </button>

                            {/* 🔥 YENİ: Sadece araç tamamen müsaitse Tıklanabilir (Eskiden tam dolu değilse tıklanıyordu) */}
                            <button onClick={(e) => { e.stopPropagation(); handleDispatch(arac.id); }}
                              style={{ flex: 1, padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', opacity: !musaitMi ? 0.5 : 1 }}
                              disabled={!musaitMi}>
                              🚀 Yükle & Çık
                            </button>
                          </div>
                        )}

                        {isSelected && !isHere && (
                          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fdf2e9', color: '#e67e22', borderRadius: '8px', fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                            Araç henüz depoya ulaşmamış. İşlem yapmak için bekleyin veya konumunu güncelleyin.
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DepoKargoYonetimi;