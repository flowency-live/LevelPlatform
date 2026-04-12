import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';

const mockPush = jest.fn();
const mockSignIn = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignIn.mockResolvedValue({ ok: false });
  });

  describe('rendering', () => {
    it('renders login card', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('login-card')).toBeInTheDocument();
    });

    it('shows app title', () => {
      render(<LoginPage />);
      expect(screen.getByText('Elevate')).toBeInTheDocument();
    });

    it('has email input', () => {
      render(<LoginPage />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('has password input', () => {
      render(<LoginPage />);
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('has remember me checkbox', () => {
      render(<LoginPage />);
      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    });

    it('has forgot password link', () => {
      render(<LoginPage />);
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });

    it('has sign in button', () => {
      render(<LoginPage />);
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('shows error when email is empty on submit', async () => {
      render(<LoginPage />);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('shows error when password is empty on submit', async () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('form submission', () => {
    it('shows loading state during submission', async () => {
      mockSignIn.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<LoginPage />);
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toHaveAttribute('aria-busy', 'true');
      });
    });

    it('redirects to teacher portal on successful login', async () => {
      mockSignIn.mockResolvedValue({ ok: true });

      render(<LoginPage />);
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          email: 'test@example.com',
          password: 'password123',
          redirect: false,
        });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/teacher');
      });
    });

    it('shows error on invalid credentials', async () => {
      mockSignIn.mockResolvedValue({ ok: false });

      render(<LoginPage />);
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      });
    });
  });
});
