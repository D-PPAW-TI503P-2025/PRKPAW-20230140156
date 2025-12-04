import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        email: email,
        password: password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Login gagal");
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 h-56 w-56 bg-red-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 bg-fuchsia-500/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-[1px] bg-gradient-to-br from-fuchsia-500 via-red-500 to-slate-900 rounded-3xl opacity-70 blur-sm" />
        <div className="relative bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-fuchsia-500/40 shadow-[0_0_40px_rgba(248,113,113,0.7)] p-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs tracking-[0.25em] uppercase text-fuchsia-400/80">
              Silakan login terlebih dahulu
            </p>
            <span className="text-[10px] text-slate-500">
              STATUS: <span className="text-emerald-400">STANDBY</span>
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-fuchsia-100 mb-1">
            Login
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Masuk ke dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-300 uppercase tracking-wide mb-1"
              >
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-cyan-400/80">
                  @
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-0 w-full px-8 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-400 text-sm placeholder:text-slate-500"
                  placeholder="bloodline@night.net"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-300 uppercase tracking-wide mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-0 w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-400 text-sm placeholder:text-slate-500"
                  placeholder="••••••••"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] tracking-widest text-fuchsia-400/70">
                  LOCK
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-red-500 via-fuchsia-500 to-red-500 text-white text-sm font-semibold rounded-2xl shadow-[0_0_25px_rgba(248,113,113,0.7)] hover:shadow-[0_0_35px_rgba(236,72,153,0.9)] transition active:scale-[0.98]"
            >
              Login
            </button>
          </form>

          {error && (
            <p className="text-red-300 text-xs mt-4 text-center bg-red-500/10 border border-red-500/50 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="mt-5 text-[11px] text-slate-500 text-center">
            <span className="inline-block px-2 py-1 rounded-full border border-slate-700/80 bg-slate-900/70">
              Dengan Login, Anda Menyetujui Syarat & Ketentuan Layanan Kami.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;