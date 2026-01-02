import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseDetails = () => {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [resources, setResources] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch course info + resources from Backend
                const { data } = await axios.get(`http://localhost:5000/api/courses/${id}`);
                setCourse(data.course);
                setResources(data.resources);
            } catch (error) {
                console.error("Error fetching course details");
            }
        };
        fetchDetails();
    }, [id]);

    if (!course) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', padding: '5px 10px', cursor: 'pointer' }}>
                ← Back to Dashboard
            </button>
            
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h1 style={{ color: '#007bff' }}>{course.courseName}</h1>
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <p><strong>Semester:</strong> {course.semester}</p>
                
                <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
                
                <h3>📂 Course Resources</h3>
                {resources.length === 0 ? (
                    <p style={{ color: '#666' }}>No resources uploaded yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {resources.map((res) => (
                            <li key={res._id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{res.title}</strong>
                                    <span style={{ marginLeft: '10px', fontSize: '12px', padding: '2px 6px', backgroundColor: '#eee', borderRadius: '4px' }}>{res.type}</span>
                                </div>
                                <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                                    Download / View
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CourseDetails;