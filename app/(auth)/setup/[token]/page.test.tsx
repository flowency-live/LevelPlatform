import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SetupPage from './page';

const mockPush = jest.fn();
const mockSignIn = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({
    token: 'valid-invite-token',
  }),
}));

jest.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

global.fetch = jest.fn();

describe('SetupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ email: 'sarah@school.uk' }),
    });
  });

  describe('rendering', () => {
    it('renders setup card', async () => {
      render(<SetupPage />);
      await waitFor(() => {
        expect(screen.getByTestId('setup-card')).toBeInTheDocument();
      });
    });

    it('shows setup title', async () => {
      render(<SetupPage />);
      await waitFor(() => {
        expect(screen.getByText(/set up your account/i)).toBeInTheDocument();
      });
    });

    it('shows email from invite (readonly)', async () => {
      render(<SetupPage />);
      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toHaveValue('sarah@school.uk');
        expect(emailInput).toHaveAttribute('readonly');
      });
    });

    it('has password input', async () => {
      render(<SetupPage />);
      await waitFor(() => {
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
      });
    });

    it('has confirm password input', async () => {
      render(<SetupPage />);
      await waitFor(() => {
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      });
    });

    it('has create account button', async () => {
      render(<SetupPage />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      });
    });

    it('has password visibility toggle', async () => {
      render(<SetupPage />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
      });
    });
  });

  describe('invalid token handling', () => {
    it('shows error for invalid token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Invalid invite token' }),
      });

      render(<SetupPage />);

      await waitFor(() => {
        expect(screen.getByText(/invalid invite link/i)).toBeInTheDocument();
      });
    });

    it('shows error for expired token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 410,
        json: async () => ({ error: 'Invite token has expired' }),
      });

      render(<SetupPage />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /invite link has expired/i })).toBeInTheDocument();
      });
    });
  });

  describe('form validation', () => {
    it('shows error when password is empty on submit', async () => {
      render(<SetupPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('shows error when passwords do not match', async () => {
      render(<SetupPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmInput, { target: { value: 'Different123!' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('shows error when password is too short', async () => {
      render(<SetupPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.change(confirmInput, { target: { value: 'short' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Check for error message (has id="password-error")
        const errorElement = document.getElementById('password-error');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent(/password must be at least 8 characters/i);
      });
    });
  });

  describe('password visibility toggle', () => {
    it('toggles password visibility when clicked', async () => {
      render(<SetupPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');

      const toggleButton = screen.getByRole('button', { name: /show password/i });
      fireEvent.click(toggleButton);

      expect(passwordInput).toHaveAttribute('type', 'text');
    });
  });

  describe('form submission', () => {
    it('shows loading state during submission', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ email: 'sarah@school.uk' }),
        })
        .mockImplementationOnce(() => new Promise(() => {})); // Never resolves

      render(<SetupPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.change(confirmInput, { target: { value: 'ValidPassword123!' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toHaveAttribute('aria-busy', 'true');
      });
    });

    it('calls signIn and redirects on success', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ email: 'sarah@school.uk' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      mockSignIn.mockResolvedValue({ ok: true });

      render(<SetupPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123!' } });
      fireEvent.change(confirmInput, { target: { value: 'ValidPassword123!' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          email: 'sarah@school.uk',
          password: 'ValidPassword123!',
          redirect: false,
        });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/teacher');
      });
    });
  });
});
