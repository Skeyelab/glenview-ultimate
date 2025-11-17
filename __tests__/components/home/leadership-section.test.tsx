import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LeadershipSection } from '@/components/home/leadership-section';
import type { TeamMember } from '@/lib/directus';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe('LeadershipSection', () => {
  const mockTeamMember1: TeamMember = {
    id: 1,
    name: 'John Doe',
    role: 'Head Coach',
    email: 'john@example.com',
    bio: null,
    photo: null,
  };

  const mockTeamMember2: TeamMember = {
    id: 2,
    name: 'Jane Smith',
    role: 'Captain',
    email: 'jane@example.com',
    bio: null,
    photo: null,
  };

  const mockTeamMemberWithoutEmail: TeamMember = {
    id: 3,
    name: 'Bob Johnson',
    role: 'Assistant Coach',
    email: null,
    bio: null,
    photo: null,
  };

  it('renders the section title', () => {
    render(<LeadershipSection people={[]} />);
    expect(screen.getByRole('heading', { level: 2, name: /Leadership/i })).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<LeadershipSection people={[]} title="Team Leadership" />);
    expect(screen.getByRole('heading', { level: 2, name: /Team Leadership/i })).toBeInTheDocument();
  });

  it('renders empty message when no people provided', () => {
    render(<LeadershipSection people={[]} />);
    expect(screen.getByText(/Captains & coach bios coming soon./i)).toBeInTheDocument();
  });

  it('renders custom empty message when provided', () => {
    render(<LeadershipSection people={[]} emptyMessage="No team members yet." />);
    expect(screen.getByText(/No team members yet./i)).toBeInTheDocument();
  });

  it('renders team members when provided', () => {
    render(<LeadershipSection people={[mockTeamMember1]} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Head Coach')).toBeInTheDocument();
  });

  it('renders email link when email is provided', () => {
    render(<LeadershipSection people={[mockTeamMember1]} />);
    const emailLink = screen.getByRole('link', { name: 'john@example.com' });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com');
  });

  it('does not render email link when email is not provided', () => {
    render(<LeadershipSection people={[mockTeamMemberWithoutEmail]} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders multiple team members', () => {
    render(<LeadershipSection people={[mockTeamMember1, mockTeamMember2]} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Head Coach')).toBeInTheDocument();
    expect(screen.getByText('Captain')).toBeInTheDocument();
  });

  it('uses custom renderMember when provided', () => {
    const customRender = (member: TeamMember) => (
      <div key={member.id} data-testid={`custom-${member.id}`}>
        Custom: {member.name}
      </div>
    );
    render(<LeadershipSection people={[mockTeamMember1]} renderMember={customRender} />);
    expect(screen.getByTestId('custom-1')).toBeInTheDocument();
    expect(screen.getByText(/Custom: John Doe/i)).toBeInTheDocument();
    expect(screen.queryByText('Head Coach')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<LeadershipSection people={[]} className="custom-class" />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
