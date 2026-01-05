import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBox = ({ courseId }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const scrollRef = useRef();

    useEffect(() => {
        fetchMessages();
        // Optional: Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [courseId]);

    // Auto-scroll to bottom when new message arrives
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/messages/${courseId}`);
            setMessages(data);
        } catch (error) { console.error("Chat Error"); }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/messages', {
                courseId,
                text,
                senderName: user.firstName // Send the user's name
            }, config);
            
            setText('');
            fetchMessages();
        } catch (error) {
            alert('Error sending message');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                💬 Classroom Discussion
            </div>

            {/* Messages Area */}
            <div style={styles.messageList}>
                {messages.length === 0 && <p style={{textAlign:'center', color:'#999', fontSize:'12px'}}>No messages yet. Say hello!</p>}
                
                {messages.map((msg, index) => {
                    const isMe = msg.sender === user.firstName;
                    return (
                        <div key={index} style={{
                            ...styles.bubbleWrapper,
                            justifyContent: isMe ? 'flex-end' : 'flex-start'
                        }}>
                            <div style={{
                                ...styles.bubble,
                                backgroundColor: isMe ? '#d1e7dd' : '#f8f9fa',
                                color: isMe ? '#0f5132' : '#333'
                            }}>
                                <strong style={{fontSize:'11px', display:'block', marginBottom:'2px', color: isMe ? '#0f5132' : '#0d6efd'}}>
                                    {isMe ? 'You' : msg.sender}
                                </strong>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={styles.inputArea}>
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.sendBtn}>➤</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: 'white',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '400px' // Fixed height for chat window
    },
    header: {
        backgroundColor: '#6c5ce7',
        color: 'white',
        padding: '10px',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    messageList: {
        flex: 1,
        padding: '15px',
        overflowY: 'auto',
        backgroundColor: '#f4f6f8'
    },
    bubbleWrapper: {
        display: 'flex',
        marginBottom: '10px'
    },
    bubble: {
        maxWidth: '70%',
        padding: '8px 12px',
        borderRadius: '15px',
        fontSize: '14px',
        lineHeight: '1.4',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    inputArea: {
        display: 'flex',
        borderTop: '1px solid #ddd',
        padding: '10px'
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #ddd',
        outline: 'none',
        marginRight: '10px'
    },
    sendBtn: {
        backgroundColor: '#6c5ce7',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        fontSize: '18px'
    }
};

export default ChatBox;