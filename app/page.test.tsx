import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return <a href={href} className={className}>{children}</a>;
  };
});

describe('Landing Page', () => {
  describe('header', () => {
    it('displays role selection title', () => {
      render(<Home />);
      expect(screen.getByText(/who are you today/i)).toBeInTheDocument();
    });

    it('shows tagline about Gatsby in portal descriptions', () => {
      render(<Home />);
      expect(screen.getAllByText(/gatsby/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('portal cards', () => {
    it('shows Student role card with enter link', () => {
      render(<Home />);
      expect(screen.getByText('Student')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /enter as student/i })).toHaveAttribute('href', '/student');
    });

    it('shows Teacher role card with enter link', () => {
      render(<Home />);
      expect(screen.getByText('Teacher / Staff')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /enter as teacher/i })).toHaveAttribute('href', '/teacher');
    });

    it('shows School Leadership card with enter link', () => {
      render(<Home />);
      expect(screen.getByText('School Leadership')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /enter.*management/i })).toHaveAttribute('href', '/admin');
    });
  });

  describe('footer info', () => {
    it('mentions Gatsby Benchmarks', () => {
      render(<Home />);
      expect(screen.getByText(/8 benchmarks/i)).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies page background surface colour', () => {
      render(<Home />);
      const container = screen.getByTestId('portal-page');
      expect(container).toHaveClass('bg-surface-page');
    });

    it('portal cards are rendered as articles', () => {
      render(<Home />);
      const cards = screen.getAllByRole('article');
      expect(cards.length).toBe(3);
    });

    it('portal links use persona-specific colours', () => {
      render(<Home />);
      const studentLink = screen.getByRole('link', { name: /enter as student/i });
      expect(studentLink).toHaveClass('bg-persona-student');
    });
  });
});
