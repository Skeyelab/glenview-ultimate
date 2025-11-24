import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TeamMemberCard } from '@/components/ui/team-member-card';
import type { TeamMember } from '@/lib/directus';

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
  getDirectusAssetUrl: vi.fn((id: string | null) => (id ? `/api/assets/${id}` : null)),
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

describe('TeamMemberCard', () => {
  const mockTeamMember: TeamMember = {
    id: 1,
    name: 'John Doe',
    role: 'Head Coach',
    email: 'john@example.com',
    bio: 'Test bio',
    photo: 'photo-id',
    squad: null,
  };

  const mockTeamMemberWithoutPhoto: TeamMember = {
    id: 2,
    name: 'Jane Smith',
    role: 'captain',
    email: 'jane@example.com',
    bio: null,
    photo: null,
    squad: 'boys',
  };

  const mockTeamMemberWithoutEmail: TeamMember = {
    id: 3,
    name: 'Bob Johnson',
    role: 'Assistant Coach',
    email: null,
    bio: 'Some bio',
    photo: 'photo-id-2',
    squad: null,
  };

  it('renders member name and role', () => {
    render(<TeamMemberCard member={mockTeamMember} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Head Coach')).toBeInTheDocument();
  });

  it('renders email link when email is provided and showEmail is true', () => {
    render(<TeamMemberCard member={mockTeamMember} />);
    const emailLink = screen.getByRole('link', { name: 'john@example.com' });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com');
  });

  it('does not render email when showEmail is false', () => {
    render(<TeamMemberCard member={mockTeamMember} showEmail={false} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not render email when email is null', () => {
    render(<TeamMemberCard member={mockTeamMemberWithoutEmail} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders bio when bio is provided and showBio is true', () => {
    render(<TeamMemberCard member={mockTeamMember} />);
    expect(screen.getByText('Test bio')).toBeInTheDocument();
  });

  it('does not render bio when showBio is false', () => {
    render(<TeamMemberCard member={mockTeamMember} showBio={false} />);
    expect(screen.queryByText('Test bio')).not.toBeInTheDocument();
  });

  it('renders photo when photo is provided', () => {
    render(<TeamMemberCard member={mockTeamMember} />);
    const image = screen.getByAltText('John Doe');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/api/assets/photo-id');
  });

  it('renders placeholder text when photo is not provided', () => {
    render(<TeamMemberCard member={mockTeamMemberWithoutPhoto} />);
    expect(screen.getByText('Photo coming soon')).toBeInTheDocument();
  });

  it('applies card class', () => {
    const { container } = render(<TeamMemberCard member={mockTeamMember} />);
    const card = container.querySelector('.card');
    expect(card).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<TeamMemberCard member={mockTeamMember} className="custom-class" />);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('custom-class');
  });

  it('spans full width when spanFullWidth is true', () => {
    const { container } = render(<TeamMemberCard member={mockTeamMember} spanFullWidth={true} />);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('md:col-span-2');
  });

  it('spans full width when member is head coach', () => {
    const { container } = render(<TeamMemberCard member={mockTeamMember} />);
    const card = container.querySelector('.card');
    expect(card).toHaveClass('md:col-span-2');
  });

  it('uses compact internal gap when internalGap is compact', () => {
    const { container } = render(<TeamMemberCard member={mockTeamMember} internalGap="compact" />);
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).toHaveClass('gap-2');
  });

  it('uses normal internal gap by default', () => {
    const { container } = render(<TeamMemberCard member={mockTeamMember} />);
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).toHaveClass('gap-4');
  });

  it('uses square image dimensions when squareImage is true', () => {
    const { container } = render(<TeamMemberCard member={mockTeamMember} squareImage={true} />);
    const imageContainer = container.querySelector('.flex-shrink-0');
    expect(imageContainer).toHaveClass('w-32', 'h-32');
    expect(imageContainer).not.toHaveClass('w-52', 'h-64');
  });

  it('keeps a horizontal layout when squareImage is true', () => {
    const { container } = render(<TeamMemberCard member={mockTeamMember} squareImage={true} />);
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).not.toHaveClass('flex-col');
  });

  it('uses rectangular image dimensions by default', () => {
    const { container } = render(<TeamMemberCard member={mockTeamMember} />);
    const imageContainer = container.querySelector('.flex-shrink-0');
    expect(imageContainer).toHaveClass('w-full', 'aspect-[4/3]', 'md:w-52', 'md:h-64');
    expect(imageContainer).not.toHaveClass('w-32', 'h-32');
  });

  it('stacks image above info on mobile for rectangular layout', () => {
    const { container } = render(<TeamMemberCard member={mockTeamMember} />);
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).toHaveClass('flex-col', 'md:flex-row');
  });

  it('passes through HTML attributes', () => {
    const { container } = render(
      <TeamMemberCard member={mockTeamMember} data-testid="test-card" data-directus="test" />
    );
    const card = container.querySelector('[data-testid="test-card"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-directus', 'test');
  });
});

