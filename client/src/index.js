import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider toastOptions={{ defaultOptions: { position: 'bottom' } }}>
    <App />
  </ChakraProvider>
);
reportWebVitals();
