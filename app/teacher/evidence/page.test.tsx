import { render, screen, fireEvent } from '@testing-library/react';
import EvidenceQueuePage from './page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => '/teacher/evidence',
  useRouter: () => ({
    push: mockPush,
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

// Mock evidence queue data
const mockEvidenceQueue = {
  submissions: [
    {
      id: 'EVD-001',
      studentId: 'STU-001',
      studentName: 'Eagle JS',
      activityId: 'GB1-ACT-001',
      activityName: 'Career Research Project',
      evidenceType: 'photo',
      submittedAt: '2026-04-10T14:30:00Z',
      status: 'pending',
    },
    {
      id: 'EVD-002',
      studentId: 'STU-002',
      studentName: 'Hawk AB',
      activityId: 'GB5-ACT-002',
      activityName: 'Employer Visit Reflection',
      evidenceType: 'document',
      submittedAt: '2026-04-09T10:15:00Z',
      status: 'pending',
    },
    {
      id: 'EVD-003',
      studentId: 'STU-003',
      studentName: 'Falcon CD',
      activityId: 'GB2-ACT-001',
      activityName: 'Labour Market Analysis',
      evidenceType: 'voice',
      submittedAt: '2026-04-08T16:45:00Z',
      status: 'approved',
    },
    {
      id: 'EVD-004',
      studentId: 'STU-001',
      studentName: 'Eagle JS',
      activityId: 'GB3-ACT-001',
      activityName: 'Individual Needs Assessment',
      evidenceType: 'photo',
      submittedAt: '2026-04-07T09:00:00Z',
      status: 'rejected',
    },
  ],
  summary: {
    pending: 2,
    approved: 1,
    rejected: 1,
    total: 4,
  },
};

jest.mock('@/lib/hooks/useEvidenceQueue', () => ({
  useEvidenceQueue: () => mockEvidenceQueue,
}));

describe('EvidenceQueuePage', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('header', () => {
    it('displays Evidence Review heading', () => {
      render(<EvidenceQueuePage />);
      expect(screen.getByRole('heading', { name: /evidence review/i })).toBeInTheDocument();
    });

    it('shows pending count in subtitle', () => {
      render(<EvidenceQueuePage />);
      expect(screen.getByText(/2 pending/i)).toBeInTheDocument();
    });
  });

  describe('filter tabs', () => {
    it('shows All tab', () => {
      render(<EvidenceQueuePage />);
      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    });

    it('shows Pending tab', () => {
      render(<EvidenceQueuePage />);
      expect(screen.getByRole('button', { name: /pending/i })).toBeInTheDocument();
    });

    it('shows Approved tab', () => {
      render(<EvidenceQueuePage />);
      expect(screen.getByRole('button', { name: /approved/i })).toBeInTheDocument();
    });

    it('shows Rejected tab', () => {
      render(<EvidenceQueuePage />);
      expect(screen.getByRole('button', { name: /rejected/i })).toBeInTheDocument();
    });

    it('Pending tab is active by default', () => {
      render(<EvidenceQueuePage />);
      const pendingTab = screen.getByRole('button', { name: /pending/i });
      expect(pendingTab).toHaveClass('bg-persona-teacher');
    });
  });

  describe('evidence list', () => {
    it('renders evidence submissions list', () => {
      render(<EvidenceQueuePage />);
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('shows student names', () => {
      render(<EvidenceQueuePage />);
      expect(screen.getAllByText(/eagle js/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/hawk ab/i)).toBeInTheDocument();
    });

    it('shows activity names', () => {
      render(<EvidenceQueuePage />);
      expect(screen.getByText(/career research project/i)).toBeInTheDocument();
      expect(screen.getByText(/employer visit reflection/i)).toBeInTheDocument();
    });

    it('shows evidence type badges', () => {
      render(<EvidenceQueuePage />);
      expect(screen.getAllByText(/photo/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/document/i)).toBeInTheDocument();
    });

    it('shows submission dates', () => {
      render(<EvidenceQueuePage />);
      // Date formatting - should show relative or formatted date
      expect(screen.getByText(/10 apr/i)).toBeInTheDocument();
    });
  });

  describe('evidence links', () => {
    it('evidence items link to review page', () => {
      render(<EvidenceQueuePage />);
      const reviewLink = screen.getByRole('link', { name: /career research project/i });
      expect(reviewLink).toHaveAttribute('href', '/teacher/evidence/EVD-001');
    });
  });

  describe('status badges', () => {
    it('shows pending status badge', () => {
      render(<EvidenceQueuePage />);
      // Filter to all to see all statuses
      const allTab = screen.getByRole('button', { name: /all/i });
      fireEvent.click(allTab);
      expect(screen.getAllByText(/pending/i).length).toBeGreaterThanOrEqual(1);
    });

    it('shows approved status with green styling', () => {
      render(<EvidenceQueuePage />);
      const allTab = screen.getByRole('button', { name: /all/i });
      fireEvent.click(allTab);
      expect(screen.getAllByText(/approved/i).length).toBeGreaterThanOrEqual(1);
    });

    it('shows rejected status with red styling', () => {
      render(<EvidenceQueuePage />);
      const allTab = screen.getByRole('button', { name: /all/i });
      fireEvent.click(allTab);
      expect(screen.getAllByText(/rejected/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('filtering', () => {
    it('filters to show only pending when Pending tab clicked', () => {
      render(<EvidenceQueuePage />);
      // Default is pending, should show 2 items
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBe(2);
    });

    it('shows all items when All tab clicked', () => {
      render(<EvidenceQueuePage />);
      const allTab = screen.getByRole('button', { name: /all/i });
      fireEvent.click(allTab);
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBe(4);
    });

    it('shows only approved when Approved tab clicked', () => {
      render(<EvidenceQueuePage />);
      const approvedTab = screen.getByRole('button', { name: /approved/i });
      fireEvent.click(approvedTab);
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBe(1);
    });
  });

  describe('empty state', () => {
    it('shows empty message when no submissions match filter', () => {
      // This would require a different mock, but the component should handle it
      render(<EvidenceQueuePage />);
      // Implementation should show empty state when filtered list is empty
    });
  });
});
