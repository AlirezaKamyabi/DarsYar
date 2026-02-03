import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [mode, setMode] = useState('create'); // 'create' or 'join'
    
    // Create Form Data
    const [semesterName, setSemesterName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [instructor, setInstructor] = useState('');

    // Join Form Data
    const [joinId, setJoinId] = useState('');

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${user?.token}` } };

    useEffect(() => {
        if (!user) navigate('/');
        else fetchCourses();
    }, [navigate]);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/courses', config);
            setCourses(data);
        } catch (error) { console.error("Error loading courses"); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/courses', { semester: semesterName, courseName, instructor }, config);
            alert('Lesson Created!');
            resetForm();
        } catch (error) { alert('Error creating course'); }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/courses/join', { courseId: joinId }, config);
            alert('Successfully Joined Class!');
            resetForm();
        } catch (error) { alert('Error joining class. Check the ID.'); }
    };

    const resetForm = () => {
        setCourseName(''); setInstructor(''); setJoinId('');
        fetchCourses();
    };

    const handleLogout = () => { localStorage.removeItem('userInfo'); navigate('/'); };

    const groupedCourses = courses.reduce((acc, course) => {
        (acc[course.semester] = acc[course.semester] || []).push(course);
        return acc;
    }, {});

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <div style={styles.logo}>🎓 DarsYar</div>
                <div style={styles.userSection}>
                    <span style={styles.userName}>Hello, {user?.firstName}</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </nav>

            <div style={styles.content}>
                <div style={styles.headerRow}>
                    <div>
                        <h1 style={styles.heading}>My Dashboard</h1>
                        <p style={styles.subHeading}>Organize your semesters.</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
                        {showForm ? 'Close' : '+ Add / Join Class'}
                    </button>
                </div>

                {showForm && (
                    <div style={styles.formCard}>
                        <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                            <button onClick={()=>setMode('create')} style={mode==='create' ? styles.tabActive : styles.tab}>Create New</button>
                            <button onClick={()=>setMode('join')} style={mode==='join' ? styles.tabActive : styles.tab}>Join Existing</button>
                        </div>

                        {mode === 'create' ? (
                            <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                                <input type="text" placeholder="Semester (e.g. Fall 2025)" value={semesterName} onChange={(e)=>setSemesterName(e.target.value)} required style={styles.input} />
                                <input type="text" placeholder="Lesson Name" value={courseName} onChange={(e)=>setCourseName(e.target.value)} required style={styles.input} />
                                <input type="text" placeholder="Professor Name" value={instructor} onChange={(e)=>setInstructor(e.target.value)} required style={styles.input} />
                                <button type="submit" style={styles.submitBtn}>Create</button>
                            </form>
                        ) : (
                            <form onSubmit={handleJoin} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                                <p style={{fontSize:'14px', color:'#666'}}>Ask your classmate for the <strong>Class ID</strong> found in the URL (e.g. 64f2...)</p>
                                <input type="text" placeholder="Paste Class ID here..." value={joinId} onChange={(e)=>setJoinId(e.target.value)} required style={styles.input} />
                                <button type="submit" style={styles.submitBtn}>Join Class</button>
                            </form>
                        )}
                    </div>
                )}

                {Object.keys(groupedCourses).map(semester => (
                    <div key={semester} style={{ marginBottom: '50px' }}>
                        <h2 style={styles.semesterTitle}>{semester}</h2>
                        <div style={styles.grid}>
                            {groupedCourses[semester].map(course => (
                                <div key={course._id} style={styles.courseCard}>
                                    <div style={styles.cardHeader}>
                                        <div style={styles.iconCircle}>📚</div>
                                        <div>
                                            <h3 style={styles.courseTitle}>{course.courseName}</h3>
                                            <span style={styles.prof}>By {course.instructor}</span>
                                        </div>
                                    </div>
                                    <div style={{fontSize:'10px', color:'#aaa', margin:'10px 0'}}>ID: {course._id}</div>
                                    <Link to={`/course/${course._id}`} style={{textDecoration:'none'}}>
                                        <button style={styles.viewBtn}>Open Class &rarr;</button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', width: '100%', backgroundColor: '#f8f9fa', fontFamily: "'Segoe UI', sans-serif" },
    navbar: { backgroundColor: '#fff', padding: '15px 5%', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
    logo: { fontSize: '22px', fontWeight: 'bold', color: '#6c5ce7' },
    userSection: { display: 'flex', alignItems: 'center', gap: '20px' },
    userName: { fontWeight: '600', color: '#555' },
    logoutBtn: { padding: '8px 20px', backgroundColor: '#ff7675', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    content: { width: '90%', margin: '40px auto' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom:'1px solid #ddd', paddingBottom:'20px' },
    heading: { fontSize: '32px', color: '#2d3436', margin: 0 },
    subHeading: { color: '#636e72', marginTop: '5px' },
    addBtn: { padding: '12px 25px', backgroundColor: '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(108, 92, 231, 0.4)' },
    formCard: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '500px', margin: '0 auto 40px auto' },
    tab: { flex: 1, padding: '10px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '5px', cursor: 'pointer', color:'#666' },
    tabActive: { flex: 1, padding: '10px', backgroundColor: '#6c5ce7', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight:'bold' },
    input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize:'14px', boxSizing:'border-box' },
    submitBtn: { width: '100%', padding: '12px', backgroundColor: '#00b894', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
    semesterTitle: { fontSize: '20px', color: '#6c5ce7', marginBottom: '20px', paddingLeft: '10px', borderLeft: '4px solid #6c5ce7' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
    courseCard: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '180px' },
    cardHeader: { display: 'flex', gap: '15px' },
    iconCircle: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f0f3ff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' },
    courseTitle: { margin: '0 0 5px 0', color: '#2d3436', fontSize:'18px' },
    prof: { color: '#b2bec3', fontSize: '14px' },
    viewBtn: { width: '100%', padding: '10px', backgroundColor: '#fff', color: '#6c5ce7', border: '1px solid #6c5ce7', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: 'auto' }
};

export default Dashboard;