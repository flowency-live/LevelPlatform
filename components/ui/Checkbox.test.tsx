import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  describe('rendering', () => {
    it('renders unchecked by default', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders as checkbox input', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('toggles checked state when clicked', () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Accept terms" onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalled();
    });

    it('can be controlled', () => {
      render(<Checkbox label="Accept terms" checked onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('label is clickable', () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Accept terms" onChange={handleChange} />);
      fireEvent.click(screen.getByText('Accept terms'));
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('applies disabled state', () => {
      render(<Checkbox label="Accept terms" disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });

  describe('touch target', () => {
    it('has wrapper with minimum 44px touch target', () => {
      render(<Checkbox label="Accept terms" />);
      const wrapper = screen.getByRole('checkbox').closest('label');
      expect(wrapper).toHaveClass('min-h-[44px]');
    });
  });

  describe('visual styling', () => {
    it('checkbox visual is 24x24px', () => {
      render(<Checkbox label="Accept terms" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('h-6');
      expect(checkbox).toHaveClass('w-6');
    });
  });

  describe('accessibility', () => {
    it('is keyboard accessible', () => {
      render(<Checkbox label="Accept terms" />);
      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      expect(checkbox).toHaveFocus();
    });

    it('accepts id for custom association', () => {
      render(<Checkbox label="Accept terms" id="custom-id" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'custom-id');
    });
  });
});
