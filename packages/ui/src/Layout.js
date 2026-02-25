import React from 'react';
import { Navbar } from './Navbar';

export function Layout({ children, appName }) {
  return (
    <>
      <Navbar appName={appName} />
      <main style={{ minHeight: '80vh', padding: '2rem', background: '#f9fafb' }}>
        {children}
      </main>
      <footer
        style={{
          background: '#1e3a8a',
          color: '#cbd5e1',
          padding: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem',
        }}
      >
        <div style={{ marginBottom: '0.5rem', color: '#fff', fontWeight: 600 }}>
          Indian Institute of Professional Skills Development
        </div>
        © {new Date().getFullYear()} IISkills Cloud. All rights reserved.
      </footer>
    </>
  );
}
