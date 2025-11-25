import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WhatKidsLearnSection } from '@/components/about/what-kids-learn-section';

describe('WhatKidsLearnSection', () => {
  it('renders section title', () => {
    render(<WhatKidsLearnSection items={[]} />);
    expect(screen.getByRole('heading', { level: 2, name: /What Kids Learn/i })).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<WhatKidsLearnSection items={[]} title="Learning Outcomes" />);
    expect(screen.getByRole('heading', { level: 2, name: /Learning Outcomes/i })).toBeInTheDocument();
  });

  it('renders list items when provided', () => {
    const items = ['Teamwork', 'Communication', 'Sportsmanship'];
    render(<WhatKidsLearnSection items={items} />);
    expect(screen.getByText('Teamwork')).toBeInTheDocument();
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Sportsmanship')).toBeInTheDocument();
  });

  it('renders empty message when items array is empty', () => {
    render(<WhatKidsLearnSection items={[]} />);
    expect(screen.getByText(/Information coming soon./i)).toBeInTheDocument();
  });

  it('renders custom empty message when provided', () => {
    render(<WhatKidsLearnSection items={[]} emptyMessage="No items yet." />);
    expect(screen.getByText(/No items yet./i)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<WhatKidsLearnSection items={[]} className="custom-class" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('renders list items in a list structure', () => {
    const items = ['Item 1', 'Item 2'];
    render(<WhatKidsLearnSection items={items} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});
