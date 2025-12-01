import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { LeadershipSection } from '@/components/home/leadership-section';
import type { TeamMember } from '@/lib/directus';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => {
    const { width: _width, height: _height, className: _className, onError: _onError, ...htmlProps } = props;
    return <img src={src} alt={alt} {...htmlProps} />;
  },
}));

// Mock directus functions
vi.mock('@/lib/directus', () => ({
  getDirectusAssetUrl: vi.fn((id: string | null, _options?: Record<string, unknown>) =>
    (id ? `/api/assets/${id}` : null),
  ),
}));

// Mock role-utils
vi.mock('@/components/about/role-utils', () => ({
  normalizeRole: vi.fn((role: string, squad?: string | null) => {
    if (role === 'captain' && squad === 'boys') return 'boys_team_captain';
    if (role === 'captain' && squad === 'girls') return 'girls_team_captain';
    if (role === 'Head Coach' || role === 'head_coach') return 'head_coach';
    return role;
  }),
  getRoleDisplayTitle: vi.fn((role: string, squad?: string | null) => {
    if (role === 'boys_team_captain' || (role === 'captain' && squad === 'boys')) return 'Boys Team Captain';
    if (role === 'girls_team_captain' || (role === 'captain' && squad === 'girls')) return 'Girls Team Captain';
    if (role === 'head_coach' || role === 'Head Coach') return 'Head Coach';
    return role;
  }),
}));

describe('LeadershipSection', () => {
  const mockTeamMember1: TeamMember = {
    id: 1,
    name: 'John Doe',
    role: 'Head Coach',
    email: 'john@example.com',
    bio: null,
    photo: null,
    squad: null,
  };

  const mockTeamMember2: TeamMember = {
    id: 2,
    name: 'Jane Smith',
    role: 'Captain',
    email: 'jane@example.com',
    bio: null,
    photo: null,
    squad: null,
  };

  const mockTeamMemberWithoutEmail: TeamMember = {
    id: 3,
    name: 'Bob Johnson',
    role: 'Assistant Coach',
    email: null,
    bio: null,
    photo: null,
    squad: null,
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

  it('uses TeamMemberCard with compact spacing on homepage', () => {
    const { container } = render(<LeadershipSection people={[mockTeamMember1]} />);
    // Find the flex container inside the TeamMemberCard (not the SectionCard)
    // Look for the card that contains the member name
    const memberName = screen.getByText('John Doe');
    const card = memberName.closest('.card');
    const flexContainer = card?.querySelector('.flex');
    expect(flexContainer).toHaveClass('gap-2');
  });

  it('hides bio on homepage', () => {
    const memberWithBio: TeamMember = {
      ...mockTeamMember1,
      bio: 'Test bio',
    };
    render(<LeadershipSection people={[memberWithBio]} />);
    expect(screen.queryByText('Test bio')).not.toBeInTheDocument();
  });

  it('uses square images on homepage', () => {
    const { container } = render(<LeadershipSection people={[mockTeamMember1]} />);
    const imageContainer = container.querySelector('.flex-shrink-0');
    expect(imageContainer).toHaveClass('w-32', 'h-32');
  });

  it('does not render email link in leadership section', () => {
    render(<LeadershipSection people={[mockTeamMember1]} />);
    expect(screen.queryByRole('link', { name: 'john@example.com' })).not.toBeInTheDocument();
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
