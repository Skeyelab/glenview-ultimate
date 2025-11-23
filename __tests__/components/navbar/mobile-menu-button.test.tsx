import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MobileMenuButton } from '@/components/navbar/mobile-menu-button';

describe('MobileMenuButton', () => {
  it('should render button', () => {
    render(<MobileMenuButton isOpen={false} onClick={vi.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should have correct aria attributes when closed', () => {
    render(<MobileMenuButton isOpen={false} onClick={vi.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'mobile-nav');
  });

  it('should have correct aria attributes when open', () => {
    render(<MobileMenuButton isOpen={true} onClick={vi.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<MobileMenuButton isOpen={false} onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have screen reader text', () => {
    render(<MobileMenuButton isOpen={false} onClick={vi.fn()} />);
    expect(screen.getByText('Toggle navigation')).toBeInTheDocument();
  });

  it('should have correct classes', () => {
    render(<MobileMenuButton isOpen={false} onClick={vi.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('md:hidden');
  });
});
