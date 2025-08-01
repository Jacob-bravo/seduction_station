import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext/AuthContext';
import './index.css';
import App from './App.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
    </AuthProvider>

  </Router>
);

