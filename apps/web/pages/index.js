import React from 'react';
import { Layout } from '@iiskills/ui/common';

export default function Home() {
  return (
    <Layout appName="Web">
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Welcome to IISkills Cloud
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#555', marginBottom: '2rem' }}>
          Professional skill development platform for students and professionals.
        </p>

        {/* Placeholder for improved landing content */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>📚 Courses</h2>
            <p style={{ color: '#666' }}>Explore our growing catalog of courses across physics, math, chemistry and more.</p>
          </div>
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🎯 Learn Physics</h2>
            <p style={{ color: '#666' }}>Start with mechanics, thermodynamics, and optics with our structured curriculum.</p>
          </div>
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🔧 Admin</h2>
            <p style={{ color: '#666' }}>Manage courses, lessons, and content from the admin dashboard.</p>
          </div>
        </section>

        {/* TODO: Add hero section, testimonials, course listings from packages/content */}
      </div>
    </Layout>
  );
}
