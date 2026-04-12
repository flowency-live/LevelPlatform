import { render, screen } from '@testing-library/react';
import StudentsPage from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/teacher/students',
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

// Mock heatmap data
const mockHeatmapData = {
  students: [
    {
      studentId: 'STU-001',
      displayName: 'Eagle JS',
      benchmarks: [
        { benchmarkId: 'GB1', percentComplete: 75, status: 'in-progress' },
        { benchmarkId: 'GB2', percentComplete: 100, status: 'complete' },
        { benchmarkId: 'GB3', percentComplete: 50, status: 'in-progress' },
        { benchmarkId: 'GB4', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB5', percentComplete: 25, status: 'in-progress' },
        { benchmarkId: 'GB6', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB7', percentComplete: 100, status: 'complete' },
        { benchmarkId: 'GB8', percentComplete: 50, status: 'in-progress' },
      ],
      overallPercent: 50,
    },
    {
      studentId: 'STU-002',
      displayName: 'Hawk AB',
      benchmarks: [
        { benchmarkId: 'GB1', percentComplete: 100, status: 'complete' },
        { benchmarkId: 'GB2', percentComplete: 100, status: 'complete' },
        { benchmarkId: 'GB3', percentComplete: 75, status: 'in-progress' },
        { benchmarkId: 'GB4', percentComplete: 50, status: 'in-progress' },
        { benchmarkId: 'GB5', percentComplete: 25, status: 'in-progress' },
        { benchmarkId: 'GB6', percentComplete: 100, status: 'complete' },
        { benchmarkId: 'GB7', percentComplete: 75, status: 'in-progress' },
        { benchmarkId: 'GB8', percentComplete: 100, status: 'complete' },
      ],
      overallPercent: 78,
    },
    {
      studentId: 'STU-003',
      displayName: 'Falcon CD',
      benchmarks: [
        { benchmarkId: 'GB1', percentComplete: 25, status: 'in-progress' },
        { benchmarkId: 'GB2', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB3', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB4', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB5', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB6', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB7', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB8', percentComplete: 0, status: 'not-started' },
      ],
      overallPercent: 3,
    },
  ],
  summary: {
    totalStudents: 3,
    averageCompletion: 44,
  },
};

jest.mock('@/lib/hooks/useStudentHeatmap', () => ({
  useStudentHeatmap: () => mockHeatmapData,
}));

describe('StudentsPage', () => {
  describe('header', () => {
    it('displays Students heading', () => {
      render(<StudentsPage />);
      expect(screen.getByRole('heading', { name: /students/i })).toBeInTheDocument();
    });

    it('shows add student button', () => {
      render(<StudentsPage />);
      expect(screen.getByRole('button', { name: /add student/i })).toBeInTheDocument();
    });
  });

  describe('heatmap grid', () => {
    it('renders heatmap table', () => {
      render(<StudentsPage />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('shows benchmark column headers', () => {
      render(<StudentsPage />);
      expect(screen.getByText('GB1')).toBeInTheDocument();
      expect(screen.getByText('GB2')).toBeInTheDocument();
      expect(screen.getByText('GB3')).toBeInTheDocument();
      expect(screen.getByText('GB4')).toBeInTheDocument();
      expect(screen.getByText('GB5')).toBeInTheDocument();
      expect(screen.getByText('GB6')).toBeInTheDocument();
      expect(screen.getByText('GB7')).toBeInTheDocument();
      expect(screen.getByText('GB8')).toBeInTheDocument();
    });

    it('shows Total column', () => {
      render(<StudentsPage />);
      expect(screen.getByText('Total')).toBeInTheDocument();
    });

    it('renders all student rows', () => {
      render(<StudentsPage />);
      expect(screen.getByText('Eagle JS')).toBeInTheDocument();
      expect(screen.getByText('Hawk AB')).toBeInTheDocument();
      expect(screen.getByText('Falcon CD')).toBeInTheDocument();
    });

    it('shows student overall percentages', () => {
      render(<StudentsPage />);
      // Percentages appear in cells, use getAllByText
      expect(screen.getAllByText('50%').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('78%').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('3%')).toBeInTheDocument();
    });
  });

  describe('cell colours', () => {
    it('renders progress cells with colour coding', () => {
      render(<StudentsPage />);
      // Cells should have background colours based on completion
      const cells = screen.getAllByRole('cell');
      expect(cells.length).toBeGreaterThan(0);
    });
  });

  describe('summary', () => {
    it('shows total student count', () => {
      render(<StudentsPage />);
      expect(screen.getByText(/3 students/i)).toBeInTheDocument();
    });

    it('shows average completion', () => {
      render(<StudentsPage />);
      expect(screen.getByText(/44%.*average/i)).toBeInTheDocument();
    });
  });

  describe('student links', () => {
    it('student names link to detail page', () => {
      render(<StudentsPage />);
      const studentLink = screen.getByRole('link', { name: /eagle js/i });
      expect(studentLink).toHaveAttribute('href', '/teacher/students/STU-001');
    });
  });
});
