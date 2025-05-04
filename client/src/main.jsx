import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import './assets/mapbox-overrides.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Note: The React Router warning about v7_relativeSplatPath can be ignored 
// as it's just a warning about future changes in React Router v7

// Note: Using HashRouter instead of BrowserRouter for GitHub Pages compatibility

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
); 