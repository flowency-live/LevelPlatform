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

    it('shows all 4 navigation items', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Plan')).toBeInTheDocument();
      expect(screen.getByText('Targets')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('has correct navigation hrefs', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/student');
      expect(screen.getByRole('link', { name: /plan/i })).toHaveAttribute('href', '/student/plan');
      expect(screen.getByRole('link', { name: /targets/i })).toHaveAttribute('href', '/student/targets');
      expect(screen.getByRole('link', { name: /profile/i })).toHaveAttribute('href', '/student/profile');
    });
  });

  describe('persona styling', () => {
    it('applies student persona colour to active nav item', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      const activeLink = screen.getByRole('link', { name: /home/i });
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

    it('applies page background colour', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      const main = screen.getByRole('main');
      expect(main).toHaveClass('bg-surface-page');
    });

    it('provides padding for fixed bottom nav', () => {
      render(
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      );
      const main = screen.getByRole('main');
      expect(main).toHaveClass('pb-16');
    });
  });
});
