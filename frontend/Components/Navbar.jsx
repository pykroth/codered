import { useState, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    navigate('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">🩺 MedLens</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && user ? (
              <>
                <a href="/profile" className="text-sm text-gray-700 hover:text-black transition font-medium">
                  {user.email}
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-black hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg transition font-medium">
                  Login
                </a>
                <a href="/login?mode=signup" className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition font-semibold">
            Sign Up
            </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-200">
            {!loading && user ? (
              <>
                <a href="/profile" className="px-4 py-2 text-sm text-gray-700 hover:text-black border-b border-gray-200 transition font-medium">
                  {user.email}
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 bg-black hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="block text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg transition font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </a>
              <a href="/login?mode=signup" className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition font-semibold">
                Sign Up
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;