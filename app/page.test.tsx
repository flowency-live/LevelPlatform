import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('Landing Page', () => {
  describe('header', () => {
    it('displays Elevate branding', () => {
      render(<Home />);
      expect(screen.getByText(/elevate/i)).toBeInTheDocument();
    });

    it('shows tagline about careers guidance', () => {
      render(<Home />);
      expect(screen.getAllByText(/gatsby/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('portal cards', () => {
    it('shows Student Portal card', () => {
      render(<Home />);
      expect(screen.getByText(/student portal/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /enter as student/i })).toHaveAttribute('href', '/student');
    });

    it('shows Teacher Dashboard card', () => {
      render(<Home />);
      expect(screen.getByText(/teacher dashboard/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /enter as teacher/i })).toHaveAttribute('href', '/teacher');
    });

    it('shows Admin/Management card', () => {
      render(<Home />);
      expect(screen.getByText(/school management/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /enter.*management/i })).toHaveAttribute('href', '/admin');
    });
  });

  describe('footer info', () => {
    it('mentions Gatsby Benchmarks', () => {
      render(<Home />);
      expect(screen.getByText(/8 benchmarks/i)).toBeInTheDocument();
    });
  });
});
