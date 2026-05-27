import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ROLES = ["employee", "manager", "admin"];
const DEPARTMENTS = ["Engineering", "Design", "Sales", "Marketing", "HR", "Finance", "Operations"];

/* ─── Inline SVG illustrations for corner decorations ─── */
function CornerLeft() {
  return (
    <svg viewBox="0 0 320 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* desk / monitor */}
      <rect x="30" y="180" width="130" height="85" rx="8" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2"/>
      <rect x="38" y="188" width="114" height="62" rx="4" fill="#e0e7ff"/>
      {/* screen content lines */}
      <rect x="46" y="196" width="70" height="6" rx="3" fill="#818cf8"/>
      <rect x="46" y="208" width="50" height="5" rx="2.5" fill="#a5b4fc"/>
      <rect x="46" y="219" width="60" height="5" rx="2.5" fill="#a5b4fc"/>
      {/* chart bars */}
      <rect x="120" y="225" width="10" height="18" rx="2" fill="#6366f1"/>
      <rect x="133" y="218" width="10" height="25" rx="2" fill="#818cf8"/>
      {/* monitor stand */}
      <rect x="82" y="265" width="26" height="14" rx="3" fill="#a5b4fc"/>
      <rect x="68" y="278" width="54" height="6" rx="3" fill="#818cf8"/>

      {/* person 1 - standing left */}
      {/* body */}
      <ellipse cx="60" cy="370" rx="22" ry="10" fill="#c7d2fe" opacity="0.4"/>
      <rect x="44" y="310" width="32" height="56" rx="10" fill="#4f46e5"/>
      {/* head */}
      <circle cx="60" cy="298" r="18" fill="#fbbf24"/>
      {/* hair */}
      <ellipse cx="60" cy="283" rx="18" ry="8" fill="#92400e"/>
      {/* arm raised */}
      <rect x="76" y="312" width="30" height="10" rx="5" fill="#4f46e5" transform="rotate(-30 76 312)"/>
      {/* legs */}
      <rect x="48" y="360" width="12" height="30" rx="6" fill="#1e1b4b"/>
      <rect x="62" y="360" width="12" height="30" rx="6" fill="#1e1b4b"/>
      {/* shoes */}
      <ellipse cx="54" cy="390" rx="9" ry="5" fill="#312e81"/>
      <ellipse cx="68" cy="390" rx="9" ry="5" fill="#312e81"/>

      {/* person 2 - crouching right with dog */}
      <ellipse cx="200" cy="398" rx="25" ry="8" fill="#c7d2fe" opacity="0.4"/>
      {/* body */}
      <rect x="180" y="340" width="34" height="50" rx="10" fill="#7c3aed"/>
      {/* head */}
      <circle cx="197" cy="328" r="18" fill="#fde68a"/>
      {/* hair */}
      <ellipse cx="197" cy="313" rx="16" ry="7" fill="#1e1b4b"/>
      {/* skirt / legs */}
      <path d="M180 385 Q197 395 214 385" stroke="#7c3aed" strokeWidth="3" fill="none"/>
      <rect x="184" y="375" width="12" height="25" rx="6" fill="#5b21b6"/>
      <rect x="198" y="375" width="12" height="25" rx="6" fill="#5b21b6"/>
      <ellipse cx="190" cy="400" rx="9" ry="5" fill="#3730a3"/>
      <ellipse cx="204" cy="400" rx="9" ry="5" fill="#3730a3"/>

      {/* dog */}
      <ellipse cx="245" cy="390" rx="20" ry="12" fill="#fef3c7"/>
      <ellipse cx="262" cy="385" rx="10" ry="8" fill="#fef3c7"/>
      <ellipse cx="270" cy="382" rx="5" ry="7" fill="#fde68a"/>
      <ellipse cx="270" cy="381" rx="4" ry="6" fill="#fde68a"/>
      {/* dog legs */}
      <rect x="230" y="398" width="8" height="14" rx="4" fill="#fde68a"/>
      <rect x="244" y="400" width="8" height="12" rx="4" fill="#fde68a"/>
      {/* leash */}
      <path d="M262 388 Q240 370 214 375" stroke="#1e1b4b" strokeWidth="2" fill="none"/>

      {/* floating lightbulb top */}
      <circle cx="100" cy="80" r="22" fill="#fef08a"/>
      <rect x="92" y="100" width="16" height="8" rx="2" fill="#ca8a04"/>
      <path d="M92 102 L108 102" stroke="#ca8a04" strokeWidth="1.5"/>
      <path d="M94 106 L106 106" stroke="#ca8a04" strokeWidth="1.5"/>
      {/* shine */}
      <circle cx="108" cy="72" r="4" fill="white" opacity="0.6"/>

      {/* floating cards / UI elements */}
      <rect x="20" y="120" width="90" height="55" rx="8" fill="white" stroke="#e0e7ff" strokeWidth="1.5"/>
      <rect x="28" y="128" width="40" height="6" rx="3" fill="#818cf8"/>
      <rect x="28" y="140" width="60" height="4" rx="2" fill="#e0e7ff"/>
      <rect x="28" y="150" width="50" height="4" rx="2" fill="#e0e7ff"/>
      <rect x="140" y="100" width="80" height="50" rx="8" fill="white" stroke="#e0e7ff" strokeWidth="1.5"/>
      <rect x="148" y="110" width="30" height="5" rx="2.5" fill="#6366f1"/>
      <rect x="148" y="120" width="55" height="4" rx="2" fill="#e0e7ff"/>
      <rect x="148" y="130" width="45" height="4" rx="2" fill="#e0e7ff"/>
    </svg>
  );
}

