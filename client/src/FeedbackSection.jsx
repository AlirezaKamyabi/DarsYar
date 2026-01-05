import { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackSection = ({ courseId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const user = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        fetchFeedback();
    }, [courseId]);

    const fetchFeedback = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/feedback/${courseId}`);
            setFeedbacks(data);
        } catch (error) { console.error("Error loading feedback"); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/feedback', {
                courseId, rating, comment
            }, config);
            
            setComment('');
            fetchFeedback(); // Refresh list
        } catch (error) { alert('Error submitting feedback'); }
    };

    // Calculate Average
    const averageRating = feedbacks.length > 0 
        ? (feedbacks.reduce((acc, item) => acc + item.rating, 0) / feedbacks.length).toFixed(1) 
        : "N/A";

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={{margin:0}}>⭐ Reviews & Ratings</h3>
                <span style={styles.badge}>Avg: {averageRating} / 5</span>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                    <label style={{fontWeight:'bold'}}>Rate:</label>
                    <select value={rating} onChange={(e)=>setRating(Number(e.target.value))} style={styles.select}>
                        <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                        <option value="4">⭐⭐⭐⭐ (Good)</option>
                        <option value="3">⭐⭐⭐ (Average)</option>
                        <option value="2">⭐⭐ (Poor)</option>
                        <option value="1">⭐ (Terrible)</option>
                    </select>
                </div>
                <textarea 
                    placeholder="Write your opinion about this course..." 
                    value={comment} 
                    onChange={(e)=>setComment(e.target.value)}
                    required
                    style={styles.textarea}
                />
                <button type="submit" style={styles.button}>Post Review</button>
            </form>

            {/* List of Reviews */}
            <div style={styles.list}>
                {feedbacks.map((fb) => (
                    <div key={fb._id} style={styles.reviewCard}>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <strong>{fb.userName || 'Student'}</strong>
                            <span style={{color:'#f1c40f'}}>{'★'.repeat(fb.rating)}</span>
                        </div>
                        <p style={{color:'#555', marginTop:'5px'}}>{fb.comment}</p>
                        <small style={{color:'#999'}}>{new Date(fb.createdAt).toLocaleDateString()}</small>
                    </div>
                ))}
                {feedbacks.length === 0 && <p style={{color:'#777', fontStyle:'italic'}}>No reviews yet. Be the first!</p>}
            </div>
        </div>
    );
};

const styles = {
    container: { marginTop: '30px', backgroundColor: '#fdfdfd', padding: '20px', borderRadius: '15px', border: '1px solid #eee' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    badge: { backgroundColor: '#ffeaa7', padding: '5px 10px', borderRadius: '10px', fontWeight: 'bold', color: '#d35400' },
    form: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' },
    select: { padding: '5px', borderRadius: '5px' },
    textarea: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '60px', marginBottom: '10px', boxSizing:'border-box' },
    button: { padding: '8px 15px', backgroundColor: '#0984e3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    reviewCard: { backgroundColor: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }
};

export default FeedbackSection;