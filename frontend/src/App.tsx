import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IncorporationForm from './pages/IncorporationForm';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm px-6 py-4 mb-8">
          <div className="max-w-4xl mx-auto flex gap-6 font-medium text-gray-700">
            <Link to="/" className="hover:text-blue-600 transition">Incorporate</Link>
            <Link to="/admin" className="hover:text-blue-600 transition">Admin Dashboard</Link>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-6">
          <Routes>
            <Route path="/" element={<IncorporationForm />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;