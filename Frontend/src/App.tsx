import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogDetail from './pages/BlogDetail';
import BlogFormPage from './pages/BlogFormPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/blogs/create" element={<BlogFormPage />} />
        <Route path="/blogs/:slug/edit" element={<BlogFormPage />} />
      </Routes>
    </Router>
  );
};

export default App;
