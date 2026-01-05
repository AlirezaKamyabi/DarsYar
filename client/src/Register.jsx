import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        studentId: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Send data to Backend
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            
            // If successful, save user and go to Dashboard
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            alert('Account Created Successfully!');
            navigate('/dashboard');
        } catch (error) {
            alert('Registration Failed! Email or Student ID might already exist.');
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Create Account</h1>
                <p style={styles.subtitle}>Join DarsYar today</p>
                
                <form onSubmit={handleRegister} style={styles.form}>
                    <div style={{display:'flex', gap:'10px'}}>
                        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required style={styles.input} />
                        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required style={styles.input} />
                    </div>
                    <input type="text" name="studentId" placeholder="Student ID (e.g. 402...)" onChange={handleChange} required style={styles.input} />
                    <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={styles.input} />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
                    
                    <button type="submit" disabled={loading} style={loading ? styles.buttonDisabled : styles.button}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{marginTop: '20px', color: '#666'}}>
                    Already have an account? <Link to="/" style={{color: '#6c5ce7', fontWeight: 'bold'}}>Login</Link>
                </p>
            </div>
        </div>
    );
};

// Reuse the same styles as Login
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
    title: { color: '#333', marginBottom: '10px', fontSize: '28px', fontWeight: 'bold' },
    subtitle: { color: '#666', marginBottom: '30px', fontSize: '16px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: {
        width: '100%', padding: '12px 15px', borderRadius: '10px',
        border: '2px solid #e0e0e0', fontSize: '16px',
        backgroundColor: '#f9f9f9', color: '#000', outline: 'none',
        boxSizing: 'border-box'
    },
    button: {
        padding: '14px', backgroundColor: '#6c5ce7', color: '#fff',
        border: 'none', borderRadius: '10px', fontSize: '16px',
        fontWeight: 'bold', cursor: 'pointer', marginTop: '10px'
    },
    buttonDisabled: {
        padding: '14px', backgroundColor: '#a29bfe', color: '#fff',
        border: 'none', borderRadius: '10px', fontSize: '16px',
        fontWeight: 'bold', cursor: 'wait', marginTop: '10px'
    }
};

export default Register;