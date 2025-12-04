import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-fuchsia-950 flex flex-col items-center justify-center p-6 text-slate-100">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-red-500/25 via-fuchsia-500/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-10 right-10 h-64 w-64 bg-fuchsia-500/25 blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="absolute -inset-[1px] bg-gradient-to-br from-red-500 via-fuchsia-500 to-slate-900 rounded-3xl opacity-70 blur-sm" />
        <div className="relative bg-slate-950/85 backdrop-blur-xl rounded-3xl border border-fuchsia-500/40 shadow-[0_0_45px_rgba(248,113,113,0.85)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/80">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Dashboard
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              STATUS: <span className="text-fuchsia-300">ONLINE</span>
            </span>
          </div>

          <div className="px-8 py-10 flex flex-col gap-6 items-center text-center">
            <h1 className="text-3xl font-semibold text-fuchsia-100 tracking-tight">
              Login Sukses
            </h1>
            <p className="max-w-md text-sm text-slate-300">
              Selamat datang di <span className="text-fuchsia-300">Dashboard</span> Anda
            </p>

            <button
              onClick={handleLogout}
              className="mt-6 inline-flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-slate-900 via-red-600 to-slate-900 text-white text-sm font-semibold rounded-2xl shadow-[0_0_25px_rgba(239,68,68,0.7)] hover:shadow-[0_0_35px_rgba(239,68,68,0.9)] border border-red-500/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-950 transition active:scale-[0.98]"
            >
              <span className="h-2 w-2 rounded-full bg-red-300 shadow-[0_0_12px_rgba(248,113,113,1)]" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;