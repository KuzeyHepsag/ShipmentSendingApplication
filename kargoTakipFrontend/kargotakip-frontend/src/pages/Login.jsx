import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9000/api/v1/auth/login', { username, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      window.location.href = '/'; 
    } catch (error) {
      alert('Giriş başarısız!');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '50px 40px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '25px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        textAlign: 'center',
        color: 'white'
      }}>
        
        {/* LOGO KISMI */}
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '800', 
            letterSpacing: '2px', 
            textShadow: '2px 4px 6px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            📦 KargoTakip
          </h1>
        </div>

        <h2 style={{ marginBottom: '30px', fontWeight: '300', letterSpacing: '1px', fontSize: '20px', opacity: '0.9' }}>
          Hoş Geldiniz
        </h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="text" 
            placeholder="Kullanıcı Adı" 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ 
              padding: '15px', 
              borderRadius: '50px', 
              border: 'none', 
              background: 'rgba(255, 255, 255, 0.2)', 
              color: 'white',
              outline: 'none',
              paddingLeft: '20px',
              fontSize: '15px'
            }} 
          />
          <input 
            type="password" 
            placeholder="Şifre" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ 
              padding: '15px', 
              borderRadius: '50px', 
              border: 'none', 
              background: 'rgba(255, 255, 255, 0.2)', 
              color: 'white',
              outline: 'none',
              paddingLeft: '20px',
              fontSize: '15px'
            }} 
          />
          <button type="submit" style={{ 
            padding: '15px', 
            marginTop: '10px',
            background: 'white', 
            color: '#764ba2', 
            border: 'none', 
            borderRadius: '50px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: '0.4s',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Giriş Yap
          </button>

          {/* Kayıt Ol Linki */}
          <Link to="/register" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '14px', 
            opacity: '0.8',
            transition: '0.3s',
            marginTop: '10px',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.8'}
          >
            Henüz hesabın yok mu? Kayıt Ol
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;