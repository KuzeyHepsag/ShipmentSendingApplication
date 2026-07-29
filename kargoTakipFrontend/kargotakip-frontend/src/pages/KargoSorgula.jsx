import { useState } from 'react';
import axios from 'axios';

function KargoSorgula() {
  const [takipNo, setTakipNo] = useState('');
  const [kargoBilgisi, setKargoBilgisi] = useState(null);
  const [hareketler, setHareketler] = useState([]);
  const [hata, setHata] = useState('');
  const [yeniDurum, setYeniDurum] = useState('');
  const [guncellemeMesaji, setGuncellemeMesaji] = useState('');

  const isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
  };

  const durumSecenekleri = ["CREATED", "AT_WAREHOUSE", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELED", "RETURNED"];

  const sorgula = async (e) => {
    if (e) e.preventDefault();
    setHata(''); setKargoBilgisi(null); setHareketler([]); setGuncellemeMesaji('');
    try {
      const response = await axios.get(`http://localhost:9000/api/v1/shipments/search?trackingNumber=${takipNo}`, getAuthHeader());
      const payloadData = response.data.data;
      if (payloadData && payloadData.length > 0) {
        const kargo = payloadData[0];
        setKargoBilgisi(kargo);
        setYeniDurum(kargo.status);
        try {
          const hareketResponse = await axios.get(`http://localhost:9000/api/v1/movements/shipment/${kargo.id}`, getAuthHeader());
          if (hareketResponse.data.success) setHareketler(hareketResponse.data.data);
        } catch (hareketHata) { console.error(hareketHata); }
      } else { setHata('Bu takip numarasına ait kargo bulunamadı.'); }
    } catch (error) { setHata('Sunucuya ulaşılamadı.'); }
  };

  const durumuGuncelle = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:9000/api/v1/shipments/${kargoBilgisi.id}/status?status=${yeniDurum}&notes=Panelden güncellendi.`, 
        null, getAuthHeader()
      );
      if (response.data.success) {
        setGuncellemeMesaji('✅ Durum başarıyla güncellendi!');
        sorgula(); 
      }
    } catch (error) { setGuncellemeMesaji('❌ Güncelleme sırasında hata oluştu.'); }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* Arama Kutusu */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '25px', textAlign: 'center', color: '#2c3e50' }}>🔍 Kargo Sorgulama</h2>
        <form onSubmit={sorgula} style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="text" placeholder="Takip numarası girin (Örn: TRK-123456)..." value={takipNo} onChange={(e) => setTakipNo(e.target.value)}
            style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #e1e1e1', outline: 'none', fontSize: '16px', backgroundColor: '#f8f9fa', transition: '0.3s' }}
            onFocus={(e) => e.target.style.borderColor = '#3498db'}
            onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
            required
          />
          <button type="submit" style={{ padding: '0 30px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.3s' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#2980b9'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#3498db'; e.target.style.transform = 'translateY(0)'; }}
          >
            Sorgula
          </button>
        </form>
        {hata && <p style={{ color: '#e74c3c', textAlign: 'center', marginTop: '20px', fontWeight: '600' }}>{hata}</p>}
      </div>

      {/* Sonuç Kartı */}
      {kargoBilgisi && (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginTop: 0, color: '#2c3e50' }}>📦 Kargo Detayları</h3>
          
          {/* YENİ EKLENEN ROTA (Depo'dan - Depo'ya) ALANI */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            backgroundColor: '#f8f9fa', 
            padding: '25px', 
            borderRadius: '15px', 
            marginTop: '20px', 
            border: '1px solid #e1e1e1' 
          }}>
            {/* Mevcut Depo */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🛫</div>
              <div style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '16px' }}>Mevcut Depo</div>
              <div style={{ color: '#3498db', fontSize: '15px', marginTop: '5px', fontWeight: '600' }}>
                {kargoBilgisi.currentWarehouseName || kargoBilgisi.currentWarehouse?.name || 'Araçta / Yolda'}
              </div>
            </div>
            
            {/* Ara Çizgi (Rota) */}
            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 10px' }}>
               <div style={{ borderBottom: '2px dashed #bdc3c7', width: '100%', marginBottom: '8px', position: 'relative' }}>
                 <div style={{ position: 'absolute', right: '-5px', top: '-6px', color: '#bdc3c7' }}>▶</div>
               </div>
               <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#95a5a6', letterSpacing: '1px' }}>ROTA</span>
            </div>

            {/* Hedef Depo */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🛬</div>
              <div style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '16px' }}>Hedef Depo</div>
              <div style={{ color: '#27ae60', fontSize: '15px', marginTop: '5px', fontWeight: '600' }}>
                {/* Hem düz string hem de obje ihtimalini kontrol ediyoruz */}
                {kargoBilgisi.toWarehouseName || kargoBilgisi.toWarehouse?.name || 'Belirtilmemiş'}
              </div>
            </div>
          </div>

          {/* Anlık Durum ve Konum */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '25px', padding: '15px', backgroundColor: '#eef2f5', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
              <strong style={{ width: '80px', color: '#34495e' }}>Durum:</strong> 
              <span style={{ padding: '6px 15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '50px', fontWeight: 'bold', fontSize: '14px' }}>
                {kargoBilgisi.status}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
              <strong style={{ width: '80px', color: '#34495e' }}>Konum:</strong> 
              <span style={{ color: '#555', fontWeight: '500' }}>
                {kargoBilgisi.status === 'OUT_FOR_DELIVERY' ? 'Dağıtıma Çıktı - Kurye Üzerinde' : 
                 kargoBilgisi.status === 'IN_TRANSIT' ? 'Yakın depoya doğru yola çıktı' : 
                 (kargoBilgisi.currentWarehouseName || kargoBilgisi.currentWarehouse?.name || 'Belirsiz')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Admin Güncelleme Paneli */}
      {isAdmin && kargoBilgisi && (
        <div style={{ backgroundColor: '#fffdf0', padding: '25px', borderRadius: '20px', border: '1px solid #f9e79f', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#d35400', fontSize: '18px' }}>⚙️ Admin Yetkileri</h4>
          
          {(kargoBilgisi.status === 'PENDING_APPROVAL' || kargoBilgisi.status === 'REJECTED') ? (
            <div style={{ color: '#856404', fontWeight: 'bold', textAlign: 'center', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '10px' }}>
              ⚠️ Kargo henüz onaylanmadığı veya reddedildiği için güncelleyemezsiniz.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '15px' }}>
              <select value={yeniDurum} onChange={(e) => setYeniDurum(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', flex: 1, outline: 'none', fontSize: '15px' }}>
                {durumSecenekleri.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <button onClick={durumuGuncelle} style={{ padding: '12px 25px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#219653'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
              >
                Güncelle
              </button>
            </div>
          )}
          
          {guncellemeMesaji && <p style={{ marginTop: '15px', fontWeight: 'bold', textAlign: 'center', color: guncellemeMesaji.includes('✅') ? '#27ae60' : '#e74c3c' }}>{guncellemeMesaji}</p>}
        </div>
      )}

      {/* Hareketler Listesi */}
      {hareketler.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '25px', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginTop: 0, color: '#2c3e50' }}>📋 Hareket Geçmişi</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {hareketler.map((h, i) => (
              <div key={i} style={{ padding: '20px', backgroundColor: '#fdfdfd', borderRadius: '12px', borderLeft: '5px solid #3498db', border: '1px solid #f0f0f0', borderLeftWidth: '5px' }}>
                <div style={{ fontSize: '0.85em', color: '#888', marginBottom: '8px' }}>
                  {new Date(h.movementDate).toLocaleString()}
                </div>
                <div style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '15px' }}>{h.status}</div>
                <div style={{ fontSize: '14px', color: '#555', marginTop: '8px' }}>
                  {h.description || (
                    h.status === 'DELIVERED' ? 'Kargo alıcısına teslim edildi.' :
                    h.status === 'OUT_FOR_DELIVERY' ? 'Kargo dağıtıma çıktı.' : 
                    h.status === 'IN_TRANSIT' ? 'Araç transfer sürecinde.' : 
                    (h.fromWarehouse?.name ? `${h.fromWarehouse.name} üzerinden işlem gördü.` : 'Depo Bilgisi Yok')
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default KargoSorgula;