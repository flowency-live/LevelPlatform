import { render, screen, fireEvent } from '@testing-library/react';
import BenchmarkDetailPage from './page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
  useParams: () => ({ id: 'GB1' }),
}));

// Mock student data hook
const mockBenchmarkProgress = {
  benchmarkId: 'GB1',
  percentComplete: 75,
  status: 'in-progress',
  activitiesCompleted: [
    { activityId: 'GB1-01', completedAt: '2025-03-15T10:00:00Z' },
    { activityId: 'GB1-02', completedAt: '2025-03-16T11:00:00Z' },
    { activityId: 'GB1-03', completedAt: '2025-03-17T12:00:00Z' },
  ],
};

const mockStudentProgress = {
  student: {
    id: 'STUDENT-001',
    firstName: 'Emma',
    lastName: 'Wilson',
  },
  benchmarks: [mockBenchmarkProgress],
  overallPercent: 50,
  targets: [],
  employerEncounters: [],
};

jest.mock('@/lib/hooks/useStudentProgress', () => ({
  useStudentProgress: () => mockStudentProgress,
}));

describe('BenchmarkDetailPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('header section', () => {
    it('displays benchmark name', () => {
      render(<BenchmarkDetailPage />);
      expect(screen.getByRole('heading', { name: /careers programme/i })).toBeInTheDocument();
    });

    it('shows benchmark ID badge', () => {
      render(<BenchmarkDetailPage />);
      expect(screen.getByText('GB1')).toBeInTheDocument();
    });

    it('displays progress ring with percentage', () => {
      render(<BenchmarkDetailPage />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    });

    it('has back button', () => {
      render(<BenchmarkDetailPage />);
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });
  });

  describe('benchmark description', () => {
    it('shows benchmark description text', () => {
      render(<BenchmarkDetailPage />);
      expect(screen.getByText(/embedded programme/i)).toBeInTheDocument();
    });
  });

  describe('activity list', () => {
    it('renders all activities for the benchmark', () => {
      render(<BenchmarkDetailPage />);
      expect(screen.getByText(/my career plan introduction/i)).toBeInTheDocument();
      expect(screen.getByText(/set career goals/i)).toBeInTheDocument();
      expect(screen.getByText(/review career progress/i)).toBeInTheDocument();
      expect(screen.getByText(/update career plan/i)).toBeInTheDocument();
    });

    it('shows checkboxes for each activity', () => {
      render(<BenchmarkDetailPage />);
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBe(4);
    });

    it('marks completed activities as checked', () => {
      render(<BenchmarkDetailPage />);
      const checkboxes = screen.getAllByRole('checkbox');
      // First 3 activities are completed
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      expect(checkboxes[3]).not.toBeChecked();
    });

    it('shows completion date for completed activities', () => {
      render(<BenchmarkDetailPage />);
      expect(screen.getByText(/15 mar/i)).toBeInTheDocument();
    });
  });

  describe('activity completion toggle', () => {
    it('toggles activity completion on checkbox click', () => {
      render(<BenchmarkDetailPage />);
      const checkboxes = screen.getAllByRole('checkbox');
      const uncheckedBox = checkboxes[3];

      fireEvent.click(uncheckedBox);
      expect(uncheckedBox).toBeChecked();
    });
  });

  describe('progress summary', () => {
    it('shows activity completion count', () => {
      render(<BenchmarkDetailPage />);
      expect(screen.getByText(/3 of 4/i)).toBeInTheDocument();
    });
  });
});
