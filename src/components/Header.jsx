import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Wipe the user state
    navigate('/'); // Send them home
  };

  return (
    <header className="border-b border-accent z-50 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 gap-x-4 md:gap-x-8">
        
        {/* Website Logo, Click to Home */}
        <Link to="/" className="font-logo text-accent text-2xl lg:text-4xl font-bold shrink-0 hover:opacity-80">
          Bristol Events
        </Link>

        {/* Search bar */}
        <form role="search" className="hidden sm:flex grow justify-center">
          <div className="w-full max-w-md">
            <input 
              type="search" 
              placeholder="Search events..." 
              className="w-full border border-accent rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-x-3 shrink-0">
          {user ? (
            /* LOGGED IN */
            <>
              <Link to={user.isAdmin ? "/admin" : `/user/${user.name}`} className="font-medium">
                My Account
              </Link>
              <button onClick={handleLogout} className="text-red-500 font-bold">
                Log Out
              </button>
            </>
          ) : (
          /* LOGGED OUT */
          <>
            <Link to="/login" className="px-4 py-2 border rounded-lg">Log In</Link>
            <button className="px-4 py-2 bg-accent text-white rounded-lg">Sign Up</button>
          </>
        )}

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-accent">
            <svg viewBox="0 0 100 80" width="30" height="30" fill="currentColor">
              <rect width="100" height="10" rx="10"></rect>
              <rect y="30" width="100" height="10" rx="10"></rect>
              <rect y="60" width="100" height="10" rx="10"></rect>
            </svg>
          </button>
        </div>

      </div> 
    </header>
  );
}

export default Header;