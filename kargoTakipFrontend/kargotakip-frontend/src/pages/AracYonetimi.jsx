import { useState, useEffect } from 'react';
import axios from 'axios';

const AracYonetimi = () => {
  const [vehicles, setVehicles] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleStatus, setVehicleStatus] = useState('AVAILABLE');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(''); 
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [updateWarehouseId, setUpdateWarehouseId] = useState('');

  const [mesaj, setMesaj] = useState({ text: '', type: '' });

  const getAuthHeader = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchData = async () => {
    try {
      const [vehiclesRes, warehousesRes] = await Promise.all([
        axios.get('http://localhost:9000/api/v1/vehicles', getAuthHeader()),
        axios.get('http://localhost:9000/api/v1/warehouses', getAuthHeader())
      ]);
      
      setVehicles(vehiclesRes.data.data || []);
      setWarehouses(warehousesRes.data.data || warehousesRes.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Veriler getirilirken hata oluştu:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setMesaj({ text: '', type: '' });

    if (!selectedWarehouseId) {
      setMesaj({ text: '❌ Lütfen araç için bir başlangıç deposu seçin!', type: 'error' });
      return;
    }

    try {
      const payload = {
        plateNumber: plateNumber.toUpperCase(),
        status: vehicleStatus,
        load: 0,
        currentWarehouse: { id: parseInt(selectedWarehouseId) } 
      };

      await axios.post('http://localhost:9000/api/v1/vehicles', payload, getAuthHeader());
      
      setMesaj({ text: '✅ Araç başarıyla filoya eklendi!', type: 'success' });
      setPlateNumber('');
      setVehicleStatus('AVAILABLE');
      setSelectedWarehouseId('');
      fetchData(); 
      
      setTimeout(() => setMesaj({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error("Araç eklenirken hata:", error);
      setMesaj({ text: '❌ Araç eklenirken bir hata oluştu. Plaka benzersiz olmalı.', type: 'error' });
    }
  };

  // "Yolda Yap" fonksiyonu (Konum değişmeden sadece statü değiştirir)
  const handleSetOnWay = async (vehicle) => {
    try {
      const payload = { 
        ...vehicle, 
        status: 'ON_WAY',
        currentWarehouse: vehicle.currentWarehouse 
      };
      
      await axios.put(`http://localhost:9000/api/v1/vehicles/${vehicle.id}`, payload, getAuthHeader());
      
      setMesaj({ text: `✅ Araç durumu başarıyla "Yolda" olarak güncellendi!`, type: 'success' });
      fetchData();
      setTimeout(() => setMesaj({ text: '', type: '' }), 3000);
    } catch (error) {
      setMesaj({ text: '❌ Durum güncellenirken hata oluştu!', type: 'error' });
    }
  };

  const handleOpenLocationModal = (vehicle) => {
    setActiveVehicle(vehicle);
    const currentId = vehicle.currentWarehouse?.id || vehicle.currentWarehouseId || (typeof vehicle.currentWarehouse === 'number' ? vehicle.currentWarehouse : '');
    setUpdateWarehouseId(currentId);
    setIsModalOpen(true);
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    if (!updateWarehouseId) return;

    try {
      const payload = {
        ...activeVehicle,
        currentWarehouse: { id: parseInt(updateWarehouseId) }
      };

      await axios.put(`http://localhost:9000/api/v1/vehicles/${activeVehicle.id}`, payload, getAuthHeader());
      
      // 🔥 YENİ: Kullanıcıyı Akıllı Algoritma hakkında bilgilendiren mesaj
      setMesaj({ text: `✅ ${activeVehicle.plateNumber} plakalı aracın konumu güncellendi! Yeni durum (Müsait/Full) sistem tarafından otomatik hesaplandı.`, type: 'success' });
      fetchData();
      setIsModalOpen(false); 
      setTimeout(() => setMesaj({ text: '', type: '' }), 4000);
    } catch (error) {
      console.error(error);
      setMesaj({ text: '❌ Konum güncellenirken hata oluştu!', type: 'error' });
      setIsModalOpen(false);
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm("Bu aracı filodan silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:9000/api/v1/vehicles/${id}`, getAuthHeader());
        setMesaj({ text: '✅ Araç başarıyla silindi!', type: 'success' });
        fetchData(); 
        setTimeout(() => setMesaj({ text: '', type: '' }), 3000);
      } catch (error) {
        setMesaj({ text: '❌ Araç silinirken bir hata oluştu.', type: 'error' });
      }
    }
  };

  const inputStyle = { padding: '15px', width: '100%', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid #e1e1e1', outline: 'none', fontSize: '16px', backgroundColor: '#f8f9fa', transition: '0.3s', fontWeight: 'bold', color: '#2c3e50' };
  const tableHeaderStyle = { padding: '15px', textAlign: 'left', color: '#2c3e50', fontWeight: 'bold', borderBottom: '2px solid #e1e1e1', backgroundColor: '#f8f9fa' };
  const tableCellStyle = { padding: '15px', color: '#555', verticalAlign: 'middle', borderBottom: '1px solid #f0f0f0' };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <h3 style={{ color: '#2c3e50', backgroundColor: 'white', padding: '20px 40px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>⏳ Filo Yükleniyor...</h3>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '40px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ color: '#2c3e50', margin: 0 }}>🚚 Filo ve Araç Yönetimi</h2>
        </div>

        {mesaj.text && (
          <div style={{ padding: '15px', backgroundColor: mesaj.type === 'success' ? '#d4edda' : '#fdedec', color: mesaj.type === 'success' ? '#155724' : '#c0392b', borderRadius: '12px', border: `1px solid ${mesaj.type === 'success' ? '#c3e6cb' : '#f5b7b1'}`, marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
            {mesaj.text}
          </div>
        )}

        {/* Araç Ekleme Kartı */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', marginBottom: '40px' }}>
          <h3 style={{ marginTop: 0, color: '#34495e', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' }}>➕ Yeni Araç Ekle</h3>
          
          <form onSubmit={handleAddVehicle} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 25%', minWidth: '180px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#7f8c8d', fontSize: '14px' }}>Araç Plakası</label>
              <input type="text" placeholder="Örn: 34 ABC 123" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3498db'} onBlur={(e) => e.target.style.borderColor = '#e1e1e1'} />
            </div>
            
            <div style={{ flex: '1 1 25%', minWidth: '180px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#7f8c8d', fontSize: '14px' }}>Başlangıç Durumu</label>
              <select value={vehicleStatus} onChange={(e) => setVehicleStatus(e.target.value)} style={{...inputStyle, cursor: 'pointer'}}>
                <option value="AVAILABLE">✅ Müsait</option>
                <option value="ON_WAY">🚧 Yolda</option>
                <option value="FULL">🛑 Full</option>
              </select>
            </div>

            <div style={{ flex: '1 1 25%', minWidth: '180px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#7f8c8d', fontSize: '14px' }}>Başlangıç Deposu</label>
              <select value={selectedWarehouseId} onChange={(e) => setSelectedWarehouseId(e.target.value)} required style={{...inputStyle, cursor: 'pointer'}}>
                <option value="" disabled>🏢 Depo Seçiniz...</option>
                {warehouses.map(depo => (
                  <option key={depo.id} value={depo.id}>{depo.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: '1 1 20%', minWidth: '150px' }}>
              <button type="submit" style={{ backgroundColor: '#3498db', color: 'white', padding: '15px 20px', width: '100%', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: '0.3s', boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#2980b9'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#3498db'; e.target.style.transform = 'translateY(0)'; }}>
                Filoya Ekle
              </button>
            </div>
          </form>
        </div>

        {/* Araç Listesi Kartı */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, color: '#34495e', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span>🏢 Kayıtlı Araçlar</span>
            <span style={{ backgroundColor: '#e8f6ff', color: '#3498db', padding: '5px 15px', borderRadius: '20px', fontSize: '14px' }}>Toplam: {vehicles.length}</span>
          </h3>
          
          {vehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
              <h4 style={{ fontWeight: 'normal' }}>Sistemde henüz kayıtlı araç bulunmamaktadır.</h4>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Araç Plakası</th>
                    <th style={tableHeaderStyle}>Mevcut Konum</th>
                    <th style={tableHeaderStyle}>Durum & Kapasite</th>
                    <th style={{...tableHeaderStyle, textAlign: 'center'}}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(v => {
                    const isAvailable = v.status === 'AVAILABLE';
                    const isFull = v.status === 'FULL';
                    const isOnWay = v.status === 'ON_WAY';
                    const loadAmount = v.load || 0;
                    
                    const depoId = v.currentWarehouse?.id || v.currentWarehouseId || (typeof v.currentWarehouse === 'number' ? v.currentWarehouse : null);
                    const depoObj = warehouses.find(w => w.id === depoId);
                    const depoAdi = depoObj ? depoObj.name : (v.currentWarehouse?.name || v.currentWarehouseName || 'Belirsiz');
                    
                    return (
                      <tr key={v.id} style={{ transition: '0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{...tableCellStyle, fontWeight: 'bold', color: '#2c3e50', fontSize: '16px', letterSpacing: '1px'}}>
                          {v.plateNumber}
                        </td>
                        
                        <td style={{...tableCellStyle, color: (isAvailable || isFull) ? '#34495e' : '#d35400', fontWeight: 'bold'}}>
                          {(isAvailable || isFull) ? `📍 ${depoAdi}` : '🚧 Yolda'}
                        </td>

                        <td style={tableCellStyle}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', backgroundColor: isAvailable ? '#d4edda' : (isFull ? '#f8d7da' : '#fff3cd'), color: isAvailable ? '#155724' : (isFull ? '#721c24' : '#856404'), width: 'fit-content' }}>
                              {isAvailable ? '✅ Müsait' : (isFull ? '🛑 Full' : '🚧 Yolda')}
                            </span>
                            <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold' }}>
                              📦 Kapasite: {loadAmount}/100
                            </span>
                          </div>
                        </td>

                        <td style={{...tableCellStyle, textAlign: 'center'}}>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            
                            {!isOnWay && (
                              <button 
                                onClick={() => handleSetOnWay(v)} 
                                style={{ backgroundColor: '#f39c12', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }} 
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} 
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                              >
                                🚧 Yolda Yap
                              </button>
                            )}

                            <button onClick={() => handleOpenLocationModal(v)} style={{ backgroundColor: '#3498db', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                              📍 Konum Güncelle
                            </button>

                            <button onClick={() => handleDeleteVehicle(v.id)} style={{ backgroundColor: '#e74c3c', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#c0392b'; e.target.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#e74c3c'; e.target.style.transform = 'scale(1)'; }}>
                              ✕ Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Konum Güncelleme Modalı (Popup) */}
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
              
              <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                📍 Konum Bildir
              </h3>
              <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '20px' }}>
                <strong>{activeVehicle?.plateNumber}</strong> plakalı aracın depoya yanaştığını bildirin.
              </p>

              <form onSubmit={handleLocationSubmit}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e', fontSize: '14px' }}>Yeni Konum (Depo)</label>
                <select 
                  value={updateWarehouseId} 
                  onChange={(e) => setUpdateWarehouseId(e.target.value)} 
                  required 
                  style={{ ...inputStyle, marginBottom: '20px', cursor: 'pointer' }}
                >
                  <option value="" disabled>🏢 Depo Seçiniz...</option>
                  {warehouses.map(depo => (
                    <option key={depo.id} value={depo.id}>{depo.name}</option>
                  ))}
                </select>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#ecf0f1', color: '#7f8c8d', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                    İptal
                  </button>
                  <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(52, 152, 219, 0.3)' }}>
                    Kaydet
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AracYonetimi;