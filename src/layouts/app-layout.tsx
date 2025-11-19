import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "./main-layout";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userDisplay = user?.name ?? user?.email ?? "User";

  const goProfile = () => {
    setDropdownOpen(false);
    // Navigate to a profile page (placeholder: artist-dashboard)
    navigate("/artist-dashboard");
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen text-background">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold">
                MusicMentor
              </Link>
              <nav className="hidden md:flex space-x-6 items-center">
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/artist-dashboard" className="hover:underline">Dashboard</Link>
                <Link to="/artist-dashboard/training" className="hover:underline">Training</Link>
                <Link to="/artist-dashboard/nmd" className="hover:underline">Directory</Link>
                <Link to="/sponsor-dashboard" className="hover:underline">Sponsor</Link>
              </nav>
              <div ref={wrapperRef} className="relative">
                <button
                  onClick={() => setDropdownOpen((s) => !s)}
                  aria-label="User Menu"
                  className="flex items-center gap-2 rounded-full bg-gray-100 p-2 hover:bg-gray-200 focus:outline-none"
                >
                  <span className="inline-block h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </span>
                  <span className="hidden md:inline-block text-sm font-semibold">{userDisplay}</span>
                  <span className="ml-1">▾</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                    <button onClick={goProfile} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      Profile
                    </button>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        <FooterDetailed />
      </div>
    </MainLayout>
  );
}

function FooterDetailed() {
  return (
    <footer className="bg-gray-900 text-gray-100 mt-8">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <section>
          <h4 className="font-semibold mb-3">MusicMentor</h4>
          <p className="text-sm opacity-90">
            Your companion for musical training, practice tracking, and performance progress.
          </p>
          <div className="mt-4 flex space-x-3 text-sm">
            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
          </div>
        </section>
        <section>
          <h5 className="font-semibold mb-3">Navigate</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline text-white/90">Home</Link></li>
            <li><Link to="/artist-dashboard" className="hover:underline text-white/90">Dashboard</Link></li>
            <li><Link to="/artist-dashboard/nmd" className="hover:underline text-white/90">NMD Directory</Link></li>
            <li><Link to="/artist-dashboard/training" className="hover:underline text-white/90">Training</Link></li>
            <li><Link to="/sponsor-dashboard" className="hover:underline text-white/90">Sponsor</Link></li>
          </ul>
        </section>
        <section>
          <h5 className="font-semibold mb-3">Legal</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline text-white/90">Terms of Service</a></li>
            <li><a href="#" className="hover:underline text-white/90">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline text-white/90">Cookie Policy</a></li>
          </ul>
        </section>
        <section>
          <h5 className="font-semibold mb-3">Newsletter</h5>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Email address"
              className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
            <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">
              Subscribe
            </button>
          </form>
          <p className="text-xs opacity-70 mt-3">No spam. Unsubscribe anytime.</p>
        </section>
      </div>
      <div className="border-t border-gray-700 py-4">
        <div className="container mx-auto px-4 text-sm text-gray-300">
          © {new Date().getFullYear()} MusicMentor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

