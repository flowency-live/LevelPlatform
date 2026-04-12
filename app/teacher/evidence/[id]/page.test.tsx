import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EvidenceReviewPage from './page';

// Mock next/navigation
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => '/teacher/evidence/EVD-001',
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  useParams: () => ({
    id: 'EVD-001',
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
        staffId: 'STAFF-001',
      },
    },
    status: 'authenticated',
  }),
}));

// Mock evidence detail data
const mockEvidenceDetail = {
  id: 'EVD-001',
  studentId: 'STU-001',
  studentName: 'Eagle JS',
  activityId: 'GB1-ACT-001',
  activityName: 'Career Research Project',
  activityDescription: 'Research and present information about a career of interest.',
  evidenceType: 'photo' as const,
  evidenceUrl: '/uploads/evidence/EVD-001.jpg',
  submittedAt: '2026-04-10T14:30:00Z',
  status: 'pending' as const,
  gatsbyBenchmarks: [
    { id: 'GB1', name: 'Careers Programme' },
    { id: 'GB4', name: 'Curriculum Links' },
  ],
  asdanUnit: {
    id: 'ASDAN-CA1',
    name: 'Career Awareness 1',
  },
  studentNotes: 'I researched software engineering careers and found it very interesting.',
};

jest.mock('@/lib/hooks/useEvidenceDetail', () => ({
  useEvidenceDetail: () => mockEvidenceDetail,
}));

// Mock fetch for submission
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

describe('EvidenceReviewPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('header', () => {
    it('displays Review Evidence heading', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByRole('heading', { name: /review evidence/i })).toBeInTheDocument();
    });

    it('shows back button', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });
  });

  describe('evidence details', () => {
    it('shows student name', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getAllByText(/eagle js/i).length).toBeGreaterThanOrEqual(1);
    });

    it('shows activity name', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByText(/career research project/i)).toBeInTheDocument();
    });

    it('shows activity description', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByText(/research and present information/i)).toBeInTheDocument();
    });

    it('shows evidence type', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getAllByText(/photo/i).length).toBeGreaterThanOrEqual(1);
    });

    it('shows submission date', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByText(/10 apr 2026/i)).toBeInTheDocument();
    });

    it('shows current status', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getAllByText(/pending/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('gatsby benchmarks', () => {
    it('shows linked Gatsby benchmarks', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByText('GB1')).toBeInTheDocument();
      expect(screen.getByText('GB4')).toBeInTheDocument();
    });

    it('shows benchmark names', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByText(/careers programme/i)).toBeInTheDocument();
      expect(screen.getByText(/curriculum links/i)).toBeInTheDocument();
    });
  });

  describe('asdan unit', () => {
    it('shows ASDAN unit if linked', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByText(/career awareness 1/i)).toBeInTheDocument();
    });
  });

  describe('student notes', () => {
    it('shows student submitted notes', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByText(/researched software engineering/i)).toBeInTheDocument();
    });
  });

  describe('evidence preview', () => {
    it('shows evidence preview section', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByText(/evidence submitted/i)).toBeInTheDocument();
    });
  });

  describe('feedback input', () => {
    it('has feedback textarea', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByLabelText(/feedback/i)).toBeInTheDocument();
    });

    it('allows entering feedback', () => {
      render(<EvidenceReviewPage />);
      const textarea = screen.getByLabelText(/feedback/i);
      fireEvent.change(textarea, { target: { value: 'Great work!' } });
      expect(textarea).toHaveValue('Great work!');
    });
  });

  describe('action buttons', () => {
    it('has approve button', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByRole('button', { name: /approve/i })).toBeInTheDocument();
    });

    it('has reject button', () => {
      render(<EvidenceReviewPage />);
      expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
    });

    it('approve button has green styling', () => {
      render(<EvidenceReviewPage />);
      const approveBtn = screen.getByRole('button', { name: /approve/i });
      expect(approveBtn).toHaveClass('bg-green-600');
    });

    it('reject button has red styling', () => {
      render(<EvidenceReviewPage />);
      const rejectBtn = screen.getByRole('button', { name: /reject/i });
      expect(rejectBtn).toHaveClass('bg-red-600');
    });
  });

  describe('approval flow', () => {
    it('calls API when approve clicked', async () => {
      render(<EvidenceReviewPage />);
      const approveBtn = screen.getByRole('button', { name: /approve/i });
      fireEvent.click(approveBtn);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/teacher/evidence/EVD-001',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('approved'),
          })
        );
      });
    });

    it('navigates back after approval', async () => {
      render(<EvidenceReviewPage />);
      const approveBtn = screen.getByRole('button', { name: /approve/i });
      fireEvent.click(approveBtn);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/teacher/evidence');
      });
    });
  });

  describe('rejection flow', () => {
    it('calls API when reject clicked', async () => {
      render(<EvidenceReviewPage />);
      const rejectBtn = screen.getByRole('button', { name: /reject/i });
      fireEvent.click(rejectBtn);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/teacher/evidence/EVD-001',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('rejected'),
          })
        );
      });
    });

    it('includes feedback in rejection', async () => {
      render(<EvidenceReviewPage />);
      const textarea = screen.getByLabelText(/feedback/i);
      fireEvent.change(textarea, { target: { value: 'Please provide more detail.' } });

      const rejectBtn = screen.getByRole('button', { name: /reject/i });
      fireEvent.click(rejectBtn);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/teacher/evidence/EVD-001',
          expect.objectContaining({
            body: expect.stringContaining('Please provide more detail'),
          })
        );
      });
    });
  });
});
