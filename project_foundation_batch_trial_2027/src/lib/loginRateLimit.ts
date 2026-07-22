const WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX_ATTEMPTS = 5;

export interface LoginAttemptRecord {
  count: number;
  windowStart: number;
}

export function getLoginAttemptKey(email: string): string {
  return `login_attempts_${email.trim().toLowerCase()}`;
}

export function readLoginAttempts(email: string): LoginAttemptRecord {
  const now = Date.now();
  const raw = localStorage.getItem(getLoginAttemptKey(email));

  if (!raw) {
    return { count: 0, windowStart: now };
  }

  try {
    const record = JSON.parse(raw) as LoginAttemptRecord;
    if (now - record.windowStart >= WINDOW_MS) {
      return { count: 0, windowStart: now };
    }
    return record;
  } catch {
    return { count: 0, windowStart: now };
  }
}

export function isLoginRateLimited(email: string): boolean {
  const record = readLoginAttempts(email);
  return record.count >= MAX_ATTEMPTS;
}

export function recordLoginAttempt(email: string): void {
  const record = readLoginAttempts(email);
  const next: LoginAttemptRecord = {
    count: record.count + 1,
    windowStart: record.windowStart,
  };
  localStorage.setItem(getLoginAttemptKey(email), JSON.stringify(next));
}

export const LOGIN_RATE_LIMIT_MESSAGE =
  'Too many login attempts. Please try again after 2 hours.';

export function isRateLimitedCourse(courses: string[] | undefined): boolean {
  if (!courses || courses.length === 0) return false;
  return courses.includes('dheya') || courses.includes('free_tests');
}
