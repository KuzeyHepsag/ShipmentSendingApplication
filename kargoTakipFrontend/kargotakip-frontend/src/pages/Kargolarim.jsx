import { useEffect, useState } from 'react';
import axios from 'axios';

const Kargolarim = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerId, setCustomerId] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const userRes = await axios.get('http://localhost:9000/api/v1/customers/my-id', { headers });
      setCustomerId(userRes.data);

      const shipRes = await axios.get('http://localhost:9000/api/v1/shipments/my-shipments', { headers });
      setShipments(shipRes.data.data); 
      
      setLoading(false);
    } catch (err) {
      console.error("Veriler yüklenemedi:", err);
      setError("Kargolarınız yüklenirken bir hata oluştu.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const kargoyuOnayla = async (kargoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:9000/api/v1/shipments/${kargoId}/approve`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Kargo başarıyla onaylandı!");
      fetchData(); 
    } catch (err) {
      console.error("Onay hatası:", err);
      alert("Kargo onaylanırken hata oluştu.");
    }
  };

  const kargoyuReddet = async (kargoId) => {
    if (window.confirm("Bu kargoyu reddetmek/iptal etmek istediğinize emin misiniz?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:9000/api/v1/shipments/${kargoId}/reject`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("Kargo iptal edildi.");
        fetchData(); 
      } catch (err) {
        console.error("Reddetme hatası:", err);
        alert("Kargo reddedilirken hata oluştu.");
      }
    }
  };

  // Durumlara göre renk ve metin belirleme fonksiyonu
  const getStatusStyle = (status) => {
    switch(status) {
      case 'PENDING_APPROVAL': return { bg: '#fff3cd', color: '#856404', text: 'Onay Bekliyor' };
      case 'DELIVERED': return { bg: '#d4edda', color: '#155724', text: 'Teslim Edildi' };
      case 'IN_TRANSIT': 
      case 'OUT_FOR_DELIVERY': return { bg: '#cce5ff', color: '#004085', text: 'Yolda' };
      case 'REJECTED': 
      case 'CANCELED': return { bg: '#f8d7da', color: '#721c24', text: 'İptal Edildi' };
      default: return { bg: '#e2e3e5', color: '#383d41', text: status };
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <h3 style={{ color: '#2c3e50' }}>Yükleniyor...</h3>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '40px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        
        <h2 style={{ color: '#2c3e50', marginBottom: '25px', textAlign: 'center', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' }}>
          📦 Kargolarım
        </h2>

        {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

        {shipments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <h3 style={{ fontWeight: 'normal' }}>Henüz kayıtlı bir kargonuz bulunmamaktadır.</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Takip No</th>
                  <th style={tableHeaderStyle}>Gönderici</th>
                  <th style={tableHeaderStyle}>Alıcı</th>
                  <th style={tableHeaderStyle}>Durum</th>
                  <th style={tableHeaderStyle}>Ağırlık</th>
                  <th style={tableHeaderStyle}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => {
                  const statusInfo = getStatusStyle(s.status);
                  
                  return (
                    <tr key={s.id} style={{ transition: '0.3s', borderBottom: '1px solid #f0f0f0' }}>
                      <td style={tableCellStyle}>
                        <span style={{ fontWeight: 'bold', color: '#3498db' }}>{s.trackingNumber}</span>
                      </td>
                      <td style={tableCellStyle}>{s.sender?.firstName} {s.sender?.lastName}</td>
                      <td style={tableCellStyle}>{s.receiver?.firstName} {s.receiver?.lastName}</td>
                      
                      {/* Durum Badge'i */}
                      <td style={tableCellStyle}>
                        <span style={{ 
                          backgroundColor: statusInfo.bg, 
                          color: statusInfo.color, 
                          padding: '6px 12px', 
                          borderRadius: '20px', 
                          fontSize: '0.9em', 
                          fontWeight: '600',
                          display: 'inline-block'
                        }}>
                          {statusInfo.text}
                        </span>
                      </td>
                      
                      <td style={tableCellStyle}>{s.weight} kg</td>
                      
                      {/* İşlem Butonları */}
                      <td style={tableCellStyle}>
                        {s.status === 'PENDING_APPROVAL' && s.receiver?.id === customerId ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button 
                              onClick={() => kargoyuOnayla(s.id)}
                              style={actionButtonStyle('#27ae60')}
                              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                              onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                              ✓ Onayla
                            </button>
                            <button 
                              onClick={() => kargoyuReddet(s.id)}
                              style={actionButtonStyle('#e74c3c')}
                              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                              onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                              ✕ Reddet
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#bbb', fontStyle: 'italic' }}>İşlem Yok</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Ortak stiller (Kod kalabalığı olmasın diye dışarı çıkardık)
const tableHeaderStyle = {
  padding: '15px',
  textAlign: 'center',
  color: '#2c3e50',
  fontWeight: 'bold',
  borderBottom: '2px solid #e1e1e1',
  backgroundColor: '#f8f9fa'
};

const tableCellStyle = {
  padding: '15px',
  textAlign: 'center',
  color: '#555',
  verticalAlign: 'middle'
};

const actionButtonStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: 'white',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.85em',
  transition: '0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
});

export default Kargolarim;