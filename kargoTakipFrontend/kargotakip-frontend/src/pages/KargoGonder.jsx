import { useState } from 'react';
import axios from 'axios';

function KargoGonder() {
  const [receiverId, setReceiverId] = useState('');
  const [weight, setWeight] = useState('');
  const [mesaj, setMesaj] = useState('');

  const getAuthHeader = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  const gonderimiOnayla = async (e) => {
    e.preventDefault();
    try {
      // Artık sadece alıcı ID'si ve ağırlık gönderiyoruz. 
      // Şehir ve depo eşleştirmesini backend otomatik yapıyor!
      const response = await axios.post('http://localhost:9000/api/v1/shipments/send', {
        receiverId: parseInt(receiverId),
        weight: parseFloat(weight)
      }, getAuthHeader());

      const trackingNum = response.data.data.trackingNumber;
      setMesaj(`✅ Kargo başarıyla oluşturuldu! Takip Numaranız: ${trackingNum}`);
      
      // Formu temizle
      setReceiverId('');
      setWeight('');
    } catch (error) {
      setMesaj('❌ Hata: ' + (error.response?.data?.message || 'Kargo oluşturulurken bir hata oluştu. Lütfen alıcı IDsini kontrol edin.'));
    }
  };

  // Ortak Stiller
  const labelStyle = { fontWeight: '600', display: 'block', marginBottom: '8px', color: '#2c3e50', fontSize: '14px' };
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '50px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      
      <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' }}>
          🚀 Yeni Kargo Gönder
        </h2>

        {/* Uyarı/Bilgi Kutusu */}
        <div style={{
          backgroundColor: '#e8f4f8',
          color: '#17a2b8',
          padding: '12px 15px',
          borderRadius: '10px',
          marginBottom: '25px',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '1px solid #d1ecf1'
        }}>
          ℹ️ Sistem kuralları gereği, aynı anda en fazla 10 adet aktif kargonuz bulunabilir.
        </div>
        
        <form onSubmit={gonderimiOnayla} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={labelStyle}>Alıcının ID Numarası:</label>
            <input 
              type="number" 
              placeholder="Örn: 15" 
              value={receiverId} 
              onChange={(e) => setReceiverId(e.target.value)} 
              required 
              style={inputStyle} 
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
            />
          </div>

          <div>
            <label style={labelStyle}>Paket Ağırlığı (kg):</label>
            <input 
              type="number" 
              step="0.1" 
              placeholder="Örn: 2.5" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              required 
              style={inputStyle} 
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              padding: '15px', 
              backgroundColor: '#27ae60', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              marginTop: '10px', 
              fontSize: '16px', 
              fontWeight: 'bold',
              transition: '0.3s',
              boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)'
            }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#219653'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#27ae60'; e.target.style.transform = 'translateY(0)'; }}
          >
            Kargoyu Oluştur
          </button>
        </form>

        {mesaj && (
          <div style={{ 
            marginTop: '25px', 
            padding: '15px', 
            textAlign: 'center', 
            fontWeight: '600', 
            borderRadius: '12px',
            backgroundColor: mesaj.includes('✅') ? '#e8f8f5' : '#fdedec',
            color: mesaj.includes('✅') ? '#117a65' : '#c0392b',
            border: `1px solid ${mesaj.includes('✅') ? '#a3e4d7' : '#f5b7b1'}`,
            fontSize: '15px'
          }}>
            {mesaj}
          </div>
        )}
      </div>
    </div>
  );
}

export default KargoGonder;