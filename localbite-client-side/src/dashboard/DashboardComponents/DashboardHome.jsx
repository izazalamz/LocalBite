import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import useUserRole from "../../hooks/useUserRole";
import Loading from "../../components/Loading";
import {
  DollarSign,
  ShoppingBag,
  Star,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";
import AdminDashboard from "./AdminDashboard";

const StatsCard = ({ title, value, icon: Icon, color = "bg-primary" }) => (
  <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 shadow-sm">
    <div
      className={`w-12 h-12 rounded-lg ${color}/10 flex items-center justify-center text-${color.replace(
        "bg-",
        ""
      )}`}
    >
      <Icon size={24} className={color.replace("bg-", "text-")} />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold text-neutral">{value}</h3>
    </div>
  </div>
);

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const { role } = useUserRole();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !role) return;

    // Foodie dashboard
    if (role === "foodie") {
      setLoading(false);
      return;
    }

    // Admin dashboard
    if (role === "admin") {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        // Get user _id first
        const userRes = await axios.get(
          `http://localhost:3000/users/${user.uid}`
        );
        // Handle both user and users for backward compatibility
        const userData = userRes.data.user || userRes.data.users;
        if (!userData || !userData._id) {
          throw new Error("User data not found");
        }
        const cookId = userData._id;

        const statsRes = await axios.get(
          `http://localhost:3000/api/stats/cook/${cookId}`
        );
        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to load stats", err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    // Cook dashboard → fetch stats
    if (role === "cook") {
      fetchStats();
    }
  }, [user, role]);

  if (loading) return <Loading />;

  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "foodie") {
    // Simple welcome for now
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral">
          Welcome back, {user?.displayName || "Foodie"}!
        </h1>
        <p className="text-muted-foreground">
          Ready to discover your next delicious meal?
        </p>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-primary mb-2">Hungry?</h3>
          <p className="text-neutral/80 mb-4">
            Explore local kitchens around you and support home cooks.
          </p>
          <a
            href="/all-foods"
            className="inline-block px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            Browse Meals
          </a>
        </div>
      </div>
    );
  }

  if (!stats)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard data.</p>
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral">
          Welcome back, {user?.displayName || "Chef"}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening in your kitchen today.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-6">
          <h3 className="text-xl font-bold text-primary mb-2">
            Ready to cook up a storm?
          </h3>
          <p className="text-neutral/80 mb-4">
            Add your latest culinary creation and share it with food lovers
            nearby.
          </p>
          <a
            href="/dashboard/add-dish"
            className="inline-block px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            Add New Dish
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Orders"
          value={stats.activeOrdersCount}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatsCard
          title="Pending Requests"
          value={stats.pendingRequestsCount}
          icon={Clock}
          color="bg-orange-500"
        />
        <StatsCard
          title="Total Earnings"
          value={`৳${stats.totalEarnings}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatsCard
          title="Average Rating"
          value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "N/A"}
          icon={Star}
          color="bg-yellow-500"
        />
      </div>

      {/* Recent Activity / Insights Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions or Activity Feed can go here */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-primary" />
            <h3 className="text-lg font-bold text-neutral">Kitchen Status</h3>
          </div>
          <p className="text-sm text-neutral/70 mb-4">
            Your kitchen is currently <strong>Open</strong> for orders.
          </p>
          {/* Toggle logic can be added later */}
          <button className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
            Change Status
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-success" />
            <h3 className="text-lg font-bold text-neutral">Performance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Orders Completed</span>
              <span className="font-medium">{stats.completedOrdersCount}</span>
            </div>
            {/* More stats can be added */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
