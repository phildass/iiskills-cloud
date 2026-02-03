/**
 * @jest-environment jsdom
 */

/**
 * SharedNavbar Tests for Learn Cricket
 * 
 * Tests authentication display behavior:
 * - Not logged in: Shows Sign In + Register
 * - Logged in: Shows email + Logout
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SharedNavbar from '../../components/shared/SharedNavbar';
import { canonicalLinks } from '../../components/shared/canonicalNavLinks';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    route: '/',
    asPath: '/',
  }),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock GoogleTranslate component
jest.mock('../../components/shared/GoogleTranslate', () => {
  return function MockGoogleTranslate() {
    return <div data-testid="google-translate">Translate</div>;
  };
});

describe('SharedNavbar - Learn Cricket Auth Display', () => {
  describe('When user is NOT logged in', () => {
    test('shows Sign In link', () => {
      render(
        <SharedNavbar
          user={null}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      const signInLink = screen.getByText('Sign In');
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute('href', '/login');
    });

    test('shows Register button', () => {
      render(
        <SharedNavbar
          user={null}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      const registerButton = screen.getByText('Register');
      expect(registerButton).toBeInTheDocument();
      expect(registerButton).toHaveAttribute('href', '/register');
    });

    test('does NOT show Logout button', () => {
      render(
        <SharedNavbar
          user={null}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      const logoutButton = screen.queryByText('Logout');
      expect(logoutButton).not.toBeInTheDocument();
    });

    test('does NOT show user email', () => {
      render(
        <SharedNavbar
          user={null}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      // Should not find any email-like text
      const emailText = screen.queryByText(/@/);
      expect(emailText).not.toBeInTheDocument();
    });
  });

  describe('When user IS logged in', () => {
    const mockUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User'
      }
    };

    test('shows user email', () => {
      render(
        <SharedNavbar
          user={mockUser}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      const emailText = screen.getByText('test@example.com');
      expect(emailText).toBeInTheDocument();
    });

    test('shows Logout button', () => {
      render(
        <SharedNavbar
          user={mockUser}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      const logoutButton = screen.getByText('Logout');
      expect(logoutButton).toBeInTheDocument();
    });

    test('calls onLogout when Logout button is clicked', () => {
      const mockOnLogout = jest.fn();
      render(
        <SharedNavbar
          user={mockUser}
          onLogout={mockOnLogout}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      
      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });

    test('does NOT show Sign In link', () => {
      render(
        <SharedNavbar
          user={mockUser}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      const signInLink = screen.queryByText('Sign In');
      expect(signInLink).not.toBeInTheDocument();
    });

    test('does NOT show Register button', () => {
      render(
        <SharedNavbar
          user={mockUser}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      const registerButton = screen.queryByText('Register');
      expect(registerButton).not.toBeInTheDocument();
    });
  });

  describe('Canonical navigation links', () => {
    test('displays all canonical links', () => {
      render(
        <SharedNavbar
          user={null}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('All Apps')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    test('canonical links have correct hrefs', () => {
      render(
        <SharedNavbar
          user={null}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      expect(screen.getByText('Home')).toHaveAttribute('href', '/');
      expect(screen.getByText('All Apps')).toHaveAttribute('href', '/apps');
      expect(screen.getByText('About')).toHaveAttribute('href', '/about');
      expect(screen.getByText('Contact')).toHaveAttribute('href', '/contact');
    });
  });

  describe('App branding', () => {
    test('displays correct app name', () => {
      render(
        <SharedNavbar
          user={null}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={true}
        />
      );

      expect(screen.getByText('Learn Cricket')).toBeInTheDocument();
    });
  });

  describe('When showAuthButtons is false', () => {
    test('does not show auth buttons even when not logged in', () => {
      render(
        <SharedNavbar
          user={null}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={false}
        />
      );

      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
      expect(screen.queryByText('Register')).not.toBeInTheDocument();
    });

    test('does not show user info even when logged in', () => {
      const mockUser = {
        id: 'test-user-123',
        email: 'test@example.com'
      };

      render(
        <SharedNavbar
          user={mockUser}
          onLogout={jest.fn()}
          appName="Learn Cricket"
          homeUrl="/"
          customLinks={canonicalLinks}
          showAuthButtons={false}
        />
      );

      expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
  });
});
