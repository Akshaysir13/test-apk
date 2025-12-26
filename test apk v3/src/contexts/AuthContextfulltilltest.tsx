// src/contexts/AuthContext.tsx - SECURE STAY-LOGIN WITH DEVICE VALIDATION

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { UserAccount } from '../types';

// Supabase setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file!');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Device ID utilities
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'web_' + Math.abs(hash).toString(36);
}

function generateDeviceId(): string {
  if (typeof window !== 'undefined' && (window as any).androidDeviceId) {
    return (window as any).androidDeviceId;
  }

  if (typeof window !== 'undefined' && (window as any).AndroidBridge) {
    try {
      const androidId = (window as any).AndroidBridge.getDeviceId();
      if (androidId) return androidId;
    } catch (e) {
      console.error('Failed to get Android device ID:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('fingerprint', 2, 2);
    }

    const fingerprint = canvas.toDataURL();
    const screen = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const nav = navigator.userAgent + navigator.language;

    return hashString(fingerprint + screen + nav);
  }

  return '';
}

function getStoredDeviceId(): string | null {
  return localStorage.getItem('device_id');
}

function setStoredDeviceId(deviceId: string): void {
  localStorage.setItem('device_id', deviceId);
}

// Generate secure random token
function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Auth constants
const ADMIN_EMAIL = 'admin@jee.com';
const ADMIN_PASSWORD = 'admin123';
const SESSION_DURATION_DAYS = 7; // Sessions expire after 7 days

// ==========================================
// 👥 STUDENT ACCOUNTS - ADD YOUR STUDENTS HERE
// ==========================================
const initialAccounts: UserAccount[] = [
  { 
    email: ADMIN_EMAIL, 
    password: ADMIN_PASSWORD, 
    role: 'admin', 
    approved: true,
    courses: ['foundation', 'rank_booster', 'dheya']
  },
  
  // ADD YOUR STUDENTS HERE
  { email: 'test@gmail.com', password: 'test123', role: 'student', approved: true, courses: ['foundation'] },
  
];

interface LoginResult {
  success: boolean;
  message: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  addStudent: (email: string, password: string, autoApprove?: boolean) => { success: boolean; message: string };
  deleteStudent: (email: string) => void;
  approveStudent: (email: string) => void;
  rejectStudent: (email: string) => void;
  getPendingStudents: () => UserAccount[];
  getApprovedStudents: () => UserAccount[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [accounts] = useState<UserAccount[]>(initialAccounts);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check if session is valid and device matches
  const validateSession = async (sessionToken: string): Promise<{ valid: boolean; user?: UserAccount }> => {
    try {
      const currentDeviceId = getStoredDeviceId() || generateDeviceId();
      
      // Get session from Supabase
      const { data: session, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .single();

      if (error || !session) {
        console.log('❌ Session not found in database');
        return { valid: false };
      }

      // Check if session expired
      if (new Date(session.expires_at) < new Date()) {
        console.log('❌ Session expired');
        await supabase.from('user_sessions').delete().eq('id', session.id);
        return { valid: false };
      }

      // CRITICAL: Check if device matches
      if (session.device_id !== currentDeviceId) {
        console.log('❌ Device mismatch! Session device:', session.device_id, 'Current device:', currentDeviceId);
        return { valid: false };
      }

      // Find user account
      const user = accounts.find(acc => acc.email.toLowerCase() === session.user_email.toLowerCase());
      
      if (!user) {
        console.log('❌ User not found in accounts');
        return { valid: false };
      }

      console.log('✅ Session valid, device matches');
      return { valid: true, user };
    } catch (error) {
      console.error('Session validation error:', error);
      return { valid: false };
    }
  };

  // Auto-login on page load
  useEffect(() => {
    const checkSession = async () => {
      const sessionToken = localStorage.getItem('session_token');
      
      if (!sessionToken) {
        setIsCheckingSession(false);
        return;
      }

      const { valid, user } = await validateSession(sessionToken);
      
      if (valid && user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        console.log('✅ Auto-login successful');
      } else {
        // Invalid session - clear everything
        localStorage.removeItem('session_token');
        console.log('❌ Auto-login failed - session invalid');
      }
      
      setIsCheckingSession(false);
    };

    checkSession();
  }, []);

  const validateDevice = async (userEmail: string): Promise<{ success: boolean; message?: string }> => {
    try {
      let deviceId = getStoredDeviceId();
      if (!deviceId) {
        deviceId = generateDeviceId();
        setStoredDeviceId(deviceId);
      }

      const { data: existingDevice, error } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_email', userEmail)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!existingDevice) {
        await supabase.from('user_devices').insert({
          user_email: userEmail,
          device_id: deviceId,
          device_type: deviceId.startsWith('web_') ? 'web' : 'android',
        });
        return { success: true };
      }

      if (existingDevice.device_id === deviceId) {
        await supabase
          .from('user_devices')
          .update({ last_active: new Date().toISOString() })
          .eq('user_email', userEmail);
        return { success: true };
      }

      return { success: false, message: 'Account already used on another device' };
    } catch {
      return { success: false, message: 'Device validation failed' };
    }
  };

  const createSession = async (userEmail: string, deviceId: string): Promise<string> => {
    // Delete old sessions for this user
    await supabase.from('user_sessions').delete().eq('user_email', userEmail);

    // Create new session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

    await supabase.from('user_sessions').insert({
      user_email: userEmail,
      device_id: deviceId,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    });

    return sessionToken;
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = accounts.find(
      acc => acc.email.toLowerCase() === normalizedEmail && acc.password === password
    );

    if (!user) return { success: false, message: 'Invalid email or password' };

    if (user.role === 'student' && !user.approved) {
      return { success: false, message: 'Account pending approval' };
    }

    if (user.role === 'student') {
      const deviceCheck = await validateDevice(user.email);
      if (!deviceCheck.success) {
        return { success: false, message: deviceCheck.message || 'Device validation failed' };
      }
    }

    // Create session in Supabase
    let deviceId = getStoredDeviceId();
    if (!deviceId) {
      deviceId = generateDeviceId();
      setStoredDeviceId(deviceId);
    }

    const sessionToken = await createSession(user.email, deviceId);
    localStorage.setItem('session_token', sessionToken);

    setIsAuthenticated(true);
    setCurrentUser(user);

    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      if (user.courses?.includes('foundation')) {
        navigate('/dashboard/foundation', { replace: true });
      } else if (user.courses?.includes('rank_booster')) {
        navigate('/dashboard/rank-booster', { replace: true });
      } else if (user.courses?.includes('dheya')) {
        navigate('/dashboard/dheya', { replace: true });
      } else {
        navigate('/dashboard/dheya', { replace: true });
      }
    }

    return { success: true, message: 'Login successful', isAdmin: user.role === 'admin' };
  };

  const logout = async () => {
    // Delete session from Supabase
    const sessionToken = localStorage.getItem('session_token');
    if (sessionToken) {
      await supabase.from('user_sessions').delete().eq('session_token', sessionToken);
    }

    // Clear local storage
    localStorage.removeItem('session_token');

    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        accounts,
        login,
        logout,
        addStudent: () => ({ success: true, message: '' }),
        deleteStudent: () => {},
        approveStudent: () => {},
        rejectStudent: () => {},
        getPendingStudents: () => [],
        getApprovedStudents: () => [],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
