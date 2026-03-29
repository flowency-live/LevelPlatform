import { render, screen } from '@testing-library/react';
import { TopNav } from './TopNav';

// Mock next/link - forward all props including className and aria-current
jest.mock('next/link', () => {
  return function MockLink({ children, href, className, ...props }: { children: React.ReactNode; href: string; className?: string; [key: string]: unknown }) {
    return <a href={href} className={className} {...props}>{children}</a>;
  };
});

describe('TopNav', () => {
  const defaultItems = [
    { label: 'Dashboard', href: '/teacher' },
    { label: 'Students', href: '/teacher/students' },
    { label: 'Reviews', href: '/teacher/reviews' },
    { label: 'Settings', href: '/teacher/settings' },
  ];

  const defaultProps = {
    items: defaultItems,
    activeHref: '/teacher',
    persona: 'teacher' as const,
    userName: 'Ms Smith',
  };

  describe('rendering', () => {
    it('renders all navigation items', () => {
      render(<TopNav {...defaultProps} />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Students')).toBeInTheDocument();
      expect(screen.getByText('Reviews')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders navigation element', () => {
      render(<TopNav {...defaultProps} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders user name', () => {
      render(<TopNav {...defaultProps} />);
      expect(screen.getByText('Ms Smith')).toBeInTheDocument();
    });

    it('renders links with correct hrefs', () => {
      render(<TopNav {...defaultProps} />);
      expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute('href', '/teacher');
      expect(screen.getByRole('link', { name: /Reviews/i })).toHaveAttribute('href', '/teacher/reviews');
    });
  });

  describe('active state', () => {
    it('marks active item with aria-current', () => {
      render(<TopNav {...defaultProps} />);
      expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute('aria-current', 'page');
    });

    it('does not mark inactive items', () => {
      render(<TopNav {...defaultProps} />);
      expect(screen.getByRole('link', { name: /Students/i })).not.toHaveAttribute('aria-current');
    });

    it('applies active styling with bottom border', () => {
      render(<TopNav {...defaultProps} />);
      const activeLink = screen.getByRole('link', { name: /Dashboard/i });
      expect(activeLink).toHaveClass('border-b-2');
    });
  });

  describe('persona colours', () => {
    it('uses teacher teal for teacher persona', () => {
      render(<TopNav {...defaultProps} persona="teacher" />);
      const activeLink = screen.getByRole('link', { name: /Dashboard/i });
      expect(activeLink).toHaveClass('border-persona-teacher');
    });

    it('uses management slate for management persona', () => {
      render(<TopNav {...defaultProps} persona="management" />);
      const activeLink = screen.getByRole('link', { name: /Dashboard/i });
      expect(activeLink).toHaveClass('border-persona-management');
    });
  });

  describe('layout', () => {
    it('has horizontal layout', () => {
      render(<TopNav {...defaultProps} />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('flex');
    });

    it('has border bottom', () => {
      render(<TopNav {...defaultProps} />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('border-b');
    });
  });

  describe('accessibility', () => {
    it('has aria-label for navigation', () => {
      render(<TopNav {...defaultProps} />);
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Staff navigation');
    });
  });
});
