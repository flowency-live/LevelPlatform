import { render, screen } from '@testing-library/react';
import StudentDashboard from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/student',
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

// Mock student data hook
const mockStudentProgress = {
  student: {
    id: 'STUDENT-001',
    firstName: 'Emma',
    lastName: 'Wilson',
  },
  benchmarks: [
    { benchmarkId: 'GB1', percentComplete: 75, status: 'in-progress', activitiesCompleted: [] },
    { benchmarkId: 'GB2', percentComplete: 50, status: 'in-progress', activitiesCompleted: [] },
    { benchmarkId: 'GB3', percentComplete: 100, status: 'complete', activitiesCompleted: [] },
    { benchmarkId: 'GB4', percentComplete: 25, status: 'in-progress', activitiesCompleted: [] },
    { benchmarkId: 'GB5', percentComplete: 0, status: 'not-started', activitiesCompleted: [] },
    { benchmarkId: 'GB6', percentComplete: 50, status: 'in-progress', activitiesCompleted: [] },
    { benchmarkId: 'GB7', percentComplete: 75, status: 'in-progress', activitiesCompleted: [] },
    { benchmarkId: 'GB8', percentComplete: 25, status: 'in-progress', activitiesCompleted: [] },
  ],
  overallPercent: 50,
  targets: [],
  employerEncounters: [],
};

jest.mock('@/lib/hooks/useStudentProgress', () => ({
  useStudentProgress: () => mockStudentProgress,
}));

describe('StudentDashboard', () => {
  describe('header section', () => {
    it('displays greeting with student name', () => {
      render(<StudentDashboard />);
      expect(screen.getByRole('heading', { name: /hi, emma/i })).toBeInTheDocument();
    });

    it('shows overall progress percentage', () => {
      render(<StudentDashboard />);
      // The large progress ring in the hero section
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThanOrEqual(1);
      expect(progressBars[0]).toHaveAttribute('aria-valuenow', '50');
    });

    it('displays encouragement message', () => {
      render(<StudentDashboard />);
      expect(screen.getByText(/you're making great progress/i)).toBeInTheDocument();
    });
  });

  describe('benchmark cards', () => {
    it('renders all 8 benchmark cards', () => {
      render(<StudentDashboard />);
      expect(screen.getByText(/careers programme/i)).toBeInTheDocument();
      expect(screen.getByText(/labour market/i)).toBeInTheDocument();
      expect(screen.getByText(/individual needs/i)).toBeInTheDocument();
      expect(screen.getByText(/curriculum links/i)).toBeInTheDocument();
      // GB5 "Employer Encounters" appears twice (card + quick stats)
      expect(screen.getAllByText(/employer encounters/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/work experience/i)).toBeInTheDocument();
      expect(screen.getByText(/education pathways/i)).toBeInTheDocument();
      expect(screen.getByText(/personal guidance/i)).toBeInTheDocument();
    });

    it('displays benchmark ID badges', () => {
      render(<StudentDashboard />);
      expect(screen.getByText('GB1')).toBeInTheDocument();
      expect(screen.getByText('GB2')).toBeInTheDocument();
      expect(screen.getByText('GB8')).toBeInTheDocument();
    });

    it('shows activity counts for benchmarks', () => {
      render(<StudentDashboard />);
      // Each card shows "X/Y activities"
      const activityCounts = screen.getAllByText(/activities/i);
      expect(activityCounts.length).toBeGreaterThanOrEqual(8);
    });

    it('renders 8 benchmark card buttons', () => {
      render(<StudentDashboard />);
      const buttons = screen.getAllByRole('button', { name: /complete/i });
      expect(buttons.length).toBe(8);
    });
  });

  describe('grid layout', () => {
    it('has responsive grid container', () => {
      render(<StudentDashboard />);
      const grid = screen.getByTestId('benchmark-grid');
      expect(grid).toHaveClass('grid');
    });
  });

  describe("what's next section", () => {
    it('displays what\'s next prompt', () => {
      render(<StudentDashboard />);
      expect(screen.getByText(/what's next/i)).toBeInTheDocument();
    });
  });

  describe('quick action cards', () => {
    it('shows employer encounters count', () => {
      render(<StudentDashboard />);
      // Card shows "0 of 3 required encounters"
      expect(screen.getByText(/0 of 3/i)).toBeInTheDocument();
      expect(screen.getByText(/required encounters/i)).toBeInTheDocument();
    });

    it('shows SMART targets card', () => {
      render(<StudentDashboard />);
      expect(screen.getByText(/smart targets/i)).toBeInTheDocument();
    });

    it('has link to view targets', () => {
      render(<StudentDashboard />);
      expect(screen.getByRole('link', { name: /view targets/i })).toHaveAttribute('href', '/student/targets');
    });

    it('has link to log encounter', () => {
      render(<StudentDashboard />);
      expect(screen.getByRole('link', { name: /log encounter/i })).toHaveAttribute('href', '/student/employers');
    });
  });
});
