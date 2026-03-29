import { render, screen } from '@testing-library/react';
import { BottomNav } from './BottomNav';

// Mock next/link - forward all props including className and aria-current
jest.mock('next/link', () => {
  return function MockLink({ children, href, className, ...props }: { children: React.ReactNode; href: string; className?: string; [key: string]: unknown }) {
    return <a href={href} className={className} {...props}>{children}</a>;
  };
});

describe('BottomNav', () => {
  const defaultItems = [
    { icon: 'home', label: 'Home', href: '/student' },
    { icon: 'chart', label: 'Plan', href: '/student/plan' },
    { icon: 'target', label: 'Targets', href: '/student/targets' },
    { icon: 'user', label: 'Profile', href: '/student/profile' },
  ];

  describe('rendering', () => {
    it('renders all navigation items', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Plan')).toBeInTheDocument();
      expect(screen.getByText('Targets')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('renders navigation element', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders links with correct hrefs', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      expect(screen.getByRole('link', { name: /Home/i })).toHaveAttribute('href', '/student');
      expect(screen.getByRole('link', { name: /Targets/i })).toHaveAttribute('href', '/student/targets');
    });
  });

  describe('active state', () => {
    it('marks active item with aria-current', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      expect(screen.getByRole('link', { name: /Home/i })).toHaveAttribute('aria-current', 'page');
    });

    it('does not mark inactive items', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      expect(screen.getByRole('link', { name: /Plan/i })).not.toHaveAttribute('aria-current');
    });

    it('applies active styling to current item', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      const activeLink = screen.getByRole('link', { name: /Home/i });
      expect(activeLink).toHaveClass('text-persona-student');
    });
  });

  describe('persona colours', () => {
    it('uses student blue for student persona', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      const activeLink = screen.getByRole('link', { name: /Home/i });
      expect(activeLink).toHaveClass('text-persona-student');
    });

    it('uses teacher teal for teacher persona', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="teacher" />
      );
      const activeLink = screen.getByRole('link', { name: /Home/i });
      expect(activeLink).toHaveClass('text-persona-teacher');
    });

    it('uses management slate for management persona', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="management" />
      );
      const activeLink = screen.getByRole('link', { name: /Home/i });
      expect(activeLink).toHaveClass('text-persona-management');
    });
  });

  describe('badge', () => {
    it('renders badge when provided', () => {
      const itemsWithBadge = [
        { icon: 'home', label: 'Home', href: '/student', badge: 3 },
      ];
      render(
        <BottomNav items={itemsWithBadge} activeHref="/student" persona="student" />
      );
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('does not render badge when not provided', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      expect(screen.queryByTestId('nav-badge')).not.toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('is fixed to bottom', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('fixed', 'bottom-0');
    });

    it('has correct height for touch targets', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('h-16');
    });

    it('spans full width', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('w-full');
    });
  });

  describe('accessibility', () => {
    it('has aria-label for navigation', () => {
      render(
        <BottomNav items={defaultItems} activeHref="/student" persona="student" />
      );
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
    });
  });
});
