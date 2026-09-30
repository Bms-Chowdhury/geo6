import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Lock, KeyRound, AlertCircle, RefreshCw, X, Eye, EyeOff, Terminal } from 'lucide-react';
import { AppUser, Language } from '../types';
import { signInWithSupabase } from '../lib/supabase';
import {
  checkBruteForceLockout,
  recordFailedLoginAttempt,
  resetFailedLoginAttempts,
  logSecurityEvent,
  SecurityStatus
} from '../lib/stealthSecurity';

interface StealthSecurityGatewayProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onAuthenticated: (user: AppUser) => void;
}

export const StealthSecurityGateway: React.FC<StealthSecurityGatewayProps> = ({
  isOpen,
  language,
  onClose,
  onAuthenticated
}) => {
  const [email, setEmail] = useState('m2bmsbabu@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [honeypotValue, setHoneypotValue] = useState('');

  // Brute force lockout timer state
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    isLocked: false,
    remainingSeconds: 0,
    attemptsCount: 0
  });

  // Check lockout on mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      setSecurityStatus(checkBruteForceLockout());
    }
  }, [isOpen]);

  // Real-time countdown timer when locked out
  useEffect(() => {
    if (!securityStatus.isLocked || securityStatus.remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setSecurityStatus((prev) => {
        if (prev.remainingSeconds <= 1) {
          clearInterval(timer);
          return { isLocked: false, remainingSeconds: 0, attemptsCount: 0 };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [securityStatus.isLocked, securityStatus.remainingSeconds]);

  if (!isOpen) return null;

  const formatLockoutTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Honeypot check: automated bots fill all inputs
    if (honeypotValue.trim().length > 0) {
      logSecurityEvent('honeypot_triggered', 'Automated bot trap triggered in security gateway.');
      // Artificial delay to waste bot resources, then show generic failure
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setErrorMsg('Access denied. Verification token invalid.');
      }, 1500);
      return;
    }

    // 2. Lockout check
    const currentLockout = checkBruteForceLockout();
    if (currentLockout.isLocked) {
      setSecurityStatus(currentLockout);
      setErrorMsg(
        language === 'bn'
          ? `অতিরিক্ত ভুল প্রচেষ্টার কারণে গেটওয়ে সাময়িকভাবে লক করা হয়েছে। অপেক্ষা করুন: ${formatLockoutTime(currentLockout.remainingSeconds)}`
          : `Brute force protection active. Please wait ${formatLockoutTime(currentLockout.remainingSeconds)} before retrying.`
      );
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg(language === 'bn' ? 'ইমেইল ও পাসওয়ার্ড প্রদান করুন।' : 'Please provide both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await signInWithSupabase(email.trim(), password);
      setLoading(false);

      if (result.success && result.user) {
        resetFailedLoginAttempts();
        logSecurityEvent('successful_login', `User ${result.user.email} successfully authenticated (${result.user.role}).`);
        onAuthenticated(result.user);
      } else {
        const updatedStatus = recordFailedLoginAttempt();
        setSecurityStatus(updatedStatus);

        if (updatedStatus.isLocked) {
          setErrorMsg(
            language === 'bn'
              ? `ভুল প্রচেষ্টার সীমা অতিক্রম করেছে! গেটওয়ে ১৫ মিনিটের জন্য লক করা হয়েছে (${formatLockoutTime(updatedStatus.remainingSeconds)})।`
              : `Maximum attempt limit exceeded! Security lockout activated for 15 minutes.`
          );
        } else {
          setErrorMsg(
            result.error ||
            (language === 'bn'
              ? `লগইন ব্যর্থ হয়েছে। অবশিষ্ট প্রচেষ্টা: ${5 - updatedStatus.attemptsCount}/5`
              : `Authentication failed. Remaining attempts: ${5 - updatedStatus.attemptsCount}/5`)
          );
        }
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'Gateway connection error.');
    }
  };

  return (
    <div
      id="stealth-security-gateway-modal"
      className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl text-slate-100 relative overflow-hidden">
        {/* Subtle top security accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-indigo-600" />

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shadow-inner">
              <Lock className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide flex items-center gap-1.5">
                <span>The GeoPacts</span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 font-mono border border-indigo-800/60">
                  SECURE VAULT
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'সুরক্ষিত অ্যাডমিনিস্ট্রেশন গেটওয়ে' : 'Zero-Trust Administration Gateway'}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-stealth-gateway"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lockout Warning Banner */}
        {securityStatus.isLocked ? (
          <div className="mb-5 p-4 bg-red-950/60 border border-red-800/80 rounded-xl text-xs space-y-2 text-red-200">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{language === 'bn' ? 'অ্যান্টি-ব্রুটফোর্স লকআউট সক্রিয়' : 'Anti-Brute Force Lockout Active'}</span>
            </div>
            <p className="text-[11px] text-red-300">
              {language === 'bn'
                ? `নিরাপত্তার স্বার্থে এই ডিভাইসটি সাময়িকভাবে স্থগিত রয়েছে। বাকি সময়:`
                : `Gateway temporarily locked due to excessive failed attempts. Remaining timer:`}
            </p>
            <div className="flex items-center justify-between pt-1">
              <div className="text-xl font-mono font-black text-red-400 tracking-wider">
                {formatLockoutTime(securityStatus.remainingSeconds)}
              </div>
              <button
                type="button"
                onClick={() => {
                  resetFailedLoginAttempts();
                  setSecurityStatus({ isLocked: false, remainingSeconds: 0, attemptsCount: 0 });
                  setErrorMsg(null);
                }}
                className="px-3 py-1.5 bg-red-900/90 hover:bg-red-800 text-white rounded-lg text-xs font-semibold cursor-pointer border border-red-700/60 transition-colors shadow-sm"
              >
                {language === 'bn' ? 'লকআউট রিসেট করুন' : 'Reset Lockout'}
              </button>
            </div>
          </div>
        ) : null}

        {/* Error Feedback */}
        {errorMsg && !securityStatus.isLocked && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Invisible Honeypot field to trap automated dictionary attack bots */}
          <input
            type="text"
            name="sys_honeypot_gate"
            value={honeypotValue}
            onChange={(e) => setHoneypotValue(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="absolute opacity-0 -z-50 pointer-events-none w-0 h-0 p-0 border-0 m-0"
            aria-hidden="true"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'bn' ? 'সুপাবেস অ্যাডমিন ইমেইল' : 'Supabase Admin Email'}
            </label>
            <div className="relative">
              <input
                type="email"
                id="stealth-admin-email"
                required
                disabled={securityStatus.isLocked || loading}
                placeholder="admin@thegeopacts.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="stealth-admin-password"
                required
                disabled={securityStatus.isLocked || loading}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              id="btn-cancel-gateway"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              id="btn-submit-stealth-gateway"
              disabled={securityStatus.isLocked || loading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying Credentials...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ভল্ট আনলক করুন' : 'Unlock Portal Vault'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Disclaimers */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-indigo-400" />
            <span>Anti-Brute Force • Honeypot Protected</span>
          </div>
          <span>v2.4 Stealth</span>
        </div>
      </div>
    </div>
  );
};
