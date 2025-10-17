import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './assets/css/quiz_form.css';
import './assets/css/quiz_view.css';

import Home from './pages/quiz_form';
import QuizShow from './pages/quiz_view';

import NotFoundPage from './pages/Notfound';
import Footer from './pages/footer';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playing-quiz" element={<QuizShow />} />

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
      <Footer />
    </Router>
  </StrictMode>,
);
