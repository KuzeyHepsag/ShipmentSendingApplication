import { useState, useEffect } from 'react';
import axios from 'axios';

function KargoListesi() {
  const [kargolar, setKargolar] = useState([]);
  const [aramaMetni, setAramaMetni] = useState('');
  const [hata, setHata] = useState('');

  // Token ile yetkilendirme başlığı oluşturma
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
  };

  const kargolariGetir = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/v1/shipments', getAuthHeader());
      if (response.data.success) {
        setKargolar(response.data.data);
      }
    } catch (error) {
      setHata('Kargolar yüklenirken sunucuya ulaşılamadı veya yetkiniz yok.');
      console.error(error);
    }
  };

  useEffect(() => {
    kargolariGetir();
  }, []);

  const kargoSil = async (id) => {
    if (window.confirm('Bu kargoyu silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:9000/api/v1/shipments/${id}`, getAuthHeader());
        kargolariGetir();
      } catch (error) {
        alert('Silme işlemi başarısız.');
        console.error(error);
      }
    }
  };

  const filtrelenmisKargolar = kargolar.filter(kargo => 
    kargo.trackingNumber?.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    kargo.sender?.firstName?.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  // Durumlara göre renk ve metin belirleme fonksiyonu
  const getStatusStyle = (status) => {
    switch(status) {
      case 'CREATED': return { bg: '#e2e3e5', color: '#383d41', text: 'Oluşturuldu' };
      case 'PENDING_APPROVAL': return { bg: '#fff3cd', color: '#856404', text: 'Onay Bekliyor' };
      case 'DELIVERED': return { bg: '#d4edda', color: '#155724', text: 'Teslim Edildi' };
      case 'IN_TRANSIT': 
      case 'OUT_FOR_DELIVERY': return { bg: '#cce5ff', color: '#004085', text: 'Yolda' };
      case 'REJECTED': 
      case 'CANCELED': return { bg: '#f8d7da', color: '#721c24', text: 'İptal / Red' };
      case 'AT_WAREHOUSE': return { bg: '#e8f4f8', color: '#17a2b8', text: 'Depoda' };
      default: return { bg: '#e2e3e5', color: '#383d41', text: status || 'Bilinmiyor' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '40px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        
        <h2 style={{ color: '#2c3e50', marginBottom: '25px', textAlign: 'center', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' }}>
          📋 Tüm Kargolar
        </h2>

        {/* Arama Kutusu */}
        <input 
          type="text" 
          placeholder="🔍 Takip no veya gönderici ismi ile ara..." 
          value={aramaMetni}
          onChange={(e) => setAramaMetni(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '15px', 
            marginBottom: '25px', 
            borderRadius: '12px', 
            border: '1px solid #e1e1e1', 
            outline: 'none',
            fontSize: '15px',
            backgroundColor: '#f8f9fa',
            boxSizing: 'border-box',
            transition: '0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3498db'}
          onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
        />
        
        {hata && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px' }}>
            {hata}
          </div>
        )}

        {filtrelenmisKargolar.length === 0 && !hata ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <h3 style={{ fontWeight: 'normal' }}>Aradığınız kriterlere uygun kargo bulunamadı.</h3>
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
                  <th style={tableHeaderStyle}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtrelenmisKargolar.map((kargo) => {
                  const statusInfo = getStatusStyle(kargo.status);

                  return (
                    <tr key={kargo.id} style={{ transition: '0.3s', borderBottom: '1px solid #f0f0f0' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={tableCellStyle}>
                        <span style={{ fontWeight: 'bold', color: '#3498db' }}>{kargo.trackingNumber}</span>
                      </td>
                      <td style={tableCellStyle}>{kargo.sender?.firstName} {kargo.sender?.lastName}</td>
                      <td style={tableCellStyle}>{kargo.receiver?.firstName} {kargo.receiver?.lastName}</td>
                      
                      {/* Durum Badge'i */}
                      <td style={tableCellStyle}>
                        <span style={{ 
                          backgroundColor: statusInfo.bg, 
                          color: statusInfo.color, 
                          padding: '6px 12px', 
                          borderRadius: '20px', 
                          fontSize: '0.9em', 
                          fontWeight: '600',
                          display: 'inline-block',
                          whiteSpace: 'nowrap'
                        }}>
                          {statusInfo.text}
                        </span>
                      </td>
                      
                      <td style={tableCellStyle}>
                        <button 
                          onClick={() => kargoSil(kargo.id)} 
                          style={{
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            padding: '8px 15px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.85em',
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Ortak tablo stilleri
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
  verticalAlign: 'middle'
};

export default KargoListesi;