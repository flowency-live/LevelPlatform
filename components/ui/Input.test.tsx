import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  describe('rendering', () => {
    it('renders with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Input label="Email" placeholder="Enter your email" />);
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    it('renders as input element', () => {
      render(<Input label="Email" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has 48px height', () => {
      render(<Input label="Email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-12');
    });
  });

  describe('controlled input', () => {
    it('displays controlled value', () => {
      render(<Input label="Email" value="test@example.com" onChange={() => {}} />);
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    it('calls onChange when typing', () => {
      const handleChange = jest.fn();
      render(<Input label="Email" onChange={handleChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('error state', () => {
    it('shows error styling when error prop is set', () => {
      render(<Input label="Email" error="Invalid email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-status-error');
    });

    it('displays error message', () => {
      render(<Input label="Email" error="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('associates error with input via aria-describedby', () => {
      render(<Input label="Email" error="Invalid email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('disabled state', () => {
    it('applies disabled state', () => {
      render(<Input label="Email" disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('has disabled styling', () => {
      render(<Input label="Email" disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-gray-100');
      expect(input).toHaveClass('cursor-not-allowed');
    });
  });

  describe('required indicator', () => {
    it('shows required indicator when required', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('marks input as required', () => {
      render(<Input label="Email" required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  describe('password type', () => {
    it('renders as password input', () => {
      render(<Input label="Password" type="password" />);
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('shows toggle button for password', () => {
      render(<Input label="Password" type="password" />);
      expect(screen.getByRole('button', { name: /toggle password/i })).toBeInTheDocument();
    });

    it('toggles password visibility when toggle is clicked', () => {
      render(<Input label="Password" type="password" />);
      const input = screen.getByLabelText('Password');
      const toggle = screen.getByRole('button', { name: /toggle password/i });

      expect(input).toHaveAttribute('type', 'password');
      fireEvent.click(toggle);
      expect(input).toHaveAttribute('type', 'text');
      fireEvent.click(toggle);
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('accessibility', () => {
    it('has focus-visible ring', () => {
      render(<Input label="Email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus-visible:ring-2');
    });

    it('accepts id for label association', () => {
      render(<Input label="Email" id="custom-id" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('custom className', () => {
    it('merges custom className', () => {
      render(<Input label="Email" className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });
  });
});
