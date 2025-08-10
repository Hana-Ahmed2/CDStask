import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomThemeProvider } from './contexts/ThemeContext';
import App from './App.tsx';
import Nextpage from './NextPage.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Nextpage" element={<Nextpage />} />
        </Routes>
      </BrowserRouter>
    </CustomThemeProvider>
  </React.StrictMode>
);