import ChatBox from './ChatBox';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import our components
import TaskManager from './TaskManager';     // <--- The Task List
import FeedbackSection from './FeedbackSection'; // <--- NEW: The Reviews

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [resources, setResources] = useState([]);
    
    // Add Resource Form State
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newLink, setNewLink] = useState('');
    const [newType, setNewType] = useState('PDF');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!userInfo) {
            navigate('/');
        } else {
            fetchDetails();
        }
    }, [id]);

    const fetchDetails = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/courses/${id}`);
            setCourse(data.course);
            setResources(data.resources);
        } catch (error) {
            console.error("Error fetching data");
        }
    };

    const handleAddResource = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post(`http://localhost:5000/api/courses/${id}/resources`, 
                { title: newTitle, type: newType, fileUrl: newLink }, config);
            
            alert('Resource Added Successfully!');
            setShowForm(false);
            setNewTitle('');
            setNewLink('');
            fetchDetails();
        } catch (error) {
            alert('Error adding resource.');
        }
    };

    if (!course) return <div style={{textAlign:'center', marginTop: '50px'}}>Loading...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            {/* Back Button */}
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', padding: '8px 15px', cursor: 'pointer', border:'none', background:'transparent', color:'#555', fontSize: '16px' }}>
                ← Back to Dashboard
            </button>
            
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                
                {/* Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                        <h1 style={{ color: '#2c3e50', margin:0 }}>{course.courseName}</h1>
                        <p style={{ color: '#7f8c8d', margin:'5px 0' }}>{course.semester} | Dr. {course.instructor}</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {showForm ? 'Close Form' : '+ Add Resource'}
                    </button>
                </div>

                {/* Add Resource Form */}
                {showForm && (
                    <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', border: '2px dashed #27ae60' }}>
                        <h3 style={{marginTop: 0}}>Add New File/Link</h3>
                        <form onSubmit={handleAddResource}>
                            <input type="text" placeholder="Title" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} required style={{width:'100%', padding:'10px', marginBottom:'10px', boxSizing:'border-box'}} />
                            <input type="text" placeholder="Link" value={newLink} onChange={(e)=>setNewLink(e.target.value)} required style={{width:'100%', padding:'10px', marginBottom:'10px', boxSizing:'border-box'}} />
                            <select value={newType} onChange={(e)=>setNewType(e.target.value)} style={{width:'100%', padding:'10px', marginBottom:'10px'}}>
                                <option value="PDF">PDF Document</option>
                                <option value="Video">Video Link</option>
                                <option value="Link">Website Link</option>
                            </select>
                            <button type="submit" style={{width:'100%', padding:'10px', backgroundColor:'#2980b9', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>Upload</button>
                        </form>
                    </div>
                )}
                
                <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />
                
                {/* Resource List */}
                <h3>📂 Course Resources</h3>
                {resources.length === 0 ? <p style={{color:'#999'}}>No resources yet.</p> : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {resources.map((res) => (
                            <li key={res._id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div><strong>{res.title}</strong> <span style={{fontSize:'12px', color:'#999'}}>({res.type})</span></div>
                                <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', fontWeight:'bold', textDecoration:'none' }}>Open</a>
                            </li>
                        ))}
                    </ul>
                )}

                {/* --- THIS IS THE NEW PART --- */}
                
                <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />
                
                {/* 1. Task Manager Component */}
                <TaskManager courseId={id} />

                <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

                {/* 2. Feedback Component (New) */}
                <FeedbackSection courseId={id} />
                <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />
    
    {/* Chat Component */}
    <ChatBox courseId={id} />

            </div>
        </div>
    );
};

export default CourseDetails;