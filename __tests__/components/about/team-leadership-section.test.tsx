import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TeamLeadershipSection } from '@/components/about/team-leadership-section';
import type { TeamMember } from '@/lib/directus';

// Mock role-utils
vi.mock('@/components/about/role-utils', () => ({
  normalizeRole: vi.fn((role: string, squad?: string | null) => {
    if (role === 'captain' && squad === 'boys') return 'boys_team_captain';
    if (role === 'captain' && squad === 'girls') return 'girls_team_captain';
    if (role === 'Head Coach' || role === 'head_coach') return 'head_coach';
    return role;
  }),
}));

// Mock TeamMemberCard
vi.mock('@/components/ui/team-member-card', () => ({
  TeamMemberCard: ({ member }: { member: TeamMember }) => (
    <div data-testid={`team-member-${member.id}`}>
      {member.name} - {member.role}
    </div>
  ),
}));

describe('TeamLeadershipSection', () => {
  const mockBoysCaptain: TeamMember = {
    id: 1,
    name: 'John Doe',
    role: 'captain',
    squad: 'boys',
    email: null,
    bio: null,
    photo: null,
  };

  const mockGirlsCaptain: TeamMember = {
    id: 2,
    name: 'Jane Smith',
    role: 'captain',
    squad: 'girls',
    email: null,
    bio: null,
    photo: null,
  };

  const mockHeadCoach: TeamMember = {
    id: 3,
    name: 'Coach Williams',
    role: 'Head Coach',
    squad: null,
    email: null,
    bio: null,
    photo: null,
  };

  const mockNonLeadership: TeamMember = {
    id: 4,
    name: 'Regular Player',
    role: 'player',
    squad: null,
    email: null,
    bio: null,
    photo: null,
  };

  it('renders the section title', () => {
    render(<TeamLeadershipSection members={[]} />);
    expect(screen.getByRole('heading', { level: 2, name: /Team Leadership/i })).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<TeamLeadershipSection members={[]} title="Our Leaders" />);
    expect(screen.getByRole('heading', { level: 2, name: /Our Leaders/i })).toBeInTheDocument();
  });

  it('renders empty message when no leadership members', () => {
    render(<TeamLeadershipSection members={[]} />);
    expect(screen.getByText(/Team leadership information coming soon./i)).toBeInTheDocument();
  });

  it('renders custom empty message when provided', () => {
    render(<TeamLeadershipSection members={[]} emptyMessage="No leaders yet." />);
    expect(screen.getByText(/No leaders yet./i)).toBeInTheDocument();
  });

  it('filters out non-leadership members', () => {
    render(<TeamLeadershipSection members={[mockNonLeadership]} />);
    expect(screen.queryByText('Regular Player')).not.toBeInTheDocument();
    expect(screen.getByText(/Team leadership information coming soon./i)).toBeInTheDocument();
  });

  it('renders captains side by side', () => {
    render(<TeamLeadershipSection members={[mockBoysCaptain, mockGirlsCaptain]} />);
    expect(screen.getByTestId('team-member-1')).toBeInTheDocument();
    expect(screen.getByTestId('team-member-2')).toBeInTheDocument();
  });

  it('renders coach above captains', () => {
    const { container } = render(<TeamLeadershipSection members={[mockBoysCaptain, mockHeadCoach]} />);
    expect(screen.getByTestId('team-member-1')).toBeInTheDocument();
    expect(screen.getByTestId('team-member-3')).toBeInTheDocument();
    // Verify coach appears before captain in DOM order
    const members = container.querySelectorAll('[data-testid^="team-member-"]');
    expect(members[0]).toHaveAttribute('data-testid', 'team-member-3'); // Coach first
    expect(members[1]).toHaveAttribute('data-testid', 'team-member-1'); // Captain second
  });

  it('orders captains by captainOrder prop', () => {
    const { container } = render(
      <TeamLeadershipSection
        members={[mockGirlsCaptain, mockBoysCaptain]}
        captainOrder={['boys_team_captain', 'girls_team_captain']}
      />,
    );
    const members = container.querySelectorAll('[data-testid^="team-member-"]');
    expect(members[0]).toHaveAttribute('data-testid', 'team-member-1'); // Boys captain first
    expect(members[1]).toHaveAttribute('data-testid', 'team-member-2'); // Girls captain second
  });

  it('orders captains with custom captainOrder', () => {
    const { container } = render(
      <TeamLeadershipSection
        members={[mockBoysCaptain, mockGirlsCaptain]}
        captainOrder={['girls_team_captain', 'boys_team_captain']}
      />,
    );
    const members = container.querySelectorAll('[data-testid^="team-member-"]');
    expect(members[0]).toHaveAttribute('data-testid', 'team-member-2'); // Girls captain first
    expect(members[1]).toHaveAttribute('data-testid', 'team-member-1'); // Boys captain second
  });

  it('renders only coach when no captains', () => {
    render(<TeamLeadershipSection members={[mockHeadCoach]} />);
    expect(screen.getByTestId('team-member-3')).toBeInTheDocument();
    expect(screen.queryByTestId('team-member-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('team-member-2')).not.toBeInTheDocument();
  });

  it('renders only captains when no coach', () => {
    render(<TeamLeadershipSection members={[mockBoysCaptain, mockGirlsCaptain]} />);
    expect(screen.getByTestId('team-member-1')).toBeInTheDocument();
    expect(screen.getByTestId('team-member-2')).toBeInTheDocument();
    expect(screen.queryByTestId('team-member-3')).not.toBeInTheDocument();
  });

  it('uses custom renderMemberCard when provided', () => {
    const customRender = (member: TeamMember) => (
      <div key={member.id} data-testid={`custom-${member.id}`}>
        Custom: {member.name}
      </div>
    );
    render(<TeamLeadershipSection members={[mockBoysCaptain]} renderMemberCard={customRender} />);
    expect(screen.getByTestId('custom-1')).toBeInTheDocument();
    expect(screen.getByText(/Custom: John Doe/i)).toBeInTheDocument();
    expect(screen.queryByTestId('team-member-1')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<TeamLeadershipSection members={[]} className="custom-class" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('handles members with normalized role values', () => {
    const memberWithNormalizedRole: TeamMember = {
      id: 5,
      name: 'Normalized Captain',
      role: 'boys_team_captain',
      squad: null,
      email: null,
      bio: null,
      photo: null,
    };
    render(<TeamLeadershipSection members={[memberWithNormalizedRole]} />);
    expect(screen.getByTestId('team-member-5')).toBeInTheDocument();
  });

  it('handles multiple captains and coach together', () => {
    const { container } = render(<TeamLeadershipSection members={[mockBoysCaptain, mockGirlsCaptain, mockHeadCoach]} />);
    expect(screen.getByTestId('team-member-1')).toBeInTheDocument();
    expect(screen.getByTestId('team-member-2')).toBeInTheDocument();
    expect(screen.getByTestId('team-member-3')).toBeInTheDocument();
    // Verify coach appears before captains in DOM order
    const members = container.querySelectorAll('[data-testid^="team-member-"]');
    expect(members[0]).toHaveAttribute('data-testid', 'team-member-3'); // Coach first
    expect(members[1]).toHaveAttribute('data-testid', 'team-member-1'); // Boys captain second
    expect(members[2]).toHaveAttribute('data-testid', 'team-member-2'); // Girls captain third
  });
});
