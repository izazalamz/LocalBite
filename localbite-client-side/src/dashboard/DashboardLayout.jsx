import { useState, useEffect, useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  Users,
  Settings,
  User,
  LogOut,
  ChevronDown,
  PlusSquare,
  BarChart3,
  Star,
  ShieldCheck,
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import Loading from "../components/Loading";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { user, signOutUser, loading } = useContext(AuthContext);
  const { role, loading: roleLoading } = useUserRole();
  const [userData, setUserData] = useState({});

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? "bg-primary/10 text-primary border-l-4 border-primary"
        : "hover:bg-muted text-foreground/80"
    }`;

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/login");
  };

  // Auth protection
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  // Role protection
  useEffect(() => {
    if (!roleLoading && role && !["cook", "foodie", "admin"].includes(role)) {
      navigate("/");
    }
  }, [role, roleLoading, navigate]);

  // Fetch user profile
  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/${user.uid}`);
        // Handle both user and users for backward compatibility
        setUserData(res.data.user || res.data.users || {});
      } catch (err) {
        // If user doesn't exist in database, try to create them
        if (err.response?.status === 404 && user.email) {
          console.warn("User not found in database, attempting to create...");
          try {
            // Try to create user with basic info from Firebase
            const createRes = await axios.post("http://localhost:3000/users", {
              fullName: user.displayName || user.email.split("@")[0],
              email: user.email,
              role: "foodie", // Default role
              uid: user.uid,
            });
            setUserData(createRes.data.user || createRes.data.users || {});
          } catch (createErr) {
            console.error("Failed to create user:", createErr);
            // Set empty user data so dashboard can still work
            setUserData({ fullName: user.displayName || user.email });
          }
        } else {
          console.error("Failed to load user data:", err);
          // Set basic user data from Firebase so dashboard can still work
          setUserData({ fullName: user.displayName || user.email });
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (loading || roleLoading || !user) return <Loading />;
  if (!["cook", "foodie", "admin"].includes(role)) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left */}
          <div className="flex items-center gap-4 ">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-muted z-50"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>

            <NavLink to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
                LB
              </div>
              <div>
                <h1 className="text-xl font-bold">LocalBite</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </NavLink>
          </div>

          {/* Right */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <User />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{userData?.fullName}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {role}
                </p>
              </div>
              <ChevronDown
                className={`transition ${userDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow z-50">
                <NavLink
                  to="/dashboard/profile"
                  className="flex gap-3 px-4 py-3 hover:bg-muted"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <User size={18} /> Profile
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="flex gap-3 px-4 py-3 text-error hover:bg-muted w-full"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0  w-64 bg-card border-r border-border p-6 min-h-screen
            transform transition-transform duration-300 ease-in-out
            z-40
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:relative md:translate-x-0 md:z-20
          `}
        >
          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              end
              className={linkClasses}
              onClick={closeSidebar}
            >
              <LayoutDashboard /> Dashboard
            </NavLink>

            {(role === "foodie" || role === "admin") && (
              <NavLink
                to="/dashboard/my-orders"
                className={linkClasses}
                onClick={closeSidebar}
              >
                <ShoppingBag /> My Orders
              </NavLink>
            )}

            {(role === "cook" || role === "admin") && (
              <>
                <NavLink
                  to="/dashboard/my-dishes"
                  className={linkClasses}
                  onClick={closeSidebar}
                >
                  <Utensils /> My Dishes
                </NavLink>
                <NavLink
                  to="/dashboard/add-dish"
                  className={linkClasses}
                  onClick={closeSidebar}
                >
                  <PlusSquare /> Add Dish
                </NavLink>
                <NavLink
                  to="/dashboard/orders"
                  className={linkClasses}
                  onClick={closeSidebar}
                >
                  <ShoppingBag /> Orders
                </NavLink>
              </>
            )}

            {/* Reviews - Available to all authenticated users */}
            <NavLink
              to="/dashboard/cooksreview"
              className={linkClasses}
              onClick={closeSidebar}
            >
              <Star /> Reviews
            </NavLink>

            {/* Insights - Visible to all dashboard users */}
            <NavLink
              to="/dashboard/insights"
              className={linkClasses}
              onClick={closeSidebar}
            >
              <BarChart3 /> Insights
            </NavLink>

            {/* Verification */}
            <NavLink
              to="/dashboard/verify"
              className={linkClasses}
              onClick={closeSidebar}
            >
              <ShieldCheck /> Verify
            </NavLink>

            {role === "admin" && (
              <NavLink
                to="/dashboard/users"
                className={linkClasses}
                onClick={closeSidebar}
              >
                <Users /> All Users
              </NavLink>
            )}

            <NavLink
              to="/dashboard/profile"
              className={linkClasses}
              onClick={closeSidebar}
            >
              <User /> My Profile
            </NavLink>
          </nav>

          <div className="mt-8 pt-6 border-t border-border">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 text-error w-full px-3 py-2 rounded-lg hover:bg-muted"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 overflow-x-hidden">
          <div className="bg-card border border-border rounded-xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
