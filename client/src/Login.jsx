import { useState } from 'react';
import axios from 'axios';
// ✅ FIX: Only one import line for both tools
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            navigate('/dashboard');
        } catch (error) {
            alert('Login Failed! Please check email/password.');
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome Back</h1>
                <p style={styles.subtitle}>Sign in to DarsYar</p>
                
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Student Email</label>
                        <input 
                            type="email" 
                            placeholder="ali@test.com"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={styles.input}
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={styles.input}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={loading ? styles.buttonDisabled : styles.button}
                    >
                        {loading ? 'Logging in...' : 'Login to Portal'}
                    </button>
                </form>

                {/* The "Sign Up" Link */}
                <p style={{marginTop: '20px', color: '#666', fontSize: '14px'}}>
                    Don't have an account? <Link to="/register" style={{color: '#6c5ce7', fontWeight: 'bold', textDecoration:'none'}}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "Arial, sans-serif",
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px 50px',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    },
    title: { color: '#333333', marginBottom: '10px', fontSize: '28px', fontWeight: 'bold' },
    subtitle: { color: '#666666', marginBottom: '30px', fontSize: '16px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { textAlign: 'left' },
    label: { display: 'block', marginBottom: '8px', color: '#444444', fontSize: '14px', fontWeight: '600' },
    input: {
        width: '100%', padding: '12px 15px', borderRadius: '10px',
        border: '2px solid #e0e0e0', fontSize: '16px',
        backgroundColor: '#f9f9f9', color: '#000000', outline: 'none',
        boxSizing: 'border-box'
    },
    button: {
        marginTop: '10px', padding: '14px', backgroundColor: '#6c5ce7',
        color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '16px',
        fontWeight: 'bold', cursor: 'pointer',
    },
    buttonDisabled: {
        marginTop: '10px', padding: '14px', backgroundColor: '#a29bfe',
        color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '16px',
        fontWeight: 'bold', cursor: 'wait',
    }
};

export default Login;