import { render, screen } from '@testing-library/react';
import ActivitiesPage from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/teacher/activities',
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

// Mock activities data
const mockActivitiesData = {
  activities: [
    {
      id: 'ACT-001',
      name: 'Career Research Project',
      description: 'Research potential career paths and present findings',
      gatsbyBenchmarkIds: ['GB1', 'GB2'],
      asdanUnitId: null,
      status: 'active',
      createdBy: 'Sarah Mitchell',
      createdAt: '2024-01-15',
      completionCount: 12,
      totalStudents: 24,
    },
    {
      id: 'ACT-002',
      name: 'Employer Visit Reflection',
      description: 'Write a reflection on the recent employer visit',
      gatsbyBenchmarkIds: ['GB5'],
      asdanUnitId: 'ASDAN-WR1',
      status: 'active',
      createdBy: 'Sarah Mitchell',
      createdAt: '2024-01-20',
      completionCount: 8,
      totalStudents: 24,
    },
    {
      id: 'ACT-003',
      name: 'Work Experience Preparation',
      description: 'Complete pre-placement tasks',
      gatsbyBenchmarkIds: ['GB6'],
      asdanUnitId: null,
      status: 'draft',
      createdBy: 'Sarah Mitchell',
      createdAt: '2024-02-01',
      completionCount: 0,
      totalStudents: 24,
    },
  ],
  summary: {
    total: 3,
    active: 2,
    draft: 1,
    archived: 0,
  },
};

jest.mock('@/lib/hooks/useActivities', () => ({
  useActivities: () => mockActivitiesData,
}));

describe('ActivitiesPage', () => {
  describe('header', () => {
    it('displays Activities heading', () => {
      render(<ActivitiesPage />);
      expect(screen.getByRole('heading', { name: /activities/i })).toBeInTheDocument();
    });

    it('shows create activity button', () => {
      render(<ActivitiesPage />);
      expect(screen.getByRole('link', { name: /create activity/i })).toHaveAttribute(
        'href',
        '/teacher/activities/create'
      );
    });
  });

  describe('activity list', () => {
    it('renders all activities', () => {
      render(<ActivitiesPage />);
      expect(screen.getByText('Career Research Project')).toBeInTheDocument();
      expect(screen.getByText('Employer Visit Reflection')).toBeInTheDocument();
      expect(screen.getByText('Work Experience Preparation')).toBeInTheDocument();
    });

    it('shows activity descriptions', () => {
      render(<ActivitiesPage />);
      expect(screen.getByText(/research potential career paths/i)).toBeInTheDocument();
    });

    it('displays Gatsby benchmark badges', () => {
      render(<ActivitiesPage />);
      // GB1 and GB2 for first activity
      expect(screen.getAllByText('GB1').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('GB2').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('GB5').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('GB6').length).toBeGreaterThanOrEqual(1);
    });

    it('shows ASDAN badge when linked', () => {
      render(<ActivitiesPage />);
      expect(screen.getByText('ASDAN')).toBeInTheDocument();
    });

    it('displays completion progress', () => {
      render(<ActivitiesPage />);
      expect(screen.getByText(/12.*24/)).toBeInTheDocument();
    });
  });

  describe('status badges', () => {
    it('shows active status for active activities', () => {
      render(<ActivitiesPage />);
      expect(screen.getAllByText(/active/i).length).toBeGreaterThanOrEqual(2);
    });

    it('shows draft status for draft activities', () => {
      render(<ActivitiesPage />);
      // "draft" appears in filter tab and badge
      expect(screen.getAllByText(/draft/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('filters', () => {
    it('shows filter tabs', () => {
      render(<ActivitiesPage />);
      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /draft/i })).toBeInTheDocument();
    });
  });

  describe('activity links', () => {
    it('activity names link to edit page', () => {
      render(<ActivitiesPage />);
      const activityLink = screen.getByRole('link', { name: /career research project/i });
      expect(activityLink).toHaveAttribute('href', '/teacher/activities/ACT-001');
    });
  });

  describe('summary', () => {
    it('shows total activity count', () => {
      render(<ActivitiesPage />);
      expect(screen.getByText(/3 activities/i)).toBeInTheDocument();
    });
  });
});
