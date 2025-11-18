import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Textarea } from '@/components/ui/textarea';

describe('Textarea', () => {
  it('should render textarea with default classes', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveClass('flex', 'w-full', 'rounded-md');
  });

  it('should handle user input', async () => {
    const user = userEvent.setup();
    render(<Textarea />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    
    await user.type(textarea, 'test textarea input');
    expect(textarea.value).toBe('test textarea input');
  });

  it('should apply custom className', () => {
    render(<Textarea className="custom-textarea" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('custom-textarea');
  });

  it('should pass through HTML textarea attributes', () => {
    render(<Textarea rows={5} placeholder="Enter text" required />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveAttribute('placeholder', 'Enter text');
    expect(textarea).toBeRequired();
  });

  it('should support ref forwarding', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