function CornerRight() {
  return (
    <svg viewBox="0 0 320 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* big monitor / dashboard */}
      <rect x="60" y="60" width="200" height="130" rx="10" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2"/>
      <rect x="68" y="68" width="184" height="106" rx="6" fill="#e0e7ff"/>
      {/* dashboard top bar */}
      <rect x="68" y="68" width="184" height="18" rx="6" fill="#6366f1"/>
      <circle cx="80" cy="77" r="4" fill="#a5b4fc"/>
      <circle cx="92" cy="77" r="4" fill="#a5b4fc"/>
      <circle cx="104" cy="77" r="4" fill="#a5b4fc"/>
      {/* chart area */}
      <rect x="76" y="94" width="80" height="50" rx="4" fill="white" opacity="0.7"/>
      <rect x="80" y="118" width="8" height="22" rx="2" fill="#6366f1"/>
      <rect x="92" y="110" width="8" height="30" rx="2" fill="#818cf8"/>
      <rect x="104" y="104" width="8" height="36" rx="2" fill="#4f46e5"/>
      <rect x="116" y="112" width="8" height="28" rx="2" fill="#818cf8"/>
      <rect x="128" y="100" width="8" height="40" rx="2" fill="#6366f1"/>
      {/* side panel */}
      <rect x="164" y="94" width="80" height="50" rx="4" fill="white" opacity="0.7"/>
      <rect x="172" y="102" width="50" height="5" rx="2.5" fill="#818cf8"/>
      <rect x="172" y="113" width="35" height="4" rx="2" fill="#e0e7ff"/>
      <rect x="172" y="122" width="45" height="4" rx="2" fill="#e0e7ff"/>
      <rect x="172" y="131" width="30" height="4" rx="2" fill="#e0e7ff"/>
      {/* monitor stand */}
      <rect x="148" y="190" width="24" height="18" rx="3" fill="#a5b4fc"/>
      <rect x="132" y="207" width="56" height="7" rx="3" fill="#818cf8"/>

      {/* robot character */}
      <ellipse cx="80" cy="410" rx="28" ry="10" fill="#c7d2fe" opacity="0.4"/>
      {/* body */}
      <rect x="58" y="330" width="44" height="60" rx="8" fill="#4f46e5"/>
      <rect x="66" y="342" width="28" height="18" rx="4" fill="#818cf8"/>
      <circle cx="72" cy="350" r="4" fill="#fbbf24"/>
      <circle cx="86" cy="350" r="4" fill="#34d399"/>
      {/* arms */}
      <rect x="36" y="334" width="22" height="10" rx="5" fill="#4f46e5"/>
      <rect x="102" y="334" width="22" height="10" rx="5" fill="#4f46e5"/>
      <circle cx="30" cy="339" r="8" fill="#818cf8"/>
      <circle cx="130" cy="339" r="8" fill="#818cf8"/>
      {/* head */}
      <rect x="54" y="290" width="52" height="42" rx="10" fill="#6366f1"/>
      <rect x="62" y="298" width="36" height="22" rx="4" fill="#e0e7ff"/>
      <circle cx="72" cy="308" r="5" fill="#4f46e5"/>
      <circle cx="88" cy="308" r="5" fill="#4f46e5"/>
      <rect x="70" y="316" width="20" height="2" rx="1" fill="#818cf8"/>
      {/* antenna */}
      <rect x="78" y="278" width="4" height="14" rx="2" fill="#818cf8"/>
      <circle cx="80" cy="274" r="5" fill="#fbbf24"/>
      {/* legs */}
      <rect x="62" y="388" width="14" height="22" rx="6" fill="#312e81"/>
      <rect x="82" y="388" width="14" height="22" rx="6" fill="#312e81"/>

      {/* person - purple hair */}
      <ellipse cx="230" cy="408" rx="26" ry="9" fill="#c7d2fe" opacity="0.4"/>
      {/* body */}
      <rect x="210" y="340" width="38" height="58" rx="10" fill="#7c3aed"/>
      {/* head */}
      <circle cx="229" cy="328" r="20" fill="#fde68a"/>
      {/* purple hair */}
      <ellipse cx="229" cy="312" rx="20" ry="9" fill="#7c3aed"/>
      <rect x="209" y="312" width="8" height="22" rx="4" fill="#7c3aed"/>
      {/* arm up pointing */}
      <rect x="248" y="340" width="28" height="11" rx="5.5" fill="#7c3aed" transform="rotate(-45 248 340)"/>
      {/* legs */}
      <rect x="214" y="394" width="13" height="24" rx="6" fill="#5b21b6"/>
      <rect x="230" y="394" width="13" height="24" rx="6" fill="#5b21b6"/>
      <ellipse cx="220" cy="418" rx="10" ry="5" fill="#3730a3"/>
      <ellipse cx="236" cy="418" rx="10" ry="5" fill="#3730a3"/>

      {/* floating UI cards top right */}
      <rect x="200" y="30" width="100" height="40" rx="6" fill="white" stroke="#e0e7ff" strokeWidth="1.5"/>
      <rect x="208" y="38" width="35" height="5" rx="2.5" fill="#818cf8"/>
      <rect x="208" y="48" width="60" height="4" rx="2" fill="#e0e7ff"/>

      {/* floating badge */}
      <rect x="10" y="250" width="75" height="30" rx="15" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.5"/>
      <circle cx="28" cy="265" r="7" fill="#fbbf24"/>
      <rect x="40" y="260" width="30" height="5" rx="2.5" fill="#92400e"/>
      <rect x="40" y="268" width="20" height="4" rx="2" fill="#ca8a04"/>
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    role: "", department: "", managerId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const { handleRegister } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "confirmPassword" || name === "password") setPasswordMismatch(false);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setPasswordMismatch(true); return; }
    try {
      const user = await handleRegister({
        name: form.name, email: form.email, password: form.password,
        role: form.role, department: form.department,
        managerId: form.managerId || undefined,
      });
      if (user) navigate("/dashboard");
    } catch { /* handled in redux */ }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden py-10">

      {/* ── CORNER ILLUSTRATIONS ── */}
      <div className="fixed bottom-0 left-0 w-72 h-96 pointer-events-none select-none hidden sm:block">
        <CornerLeft />
      </div>
      <div className="fixed bottom-0 right-0 w-72 h-96 pointer-events-none select-none hidden sm:block">
        <CornerRight />
      </div>

      {/* subtle background circles for depth */}
      <div className="fixed top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-60px] right-[-60px] w-80 h-80 rounded-full bg-purple-200/30 blur-3xl pointer-events-none" />

      {/* ── CENTER CARD ── */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-200/50 border border-white/60 px-10 py-10">

          {/* logo */}
          <div className="flex flex-col items-center mb-7">
            <img src="/logo-icon.png" alt="D-Table Icon" className="w-16 h-16 mb-0 drop-shadow-md object-contain" />
            <img src="/logo-text.png" alt="D-Table Analytics" className="h-30 w-auto object-contain" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 text-center mb-1">Create an Account</h2>
          <p className="text-gray-400 text-sm text-center mb-7">
            Sign up to get started
          </p>

          {/* errors */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}
          {passwordMismatch && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
              Passwords do not match.
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* full name */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </span>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Full name" required
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
            </div>

            {/* email */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/>
                </svg>
              </span>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="Email address" required
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
            </div>

            {/* role + department */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                    <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/>
                  </svg>
                </span>
                <select name="role" value={form.role} onChange={handleChange} required
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer">
                  <option value="" disabled>Role</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </span>
                <select name="department" value={form.department} onChange={handleChange} required
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer">
                  <option value="" disabled>Department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* manager id */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </span>
              <input type="text" name="managerId" value={form.managerId} onChange={handleChange}
                placeholder="Manager ID (optional)"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
            </div>

            {/* password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
              <input type={showPassword ? "text" : "password"} name="password"
                value={form.password} onChange={handleChange}
                placeholder="Password" required
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {/* confirm password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </span>
              <input type={showConfirm ? "text" : "password"} name="confirmPassword"
                value={form.confirmPassword} onChange={handleChange}
                placeholder="Confirm password" required
                className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all ${passwordMismatch ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <EyeIcon open={showConfirm} />
              </button>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-300/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Creating account...
                </>
              ) : "Create Account"}
            </button>
          </form>

          {/* divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100"/>
            <span className="text-gray-400 text-xs">or sign up with</span>
            <div className="flex-1 h-px bg-gray-100"/>
          </div>

          {/* social icons row */}
          <div className="flex gap-3 justify-center">
            {/* Google */}
            <button className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-indigo-200 transition-all flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            {/* Microsoft */}
            {/* <button className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-indigo-200 transition-all flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                <path fill="#7fba00" d="M1 13h10v10H1z"/>
                <path fill="#ffb900" d="M13 13h10v10H13z"/>
              </svg>
            </button> */}
            {/* Apple */}
            {/* <button className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-indigo-200 transition-all flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </button> */}
          </div>

          {/* login link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}