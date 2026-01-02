import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            navigate('/dashboard');
        } catch (error) {
            alert('Login Failed! Check email/password.');
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' }}>
            <div style={{ width: '350px', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', color: '#333' }}>DarsYar Login</h2>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                        <input type="email" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                        <input type="password" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
                </form>
            </div>
        </div>
    );
};
export default Login;