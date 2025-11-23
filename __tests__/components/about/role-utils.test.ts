import {
  normalizeRole,
  getRoleDisplayTitle,
  isLeadershipRole,
  LEADERSHIP_ROLES,
  type LeadershipRole,
} from '@/components/about/role-utils';

describe('role-utils', () => {
  describe('normalizeRole', () => {
    it('should normalize "captain" with squad="boys" to "boys_team_captain"', () => {
      expect(normalizeRole('captain', 'boys')).toBe('boys_team_captain');
    });

    it('should normalize "Captain" with squad="boys" to "boys_team_captain"', () => {
      expect(normalizeRole('Captain', 'boys')).toBe('boys_team_captain');
    });

    it('should normalize "captain" with squad="girls" to "girls_team_captain"', () => {
      expect(normalizeRole('captain', 'girls')).toBe('girls_team_captain');
    });

    it('should normalize "captain" without squad to "captain"', () => {
      expect(normalizeRole('captain')).toBe('captain');
      expect(normalizeRole('captain', null)).toBe('captain');
    });

    it('should normalize "boys_team_captain" to "boys_team_captain"', () => {
      expect(normalizeRole('boys_team_captain')).toBe('boys_team_captain');
    });

    it('should normalize "Boys Team Captain" to "boys_team_captain"', () => {
      expect(normalizeRole('Boys Team Captain')).toBe('boys_team_captain');
    });

    it('should normalize "girls_team_captain" to "girls_team_captain"', () => {
      expect(normalizeRole('girls_team_captain')).toBe('girls_team_captain');
    });

    it('should normalize "Girls Team Captain" to "girls_team_captain"', () => {
      expect(normalizeRole('Girls Team Captain')).toBe('girls_team_captain');
    });

    it('should normalize "head_coach" to "head_coach"', () => {
      expect(normalizeRole('head_coach')).toBe('head_coach');
    });

    it('should normalize "Head Coach" to "head_coach"', () => {
      expect(normalizeRole('Head Coach')).toBe('head_coach');
    });

    it('should return original role if not recognized', () => {
      expect(normalizeRole('player')).toBe('player');
      expect(normalizeRole('unknown_role')).toBe('unknown_role');
    });

    it('should prioritize squad parameter over role value for captains', () => {
      // Even if role is already a specific captain role, squad should be used
      expect(normalizeRole('captain', 'boys')).toBe('boys_team_captain');
      expect(normalizeRole('captain', 'girls')).toBe('girls_team_captain');
    });
  });

  describe('getRoleDisplayTitle', () => {
    it('should return "Boys Team Captain" for boys_team_captain', () => {
      expect(getRoleDisplayTitle('boys_team_captain')).toBe('Boys Team Captain');
    });

    it('should return "Boys Team Captain" for "captain" with squad="boys"', () => {
      expect(getRoleDisplayTitle('captain', 'boys')).toBe('Boys Team Captain');
    });

    it('should return "Girls Team Captain" for girls_team_captain', () => {
      expect(getRoleDisplayTitle('girls_team_captain')).toBe('Girls Team Captain');
    });

    it('should return "Girls Team Captain" for "captain" with squad="girls"', () => {
      expect(getRoleDisplayTitle('captain', 'girls')).toBe('Girls Team Captain');
    });

    it('should return "Head Coach" for head_coach', () => {
      expect(getRoleDisplayTitle('head_coach')).toBe('Head Coach');
    });

    it('should return "Head Coach" for "Head Coach"', () => {
      expect(getRoleDisplayTitle('Head Coach')).toBe('Head Coach');
    });

    it('should return original role if not recognized', () => {
      expect(getRoleDisplayTitle('player')).toBe('player');
      expect(getRoleDisplayTitle('unknown_role')).toBe('unknown_role');
    });

    it('should handle captain role without squad', () => {
      expect(getRoleDisplayTitle('captain')).toBe('captain');
      expect(getRoleDisplayTitle('captain', null)).toBe('captain');
    });
  });

  describe('isLeadershipRole', () => {
    it('should return true for "boys_team_captain"', () => {
      expect(isLeadershipRole('boys_team_captain')).toBe(true);
    });

    it('should return true for "captain" with squad="boys"', () => {
      expect(isLeadershipRole('captain', 'boys')).toBe(true);
    });

    it('should return true for "girls_team_captain"', () => {
      expect(isLeadershipRole('girls_team_captain')).toBe(true);
    });

    it('should return true for "captain" with squad="girls"', () => {
      expect(isLeadershipRole('captain', 'girls')).toBe(true);
    });

    it('should return true for "head_coach"', () => {
      expect(isLeadershipRole('head_coach')).toBe(true);
    });

    it('should return true for "Head Coach"', () => {
      expect(isLeadershipRole('Head Coach')).toBe(true);
    });

    it('should return false for non-leadership roles', () => {
      expect(isLeadershipRole('player')).toBe(false);
      expect(isLeadershipRole('assistant_coach')).toBe(false);
      expect(isLeadershipRole('unknown_role')).toBe(false);
    });

    it('should return false for "captain" without squad', () => {
      expect(isLeadershipRole('captain')).toBe(false);
      expect(isLeadershipRole('captain', null)).toBe(false);
    });

    it('should have correct type guard behavior', () => {
      const role1 = 'boys_team_captain';
      if (isLeadershipRole(role1)) {
        const typed: LeadershipRole = role1; // TypeScript should accept this
        expect(LEADERSHIP_ROLES).toContain(typed);
      }

      const role2 = 'captain';
      if (isLeadershipRole(role2, 'boys')) {
        const typed: LeadershipRole = normalizeRole(role2, 'boys') as LeadershipRole;
        expect(LEADERSHIP_ROLES).toContain(typed);
      }
    });
  });

  describe('LEADERSHIP_ROLES constant', () => {
    it('should contain expected leadership roles', () => {
      expect(LEADERSHIP_ROLES).toEqual(['boys_team_captain', 'girls_team_captain', 'head_coach']);
    });

    it('should have correct length', () => {
      expect(LEADERSHIP_ROLES).toHaveLength(3);
    });
  });
});

