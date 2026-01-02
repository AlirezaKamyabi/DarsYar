import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Added Link here

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            fetchCourses();
        }
    }, [navigate, user]);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/courses');
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <nav style={{ backgroundColor: '#fff', padding: '15px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: '#007bff', margin: 0 }}>DarsYar Dashboard</h2>
                <div>
                    <span style={{ marginRight: '15px', fontWeight: 'bold' }}>Hello, {user?.firstName}</span>
                    <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
                </div>
            </nav>

            <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ color: '#333' }}>Current Semester Courses</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {courses.map((course) => (
                        <div key={course._id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '5px solid #007bff' }}>
                            <h3 style={{ marginTop: 0 }}>{course.courseName}</h3>
                            <p style={{ color: '#666' }}>👨‍🏫 {course.instructor}</p>
                            <p style={{ color: '#888', fontSize: '14px' }}>📅 {course.semester}</p>
                            
                            {/* This Link makes the button work! */}
                            <Link to={`/course/${course._id}`}>
                                <button style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#e7f1ff', color: '#007bff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    View Resources →
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;