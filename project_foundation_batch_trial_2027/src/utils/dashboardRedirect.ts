import { UserAccount } from '../types';

export function getDashboardPathForUser(user: UserAccount): string {
  if (user.role === 'admin') return '/admin';

  if (user.courses?.includes('foundation')) return '/dashboard/foundation';
  if (user.courses?.includes('advance_2026')) return '/dashboard/advance-2026';
  if (user.courses?.includes('nata_2026')) return '/dashboard/nata-2026';
  if (user.courses?.includes('rank_booster')) return '/dashboard/rank-booster';
  if (user.courses?.includes('free_tests')) return '/free-tests';

  return '/dashboard/dheya';
}
