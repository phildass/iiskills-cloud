"use client";

import { useAuth } from "@/contexts/AuthContext";
import SharedNavbar from "./SharedNavbar";
import SubdomainNavbar from "./SubdomainNavbar";
import Footer from "./Footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { user } = useAuth();

  // Define subdomain-specific navigation sections
  const subdomainSections = [
    {
      label: 'Home',
      href: '/',
      description: 'Welcome to Learn Aptitude'
    },
    {
      label: 'Brief Test',
      href: '/brief-test',
      description: 'Quick 5-minute aptitude assessment'
    },
    {
      label: 'Elaborate Test',
      href: '/elaborate-test',
      description: 'Comprehensive 20-40 minute assessment'
    },
    {
      label: 'Admin Panel',
      href: '/admin',
      description: 'Administrative access (requires login)'
    }
  ];

  const handleLogout = async () => {
    // Logout handled by AuthContext
    // Optionally redirect to home page
    window.location.href = '/';
  };

  return (
    <>
      <SharedNavbar 
        user={user}
        onLogout={handleLogout}
        appName="Learn Aptitude"
        homeUrl="/"
        showAuthButtons={false}
        customLinks={[
          { href: 'https://iiskills.cloud', label: 'Home', className: 'hover:text-primary transition' },
          { href: 'https://iiskills.cloud/courses', label: 'Courses', className: 'hover:text-primary transition' },
          { href: 'https://iiskills.cloud/certification', label: 'Certification', className: 'hover:text-primary transition' },
          { href: 'https://www.aienter.in/payments', label: 'Payments', className: 'hover:text-primary transition' },
          { href: 'https://iiskills.cloud/about', label: 'About', className: 'hover:text-primary transition' },
          { href: 'https://iiskills.cloud/terms', label: 'Terms & Conditions', className: 'hover:text-primary transition' },
          { href: '/admin', label: 'Sign In', className: 'hover:text-primary transition' },
          { href: '/admin', label: 'Register', className: 'bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold', mobileClassName: 'block bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold' }
        ]}
      />
      <SubdomainNavbar
        subdomainName="Learn Aptitude"
        sections={subdomainSections}
      />
      {children}
      <Footer />
    </>
  );
}
