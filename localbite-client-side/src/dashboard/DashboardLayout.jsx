import { useState, useEffect, useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  Users,
  BarChart3,
  Settings,
  User,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  HelpCircle,
  PlusSquare,
  Store,
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

  console.log("this is role", role);

  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
      ? "bg-primary/10 text-primary border-l-4 border-primary"
      : "hover:bg-muted text-foreground/80"
    }`;

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/login");
  };

  // Protect route - only allow authenticated users
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  // Protect route - only allow cook or foodie roles to access dashboard
  useEffect(() => {
    if (!roleLoading && role && !["cook", "foodie"].includes(role)) {
      navigate("/");
    }
  }, [role, roleLoading, navigate]);

  // Fetch user profile
  useEffect(() => {
    if (!user?.uid) return;

    axios
      .get(`http://localhost:3000/users/${user.uid}`)
      .then((res) => setUserData(res.data.user))
      .catch(() => setError("Failed to load user data"));
  }, [user]);

  if (loading || roleLoading || !user) return <Loading />;

  // Don't render dashboard if user is not a cook or foodie
  if (!["cook", "foodie"].includes(role)) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-muted"
            >
              <Menu />
            </button>

            <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
                LB
              </div>
              <div>
                <h1 className="text-xl font-bold">LocalBite</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </NavLink>

            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                placeholder="Search dishes, cooks..."
                className="pl-10 pr-4 py-2 w-64 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-muted relative">
              <Bell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>

            {/* User dropdown */}
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
                  className={`transition ${userDropdownOpen && "rotate-180"}`}
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
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative z-40 w-64 bg-card border-r border-border p-6 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            }`}
        >
          <nav className="space-y-2">
            <NavLink to="/dashboard" end className={linkClasses}>
              <LayoutDashboard /> Dashboard
            </NavLink>

            {role === "foodie" && (
              <>
                <NavLink to="/dashboard/my-orders" className={linkClasses}>
                  <ShoppingBag /> My Orders
                </NavLink>
                <NavLink to="/dashboard/community" className={linkClasses}>
                  <Users /> Community
                </NavLink>
              </>
            )}

            {role === "cook" && (
              <>
                <NavLink to="/dashboard/my-dishes" className={linkClasses}>
                  <Utensils /> My Dishes
                </NavLink>
                <NavLink to="/dashboard/add-dish" className={linkClasses}>
                  <PlusSquare /> Add Dish
                </NavLink>
                <NavLink to="/dashboard/orders" className={linkClasses}>
                  <ShoppingBag /> Orders
                </NavLink>
              </>
            )}

            {role === "admin" && (
              <>
                <NavLink to="/dashboard/users" className={linkClasses}>
                  <Users /> All Users
                </NavLink>
                <NavLink to="/dashboard/analytics" className={linkClasses}>
                  <BarChart3 /> Analytics
                </NavLink>
                <NavLink to="/dashboard/manage" className={linkClasses}>
                  <Settings /> Manage Platform
                </NavLink>
              </>
            )}

            <NavLink to="/dashboard/profile" className={linkClasses}>
              <User /> My Profile
            </NavLink>
          </nav>

          {/* Help */}
          <div className="mt-8 p-4 bg-primary/5 rounded-lg">
            <div className="flex gap-3">
              <HelpCircle className="text-primary" />
              <div>
                <p className="text-sm font-medium">Need help?</p>
                <p className="text-xs text-muted-foreground">
                  Contact LocalBite support
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
