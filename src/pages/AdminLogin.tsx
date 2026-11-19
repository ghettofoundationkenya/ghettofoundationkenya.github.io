import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAILS = ['sndambuki155@gmail.com', 'management@ghettofoundationkenya.org'];

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const verifyAdmin = async (userId: string, userEmail?: string | null) => {
    if (!userEmail || !ADMIN_EMAILS.includes(userEmail.toLowerCase())) return false;
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    if (error) throw error;
    return Boolean(data);
  };

  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session || !active) return;
        if (await verifyAdmin(session.user.id, session.user.email)) navigate('/admin', { replace: true });
        else await supabase.auth.signOut();
      } catch (error: any) {
        if (active) setErrorMsg(error?.message || 'Could not verify your administrator session.');
      }
    };
    checkSession();
    return () => { active = false; };
  }, [navigate]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ADMIN_EMAILS.includes(email.trim().toLowerCase())) {
      setErrorMsg('Password recovery is available only for the two authorised administrator email addresses.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/login`,
    });
    setLoading(false);
    if (error) setErrorMsg(error.message);
    else {
      toast({ title: 'Check your email', description: 'A password reset link has been sent.' });
      setIsForgotPassword(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const normalizedEmail = email.trim().toLowerCase();

    if (!ADMIN_EMAILS.includes(normalizedEmail)) {
      setLoading(false);
      setErrorMsg('This email address is not authorised to access the administration portal.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (error) throw error;

      const isAdmin = await verifyAdmin(data.user.id, data.user.email);
      if (!isAdmin) {
        await supabase.auth.signOut();
        setErrorMsg('Your account exists, but administrator access has not yet been assigned. Ask an existing project owner to grant the admin role.');
        return;
      }
      navigate('/admin', { replace: true });
    } catch (error: any) {
      const message = error?.message || 'Unable to sign in.';
      setErrorMsg(message === 'Failed to fetch'
        ? 'Could not reach Supabase. Check that this website is deployed with the new project URL and publishable key, then try again.'
        : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-12 font-sans">
      <div className="absolute inset-0 -z-20 admin-animated-bg" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-[#f97316]/30 blur-3xl admin-blob-a" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-[#16a34a]/30 blur-3xl admin-blob-b" />
        <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] rounded-full bg-[#3b82f6]/25 blur-3xl admin-blob-c" />
      </div>

      <div className="relative w-full max-w-md animate-admin-rise">
        <div className="rounded-2xl border border-white/25 bg-white/15 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.25)] p-8 md:p-10">
          <div className="text-center mb-7">
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-md">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {isForgotPassword ? 'Reset Password' : 'Ghetto Foundation Admin'}
            </h1>
            <p className="text-sm text-white/75 mt-2 font-light">
              {isForgotPassword ? 'Enter your authorised email to receive a reset link' : 'Secure access for the two authorised administrators'}
            </p>
          </div>

          {errorMsg && (
            <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-2 text-sm text-red-50 backdrop-blur-md">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={isForgotPassword ? handleForgotPassword : handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white/90 text-sm font-medium">Email</Label>
              <Input id="email" type="email" autoComplete="username" value={email}
                onChange={e => setEmail(e.target.value)} required className="admin-input"
                placeholder="authorised email address" />
            </div>

            {!isForgotPassword && (
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-white/90 text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                    value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                    className="admin-input pr-10" placeholder="Your password" />
                  <button type="button" onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading}
              className="w-full h-11 font-semibold text-white border-0 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#f97316] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]">
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Please wait...</span>
                : isForgotPassword ? 'Send Reset Link' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center mt-5">
            <button type="button" onClick={() => { setIsForgotPassword(v => !v); setErrorMsg(null); }}
              className="text-sm text-white/80 hover:text-white hover:underline">
              {isForgotPassword ? 'Back to login' : 'Forgot password?'}
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-white/60 mt-6 font-light">
          © Ghetto Foundation · Protected administration portal
        </p>
      </div>

      <style>{`
        .admin-animated-bg { background: linear-gradient(125deg, #f97316, #16a34a, #3b82f6, #f97316); background-size: 300% 300%; animation: adminGradientShift 22s ease-in-out infinite; }
        @keyframes adminGradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .admin-blob-a { animation: adminFloatA 18s ease-in-out infinite; }
        .admin-blob-b { animation: adminFloatB 24s ease-in-out infinite; }
        .admin-blob-c { animation: adminFloatC 20s ease-in-out infinite; }
        @keyframes adminFloatA { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,40px) scale(1.1); } }
        @keyframes adminFloatB { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,-30px) scale(1.15); } }
        @keyframes adminFloatC { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px,50px) scale(0.95); } }
        @keyframes adminRise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-admin-rise { animation: adminRise 0.7s ease-out both; }
        .admin-input { background: rgba(15,23,42,.55) !important; border: 1px solid rgba(255,255,255,.35) !important; color: #fff !important; }
        .admin-input::placeholder { color: rgba(255,255,255,.7); }
        .admin-input:focus-visible { border-color: #f97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,.35), 0 0 18px rgba(249,115,22,.35) !important; outline: none; }
        @media (prefers-reduced-motion: reduce) { .admin-animated-bg, .admin-blob-a, .admin-blob-b, .admin-blob-c { animation: none !important; } }
      `}</style>
    </div>
  );
};

export default AdminLogin;
