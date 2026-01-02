import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import CourseDetails from './CourseDetails'; // Import the new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* The new route for details */}
        <Route path="/course/:id" element={<CourseDetails />} />
      </Routes>
    </Router>
  );
}

export default App;