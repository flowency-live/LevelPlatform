import { render, screen, fireEvent } from '@testing-library/react';
import CreateActivityPage from './page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => '/teacher/activities/create',
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

describe('CreateActivityPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('form layout', () => {
    it('displays Create Activity heading', () => {
      render(<CreateActivityPage />);
      expect(screen.getByRole('heading', { name: /create activity/i })).toBeInTheDocument();
    });

    it('has activity name input', () => {
      render(<CreateActivityPage />);
      expect(screen.getByLabelText(/activity name/i)).toBeInTheDocument();
    });

    it('has description textarea', () => {
      render(<CreateActivityPage />);
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });

    it('has Gatsby benchmarks section', () => {
      render(<CreateActivityPage />);
      expect(screen.getAllByText(/gatsby benchmarks/i).length).toBeGreaterThanOrEqual(1);
    });

    it('shows all 8 benchmark checkboxes', () => {
      render(<CreateActivityPage />);
      expect(screen.getByLabelText(/GB1.*Careers Programme/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/GB2.*Labour Market/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/GB3.*Individual Needs/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/GB4.*Curriculum Links/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/GB5.*Employer Encounters/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/GB6.*Work Experience/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/GB7.*Education Pathways/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/GB8.*Personal Guidance/i)).toBeInTheDocument();
    });

    it('has ASDAN unit dropdown (optional)', () => {
      render(<CreateActivityPage />);
      expect(screen.getByLabelText(/asdan unit/i)).toBeInTheDocument();
    });

    it('has evidence requirements section', () => {
      render(<CreateActivityPage />);
      expect(screen.getByText(/evidence requirements/i)).toBeInTheDocument();
    });
  });

  describe('form interaction', () => {
    it('allows entering activity name', () => {
      render(<CreateActivityPage />);
      const nameInput = screen.getByLabelText(/activity name/i);
      fireEvent.change(nameInput, { target: { value: 'Career Research' } });
      expect(nameInput).toHaveValue('Career Research');
    });

    it('allows selecting benchmarks', () => {
      render(<CreateActivityPage />);
      const gb1Checkbox = screen.getByLabelText(/GB1.*Careers Programme/i);
      fireEvent.click(gb1Checkbox);
      expect(gb1Checkbox).toBeChecked();
    });

    it('allows selecting multiple benchmarks', () => {
      render(<CreateActivityPage />);
      const gb1Checkbox = screen.getByLabelText(/GB1.*Careers Programme/i);
      const gb2Checkbox = screen.getByLabelText(/GB2.*Labour Market/i);
      fireEvent.click(gb1Checkbox);
      fireEvent.click(gb2Checkbox);
      expect(gb1Checkbox).toBeChecked();
      expect(gb2Checkbox).toBeChecked();
    });
  });

  describe('form submission', () => {
    it('has submit button', () => {
      render(<CreateActivityPage />);
      expect(screen.getByRole('button', { name: /create activity/i })).toBeInTheDocument();
    });

    it('has cancel link back to activities', () => {
      render(<CreateActivityPage />);
      expect(screen.getByRole('link', { name: /cancel/i })).toHaveAttribute(
        'href',
        '/teacher/activities'
      );
    });

    it('shows save as draft option', () => {
      render(<CreateActivityPage />);
      expect(screen.getByRole('button', { name: /save.*draft/i })).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('requires at least one benchmark', () => {
      render(<CreateActivityPage />);
      expect(screen.getByText(/select at least one/i)).toBeInTheDocument();
    });
  });
});
