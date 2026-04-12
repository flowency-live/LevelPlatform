import { render, screen } from '@testing-library/react';
import TeacherLayout from './layout';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/teacher',
}));

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, className, ...props }: { children: React.ReactNode; href: string; className?: string; [key: string]: unknown }) {
    return <a href={href} className={className} {...props}>{children}</a>;
  };
});

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        name: 'Sarah Mitchell',
        email: 'sarah@school.uk',
        roles: ['gatsby-lead'],
      },
    },
    status: 'authenticated',
  }),
}));

describe('TeacherLayout', () => {
  describe('rendering', () => {
    it('renders children content', () => {
      render(
        <TeacherLayout>
          <div data-testid="child-content">Teacher Content</div>
        </TeacherLayout>
      );
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('renders header with tenant branding', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('displays Level branding', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      // Level appears in both sidebar and mobile header
      expect(screen.getAllByText(/level/i).length).toBeGreaterThanOrEqual(1);
    });

    it('displays staff name from session', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      expect(screen.getByText('Sarah Mitchell')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('renders navigation', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('shows Dashboard nav item', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    });

    it('shows Students nav item', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      expect(screen.getByRole('link', { name: /students/i })).toBeInTheDocument();
    });

    it('shows Activities nav item', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      expect(screen.getByRole('link', { name: /activities/i })).toBeInTheDocument();
    });

    it('shows Evidence nav item', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      expect(screen.getByRole('link', { name: /evidence/i })).toBeInTheDocument();
    });

    it('has correct navigation hrefs', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/teacher');
      expect(screen.getByRole('link', { name: /students/i })).toHaveAttribute('href', '/teacher/students');
      expect(screen.getByRole('link', { name: /activities/i })).toHaveAttribute('href', '/teacher/activities');
      expect(screen.getByRole('link', { name: /evidence/i })).toHaveAttribute('href', '/teacher/evidence');
    });
  });

  describe('persona styling', () => {
    it('applies teacher persona colour to sidebar', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      const sidebar = screen.getByRole('navigation');
      expect(sidebar.closest('aside')).toHaveClass('bg-persona-teacher');
    });
  });

  describe('layout structure', () => {
    it('has main content area', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('applies page background colour', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      const container = screen.getByRole('main').parentElement?.parentElement;
      expect(container).toHaveClass('bg-surface-page');
    });
  });

  describe('sign out', () => {
    it('shows sign out link', () => {
      render(
        <TeacherLayout>
          <div>Content</div>
        </TeacherLayout>
      );
      expect(screen.getByRole('link', { name: /sign out/i })).toBeInTheDocument();
    });
  });
});
