import React from 'react';
import { Navbar } from './Navbar';

export function Layout({ children, appName }) {
  return (
    <>
      <Navbar appName={appName} />
      <main style={{ minHeight: '80vh', padding: '2rem' }}>
        {children}
      </main>
      <footer style={{ background: '#f5f5f5', padding: '1rem', textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>
        © {new Date().getFullYear()} IISkills Cloud. All rights reserved.
      </footer>
    </>
  );
}
