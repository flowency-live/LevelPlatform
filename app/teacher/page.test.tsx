import { render, screen } from '@testing-library/react';
import TeacherDashboard from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/teacher',
  useRouter: () => ({
    push: jest.fn(),
  }),
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
        tenantId: 'TENANT-ARNFIELD',
      },
    },
    status: 'authenticated',
  }),
}));

// Mock data for dashboard
const mockDashboardData = {
  compliance: {
    benchmarks: [
      { benchmarkId: 'GB1', name: 'Careers Programme', percentComplete: 75, studentCount: 18 },
      { benchmarkId: 'GB2', name: 'Labour Market', percentComplete: 60, studentCount: 14 },
      { benchmarkId: 'GB3', name: 'Individual Needs', percentComplete: 85, studentCount: 20 },
      { benchmarkId: 'GB4', name: 'Curriculum Links', percentComplete: 40, studentCount: 10 },
      { benchmarkId: 'GB5', name: 'Employer Encounters', percentComplete: 55, studentCount: 13 },
      { benchmarkId: 'GB6', name: 'Work Experience', percentComplete: 30, studentCount: 7 },
      { benchmarkId: 'GB7', name: 'Education Pathways', percentComplete: 70, studentCount: 17 },
      { benchmarkId: 'GB8', name: 'Personal Guidance', percentComplete: 45, studentCount: 11 },
    ],
    overallPercent: 58,
  },
  stats: {
    studentCount: 24,
    pendingEvidence: 12,
    activitiesThisWeek: 5,
  },
};

jest.mock('@/lib/hooks/useTeacherDashboard', () => ({
  useTeacherDashboard: () => mockDashboardData,
}));

describe('TeacherDashboard', () => {
  describe('header section', () => {
    it('displays welcome message with staff name', () => {
      render(<TeacherDashboard />);
      expect(screen.getByRole('heading', { name: /welcome.*sarah/i })).toBeInTheDocument();
    });

    it('shows overall compliance percentage', () => {
      render(<TeacherDashboard />);
      expect(screen.getByText(/58%/)).toBeInTheDocument();
    });
  });

  describe('gatsby compliance overview', () => {
    it('displays Gatsby Benchmarks heading', () => {
      render(<TeacherDashboard />);
      expect(screen.getByRole('heading', { name: /gatsby benchmarks/i })).toBeInTheDocument();
    });

    it('renders all 8 benchmark rows', () => {
      render(<TeacherDashboard />);
      expect(screen.getByText('GB1')).toBeInTheDocument();
      expect(screen.getByText('GB2')).toBeInTheDocument();
      expect(screen.getByText('GB3')).toBeInTheDocument();
      expect(screen.getByText('GB4')).toBeInTheDocument();
      expect(screen.getByText('GB5')).toBeInTheDocument();
      expect(screen.getByText('GB6')).toBeInTheDocument();
      expect(screen.getByText('GB7')).toBeInTheDocument();
      expect(screen.getByText('GB8')).toBeInTheDocument();
    });

    it('shows benchmark names', () => {
      render(<TeacherDashboard />);
      expect(screen.getByText(/careers programme/i)).toBeInTheDocument();
      expect(screen.getByText(/labour market/i)).toBeInTheDocument();
      expect(screen.getByText(/work experience/i)).toBeInTheDocument();
    });

    it('displays progress bars for each benchmark', () => {
      render(<TeacherDashboard />);
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBe(8);
    });
  });

  describe('quick stats', () => {
    it('shows total student count', () => {
      render(<TeacherDashboard />);
      expect(screen.getByText('24')).toBeInTheDocument();
      // "Students" appears in stats card and benchmark rows
      expect(screen.getAllByText(/students/i).length).toBeGreaterThanOrEqual(1);
    });

    it('shows pending evidence count', () => {
      render(<TeacherDashboard />);
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });

    it('shows activities this week', () => {
      render(<TeacherDashboard />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText(/this week/i)).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    it('has link to students page', () => {
      render(<TeacherDashboard />);
      expect(screen.getByRole('link', { name: /view.*students/i })).toHaveAttribute('href', '/teacher/students');
    });

    it('has link to evidence queue', () => {
      render(<TeacherDashboard />);
      expect(screen.getByRole('link', { name: /review.*evidence/i })).toHaveAttribute('href', '/teacher/evidence');
    });

    it('has link to create activity', () => {
      render(<TeacherDashboard />);
      expect(screen.getByRole('link', { name: /create.*activity/i })).toHaveAttribute('href', '/teacher/activities/create');
    });
  });

  describe('responsive layout', () => {
    it('has grid container for stats', () => {
      render(<TeacherDashboard />);
      const statsContainer = screen.getByTestId('stats-grid');
      expect(statsContainer).toHaveClass('grid');
    });
  });
});
