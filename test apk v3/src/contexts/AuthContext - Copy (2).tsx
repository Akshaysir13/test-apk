// src/contexts/AuthContext.tsx - UPDATED VERSION
// ONLY the initialAccounts section changed - rest stays the same

import { createContext, useContext, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { UserAccount } from '../types';

// Supabase setup (NO CHANGES)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file!');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Device ID utilities (NO CHANGES)
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

// Auth constants
const ADMIN_EMAIL = 'admin@jee.com';
const ADMIN_PASSWORD = 'admin123';

// ==========================================
// 👥 STUDENT ACCOUNTS - ADD YOUR STUDENTS HERE
// ==========================================
const initialAccounts: UserAccount[] = [
  // ========================================
  // ADMIN
  // ========================================
  { 
    email: ADMIN_EMAIL, 
    password: ADMIN_PASSWORD, 
    role: 'admin', 
    approved: true,
    courses: ['foundation', 'rank_booster', 'dheya']  // ← ADDED
  },
  
  // ========================================
  // 💎 FOUNDATION COURSE STUDENTS (₹6,000)
  // Copy this format to add Foundation students
  // ========================================
{ email: 'test@gmail.com', password: 'test123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'akshaymoghe5@gmail.com', password: 'Sweetakshay', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'akshaymoghe8@gmail.com', password: 'Sweetavinash', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'archinuzhatkhan@gmail.com', password: 'archi@123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'arrek58@gmail.com', password: 'mock2468', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'adityabaranwal317@gmail.com', password: 'Aditya@317', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'Shivyarawat48@gmail.com', password: 'Shivya123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'ankitaayadavv003@gmail.com', password: 'Anki123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'chikukedkar@gmail.com', password: 'Atharv@kedkar', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'soban.skn@gmail.com', password: 'Arhama123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'atanishka.0908@gmail.com', password: 'Tanishka@1572', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'maghnenwalo@gmail.com', password: 'Qwertyuiop1234567890', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'arohi087149@gmail.com', password: 'Test@123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'Suruchigupta594@gmail.com', password: 'S.gupta123 ', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'anand147nikhil@gmail.com', password: 'Nikhil@2006', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'itsmename521@gmail.com', password: 'nid123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'mridhulprabhakaran@gmail.com', password: 'MaestroMridhul ', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'Pranitamore2202@gmail.com', password: 'Test123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'padmapatil0701@gmail.com', password: '12345', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'kumawatkritika51@gmail.com', password: '123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'aneeshamankala@gmail.com', password: 'Mocktest@6859', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'Emawat30@gmail.com', password: '8937020083', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'heeyabedi@gmail.com', password: 'hamdan', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'zaid96286@gmail.com', password: 'zaid0025', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'saloni.rpvv@gmail.com', password: 'Saloni$123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'rishuthakur20043@gmail.com', password: 'Test12#1', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'ka9953364@gmail.com', password: 'Test123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'Shivani.kumari4672@gmail.com', password: 'Shivani', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'ramnareshsinghyadav71694@gmail.com', password: 'akshay@2007', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'dhatrisrungarapu@gmail.com', password: 'b arch 2026', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'kolamkarprachi@gmail.com', password: 'Prachi112', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'Moresharvarianil@gmail.com', password: 'Testmock.1', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'krishgautam181106@gmail.com', password: 'krish@123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'punarvyammu@gmail.com', password: 'Ammu0709', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'sudiksha8207@gmail.com', password: 'Mock7392 ', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'dollysen6767@gmail.com', password: 'test123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'riddhishivangsiddhi@gmail.com', password: '12345', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'Shahsmit011@gmail.com', password: 'Smit919', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'mdkaif110107@gmail.com', password: 'Mdkaif1234@#', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'hrishitdubey368@gmail.com', password: '1234567890', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'piyush.vadnere12@gmail.com', password: '12344321', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'bhawarnav09@gmail.com', password: 'test123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'harshar2101@gmail.com', password: 'Test123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'cheranmaradani89@gmail.com', password: 'mock@123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'mnandan007@gmail.com', password: 'Nandan@123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'madanramdasshinde@gmail.com', password: 'Google@2016', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'mehvishahmed343@gmail.com', password: 'Mehwishahmed343', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'chandanrajgupta754@gmail.com', password: 'Mission@2026', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'saiko3389@gmail.com', password: 'rsk429', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'anushagupta1508@gmail.com', password: 'ANU123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'tushar0001593@gmail.com', password: 'Tushar#123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'mahathichindukuru122@gmail.com', password: 'Mahi', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'shrutiy831@gmail.com', password: 'Shruti@27', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'kirtikanttiwari@gmail.com', password: 'Kant1612', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'kumaridivya8092@gmail.com', password: 'Divya123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'rishuthakur20043@gmail.com', password: 'Test123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'aditimutha24@gmail.com', password: 'aditi123', role: 'student', approved: true , courses: ['foundation'] },
{ email: '2003alkasharma@gmail.com', password: 'Mock7392 ', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'motionog20@gmail.com', password: 'Aansh20', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'ramnareshsinghyadav71694@gmail.com', password: 'akshay@2007', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'pinkyojha7079700805@gmail.com', password: 'Saloni@123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'saanvigoel08@gmail.com', password: 'saanvi08', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'sovitchhatri34@gmail.com', password: 'sovit@27', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'rubalkaur495@gmail.com', password: 'Rubal02', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'amit4081007@gmail.com', password: '12345678', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'guptakansha14@gmail.com', password: 'S.gupta123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'student1@gmail.com', password: 'pass123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'student2@gmail.com', password: 'pass123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'student3@gmail.com', password: 'pass123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'student4@gmail.com', password: 'pass123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'student5@gmail.com', password: 'pass123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'aadityak.8109@gmail.com', password: 'Aaditya#₹08', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'maghnennana@gmail.com', password: '1234567890', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'student6@gmail.com', password: 'pass123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'fatimanuzhat2007@gmail.com', password: 'khan@123', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'aditidhunde19@gmail.com', password: 'Aditidhunde19', role: 'student', approved: true , courses: ['foundation'] },
{ email: 'navnathsarode28@gmail.com', password: 'navnath@28', role: 'student', approved: true , courses: ['foundation'] },
  // ========================================
  // 🚀 RANK BOOSTER COURSE STUDENTS (₹99)
  // Copy this format to add Rank Booster students
  // ========================================
{ email: 'akshaymoghe5@gmail.com', password: 'sweetakshay@13', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'akshaymoghe8@gmail.com', password: 'sweetakshay@13', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'aditidhunde19@gmail.com', password: 'Aditidhunde19', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'dev879706@gmail.com', password: 'Mithunbplan', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'Rubalkaur495@gmail.com', password: 'Rubalkaur02', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'santoshbalakisan@gmail.com', password: '@praveenw2', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'krushilviramgama243@gmail.co', password: '2425', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'nainasharma7762@gmail.com', password: '9', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'manasvirai2007@gmail.com', password: 'Manasvi@04', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'tabbukumari46@gmail.com', password: '030303', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'marathadeepakchavhan@gmail.com', password: 'Maratha', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'yashasgpawar6@gmail.com', password: '1018', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'mdarifexamuse@gmail.com', password: 'Saheen123', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'swetasingh242005@gmail.com', password: 'Sweta123', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'kundankumarsharma7777@gmail.com', password: 'Sharma ji', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'pratyushvadhwani@gmail.com', password: 'Pratyush@123', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'stephinaantoa@gmail.com', password: 'Stephina@1509', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'anjanaparida94@gmail.com', password: 'Sneha2009', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'efrayamgunji@gmail.com', password: '7396807396', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'Andhra Pradesh', password: 'Jeemains2026', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'sudipdalvi18@gmail.com', password: '2510', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'bhumikashar1807@gmail.com', password: 'bhumika@123', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'harshjadhav01237890@gmail.com', password: 'HH@15072007', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'saish.chavan007@gmail.com', password: 'saish123', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'alabhyadeshmukh@gmail.com', password: 'Alabhya_23', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'adhirajanand21@gmail.com', password: 'adh@123', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'Manognyaagalla@gmail.com', password: 'Jeemains2026', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'satyayadav8292329130@gmail.com', password: 'satya', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'kattaharshith009@gmail.com', password: 'Harshith123', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'mahparaanjumsheikh@gmail.com', password: 'lastminpaperwork', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'sahooswastik29@gmail.com', password: '696969', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'arbazalam8854@gmail.com', password: 'arbaz82', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'kulkarniavdhoot16@gmail.com', password: 'AVDH001', role: 'student', approved: true , courses: ['rank_booster'] },
{ email: 'student13@gmail.com', password: 'pass123', role: 'student', approved: true , courses: ['rank_booster'] },


  // ========================================
  // 📚 DHEYA COURSE STUDENTS (FREE)
  // Copy this format to add Dheya students
  // ========================================
  { 
    email: 'test@gmail.com', 
    password: 'test123', 
    role: 'student', 
    approved: true,
    courses: ['dheya']  // ← ADDED
  },
];

// REST OF THE FILE STAYS EXACTLY THE SAME - NO CHANGES BELOW THIS LINE

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

  const [accounts, setAccounts] = useState<UserAccount[]>(initialAccounts);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

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

    setIsAuthenticated(true);
    setCurrentUser(user);

    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }

    return { success: true, message: 'Login successful', isAdmin: user.role === 'admin' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

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