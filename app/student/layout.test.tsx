import { render, screen } from '@testing-library/react';
import StudentLayout from './layout';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/student',
}));

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, className, ...props }: { children: React.ReactNode; href: string; className?: string; [key: string]: unknown }) {
    return <a href={href} className={className} {...props}>{children}</a>;
  };
});

describe('StudentLayout', () => {
  describe('rendering', () => {
    it('renders children content', () => {
      render(
        <StudentLayout>
          <div data-testid="child-content">Student Content</div>
        </StudentLayout>
      );
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('renders tenant header', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('displays tenant logo or name', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      expect(screen.getByText(/elevate/i)).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('renders bottom navigation', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    });

    it('shows all navigation items', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      // Navigation items appear in both sidebar and bottom nav
      expect(screen.getAllByText('Home').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('My Plan').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Targets').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Employers').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Profile').length).toBeGreaterThanOrEqual(1);
    });

    it('has correct navigation hrefs', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      // Links appear in both sidebar and bottom nav
      const homeLinks = screen.getAllByRole('link', { name: /home/i });
      expect(homeLinks.some(link => link.getAttribute('href') === '/student')).toBe(true);

      const planLinks = screen.getAllByRole('link', { name: /my plan/i });
      expect(planLinks.some(link => link.getAttribute('href') === '/student/plan')).toBe(true);

      const targetLinks = screen.getAllByRole('link', { name: /targets/i });
      expect(targetLinks.some(link => link.getAttribute('href') === '/student/targets')).toBe(true);

      const employerLinks = screen.getAllByRole('link', { name: /employers/i });
      expect(employerLinks.some(link => link.getAttribute('href') === '/student/employers')).toBe(true);

      const profileLinks = screen.getAllByRole('link', { name: /profile/i });
      expect(profileLinks.some(link => link.getAttribute('href') === '/student/profile')).toBe(true);
    });
  });

  describe('persona styling', () => {
    it('applies student persona colour to active nav item in bottom nav', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      // Bottom nav uses persona colors for active state
      const bottomNav = screen.getByRole('navigation', { name: /main navigation/i });
      const activeLink = bottomNav.querySelector('a[aria-current="page"]');
      expect(activeLink).toHaveClass('text-persona-student');
    });
  });

  describe('tenant header styling', () => {
    it('applies tenant primary background to header', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-tenant-primary');
    });

    it('applies white text to header', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('text-white');
    });
  });

  describe('layout structure', () => {
    it('has main content area', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('applies page background colour to layout container', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      // Background is on the outer container, not main
      const container = screen.getByRole('main').parentElement?.parentElement;
      expect(container).toHaveClass('bg-surface-page');
    });

    it('provides padding for fixed bottom nav on mobile', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      const main = screen.getByRole('main');
      // pb-20 for mobile bottom nav, lg:pb-8 for desktop
      expect(main).toHaveClass('pb-20');
    });
  });
});
