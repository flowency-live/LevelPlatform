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
    it('displays page title', () => {
      render(<StudentDashboard />);
      expect(screen.getByRole('heading', { name: /my career plan/i })).toBeInTheDocument();
    });

    it('shows overall progress percentage', () => {
      render(<StudentDashboard />);
      // The large progress ring in the header
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThanOrEqual(1);
      expect(progressBars[0]).toHaveAttribute('aria-valuenow', '50');
    });

    it('displays student greeting with name', () => {
      render(<StudentDashboard />);
      expect(screen.getByText(/emma/i)).toBeInTheDocument();
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

    it('shows progress for each benchmark', () => {
      render(<StudentDashboard />);
      // Should show progress rings with percentages
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThanOrEqual(8);
    });

    it('links to benchmark detail pages', () => {
      render(<StudentDashboard />);
      const links = screen.getAllByRole('button', { name: /complete/i });
      expect(links.length).toBe(8);
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

  describe('quick stats', () => {
    it('shows employer encounters count', () => {
      render(<StudentDashboard />);
      // The quick stats section shows "0 of 3 required encounters"
      expect(screen.getByText(/0 of 3/i)).toBeInTheDocument();
      expect(screen.getByText(/required encounters/i)).toBeInTheDocument();
    });

    it('shows SMART targets count', () => {
      render(<StudentDashboard />);
      expect(screen.getByText(/smart targets/i)).toBeInTheDocument();
    });
  });
});
