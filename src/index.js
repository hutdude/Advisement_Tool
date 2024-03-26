import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import StudentView from './components/StudentView.tsx' 
import App from './App'; // Assuming you have an App.js for your React app


createRoot(
  
  document.getElementById('root')
).render(<React.StrictMode>
  <App />
  <StudentView />
</React.StrictMode>)

