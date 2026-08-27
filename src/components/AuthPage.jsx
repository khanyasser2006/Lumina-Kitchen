import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getAdminPasscode, hashPassword } from '../utils/storage';

export default function AuthPage({ onNavigate, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const pageRef = useRef(null);
  const formCardRef = useRef(null);
  const brandRef = useRef(null);
  const dividerRef = useRef(null);
  const fieldsRef = useRef(null);

  // ── Entrance animation ──
  useEffect(() => {
    window.scrollTo(0, 0);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial state
    gsap.set(brandRef.current, { opacity: 0, y: -20 });
    gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(formCardRef.current, { opacity: 0, y: 40 });

    tl.to(brandRef.current, { opacity: 1, y: 0, duration: 0.8, delay: 0.15 })
      .to(dividerRef.current, { scaleX: 1, duration: 1, ease: 'power3.inOut' }, '-=0.4')
      .to(formCardRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');

    return () => tl.kill();
  }, []);

  // ── Mode switch animation ──
  useEffect(() => {
    if (!fieldsRef.current) return;

    gsap.fromTo(
      fieldsRef.current.children,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
      }
    );

    setError('');
    setSuccess('');
  }, [mode]);

  // ── Login handler ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields.');
      return;
    }

    const inputEmail = loginData.email.trim().toLowerCase();
    const inputPass = loginData.password.trim();
    const currentAdminPass = getAdminPasscode();
    const inputHash = await hashPassword(inputPass);

    // 1. Admin Authentication Check
    const isAdminCredentials =
      (inputEmail === 'admin@lumina.com' || inputEmail === 'admin') &&
      inputPass === currentAdminPass;

    if (isAdminCredentials) {
      sessionStorage.setItem('lumina_admin_authenticated', 'true');
      sessionStorage.setItem(
        'lumina_logged_in',
        JSON.stringify({ name: 'Director', email: 'admin@lumina.com', role: 'admin' })
      );

      gsap.to(formCardRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => onNavigate('admin'),
      });
      return;
    }

    // 2. Client / User Authentication Check (hashes match or plaintext fallback)
    const users = JSON.parse(localStorage.getItem('lumina_users') || '[]');
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === inputEmail &&
        (u.passwordHash === inputHash || u.password === inputPass)
    );

    if (foundUser) {
      // Omit password hash from session storage for security
      const safeUser = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      sessionStorage.setItem('lumina_logged_in', JSON.stringify(safeUser));
      sessionStorage.setItem('lumina_admin_authenticated', 'true');

      gsap.to(formCardRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => onNavigate('admin'),
      });
    } else {
      setError('Invalid credentials. Hint for admin: admin@lumina.com / lumina2026');
      gsap.fromTo(
        formCardRef.current,
        { x: -8 },
        { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }
      );
    }
  };

  // ── Register handler ──
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match.');
      gsap.fromTo(
        formCardRef.current,
        { x: -8 },
        { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }
      );
      return;
    }

    const users = JSON.parse(localStorage.getItem('lumina_users') || '[]');
    const inputEmail = registerData.email.trim().toLowerCase();
    const exists = users.find((u) => u.email.toLowerCase() === inputEmail);

    if (exists) {
      setError('An account with this email already exists.');
      return;
    }

    // Compute cryptographic SHA-256 hash for secure storage
    const passwordHash = await hashPassword(registerData.password.trim());

    const newUser = {
      id: `USR-${Date.now()}`,
      name: registerData.name.trim(),
      email: inputEmail,
      passwordHash: passwordHash, // Stored encrypted
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('lumina_users', JSON.stringify(users));

    setSuccess('Account registered & encrypted successfully! Redirecting to login...');
    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });

    setTimeout(() => {
      setMode('login');
      setSuccess('');
    }, 1500);
  };

  return (
    <main ref={pageRef} className="min-h-screen bg-page flex items-center justify-center pt-8 pb-32 px-6">
      {/* Decorative background elements */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, hsla(30, 20%, 90%, 0.5) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, hsla(15, 25%, 88%, 0.3) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[480px]">
        {/* Brand header */}
        <div ref={brandRef} className="text-center mb-12">
          <button
            onClick={() => onNavigate('home')}
            className="font-editorial text-2xl tracking-[0.2em] uppercase text-deep font-light cursor-pointer hover:opacity-70 transition-opacity inline-block mb-4"
          >
            Lumina
          </button>
          <p className="text-graphite text-[15px] font-body leading-relaxed max-w-[320px] mx-auto">
            {mode === 'login'
              ? 'Welcome back to your private atelier.'
              : 'Create your private client account.'}
          </p>
        </div>

        {/* Divider */}
        <div
          ref={dividerRef}
          className="w-12 h-[1px] bg-bronze mx-auto mb-12"
        />

        {/* Form Card */}
        <div
          ref={formCardRef}
          className="bg-surface border border-hairline p-8 sm:p-12"
          style={{
            boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
          }}
        >
          {/* Mode Toggle Tabs */}
          <div className="flex border-b border-hairline mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 pb-4 text-[13px] tracking-[0.15em] uppercase font-body font-medium cursor-pointer transition-all relative ${
                mode === 'login' ? 'text-deep' : 'text-taupe hover:text-graphite'
              }`}
              style={{ transitionDuration: '250ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              Login
              {mode === 'login' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-bronze" />
              )}
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 pb-4 text-[13px] tracking-[0.15em] uppercase font-body font-medium cursor-pointer transition-all relative ${
                mode === 'register' ? 'text-deep' : 'text-taupe hover:text-graphite'
              }`}
              style={{ transitionDuration: '250ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              Register
              {mode === 'register' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-bronze" />
              )}
            </button>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div
              className="mb-6 p-4 border text-xs font-body font-medium"
              style={{
                borderColor: 'hsl(0, 45%, 65%)',
                color: 'hsl(0, 45%, 40%)',
                background: 'hsl(0, 30%, 96%)',
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 border border-bronze text-bronze text-xs font-body font-medium bg-surface">
              {success}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <div ref={fieldsRef} className="space-y-6">
                <div>
                  <label className="text-[11px] font-body tracking-[0.15em] text-deep uppercase block mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full p-4 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze placeholder:text-taupe"
                    style={{ transition: 'border-color 250ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-body tracking-[0.15em] text-deep uppercase block mb-2 font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full p-4 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze placeholder:text-taupe"
                    style={{ transition: 'border-color 250ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-bark text-page text-[13px] tracking-[0.2em] uppercase font-body font-medium rounded-full hover:bg-deep cursor-pointer"
                  style={{ transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  Sign In →
                </button>
              </div>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister}>
              <div ref={fieldsRef} className="space-y-6">
                <div>
                  <label className="text-[11px] font-body tracking-[0.15em] text-deep uppercase block mb-2 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Lord Alistair Sterling"
                    className="w-full p-4 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze placeholder:text-taupe"
                    style={{ transition: 'border-color 250ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-body tracking-[0.15em] text-deep uppercase block mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full p-4 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze placeholder:text-taupe"
                    style={{ transition: 'border-color 250ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-body tracking-[0.15em] text-deep uppercase block mb-2 font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="Min. 6 characters"
                      className="w-full p-4 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze placeholder:text-taupe"
                      style={{ transition: 'border-color 250ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-body tracking-[0.15em] text-deep uppercase block mb-2 font-medium">
                      Confirm
                    </label>
                    <input
                      type="password"
                      required
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-4 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze placeholder:text-taupe"
                      style={{ transition: 'border-color 250ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-bark text-page text-[13px] tracking-[0.2em] uppercase font-body font-medium rounded-full hover:bg-deep cursor-pointer"
                  style={{ transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  Create Account →
                </button>
              </div>
            </form>
          )}

          {/* Switch prompt */}
          <p className="text-center text-taupe text-xs font-body mt-8">
            {mode === 'login' ? (
              <>
                No account yet?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-bronze hover:text-deep font-medium cursor-pointer"
                  style={{ transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-bronze hover:text-deep font-medium cursor-pointer"
                  style={{ transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Return to site */}
        <div className="text-center mt-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-taupe hover:text-deep text-[12px] tracking-[0.12em] uppercase font-body cursor-pointer"
            style={{ transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            ← Return to Lumina
          </button>
        </div>
      </div>
    </main>
  );
}
