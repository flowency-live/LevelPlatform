import { render, screen } from '@testing-library/react';
import AuthLayout from './layout';

describe('AuthLayout', () => {
  it('renders children', () => {
    render(
      <AuthLayout>
        <div>Login content</div>
      </AuthLayout>
    );
    expect(screen.getByText('Login content')).toBeInTheDocument();
  });

  it('centers content vertically', () => {
    render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );
    const container = screen.getByTestId('auth-layout');
    expect(container).toHaveClass('min-h-screen');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
  });

  it('has page background', () => {
    render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );
    const container = screen.getByTestId('auth-layout');
    expect(container).toHaveClass('bg-surface-page');
  });
});
