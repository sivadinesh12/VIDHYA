import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ height: '100vh', width: '100vw' }}>
      <App />
    </div>
  </StrictMode>
);
