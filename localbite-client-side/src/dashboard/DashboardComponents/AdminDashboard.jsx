import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import useUserRole from "../../hooks/useUserRole";
import Loading from "../../components/Loading";
import {
  Shield,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  TrendingUp,
  Eye,
  DollarSign,
  Package,
  MessageSquare,
  ShieldCheck,
  Bell,
  Activity,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({
    pendingRequests: 0,
    totalUsers: 0,
    todayVisitors: 0,
    revenue: 0,
    activeReports: 0,
    approvedToday: 0,
  });

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch verification requests
      const verifyRes = await axios.get("http://localhost:3000/api/verify");
      const pendingRequests = verifyRes.data.filter(
        (r) => r.status === "pending"
      ).length;
      const approvedToday = verifyRes.data.filter((r) => {
        const today = new Date().toDateString();
        return (
          r.status === "approved" &&
          new Date(r.updatedAt).toDateString() === today
        );
      }).length;

      // Fetch users
      const usersRes = await axios.get("http://localhost:3000/users");

      setAdminStats({
        pendingRequests,
        totalUsers: Array.isArray(usersRes.data.users) ? usersRes.data.users.length : 0,
        todayVisitors: Math.floor(Math.random() * 100) + 150, // Mock data
        revenue: 12500, // Mock data
        activeReports: 3, // Mock data
        approvedToday,
      });
    } catch (error) {
      console.error("Failed to load admin stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const adminCards = [
    {
      title: "Verification Requests",
      value: adminStats.pendingRequests,
      icon: <ShieldCheck className="w-6 h-6" />,
      color: "bg-warning/10 text-warning",
      href: "/admin/verify",
      description: `${adminStats.approvedToday} approved today`,
    },
    {
      title: "Total Users",
      value: adminStats.totalUsers,
      icon: <Users className="w-6 h-6" />,
      color: "bg-primary/10 text-primary",
      href: "/admin/users",
      description: "Manage user accounts",
    },
    {
      title: "Today's Visitors",
      value: adminStats.todayVisitors.toLocaleString(),
      icon: <Eye className="w-6 h-6" />,
      color: "bg-success/10 text-success",
      description: "Platform activity",
    },
    {
      title: "Revenue",
      value: `$${adminStats.revenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-accent/10 text-accent",
      description: "This month",
    },
    {
      title: "Active Reports",
      value: adminStats.activeReports,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "bg-error/10 text-error",
      href: "/admin/reports",
      description: "Require attention",
    },
    {
      title: "Platform Health",
      value: "Excellent",
      icon: <Activity className="w-6 h-6" />,
      color: "bg-secondary/10 text-secondary",
      description: "All systems operational",
    },
  ];

  const quickActions = [
    {
      title: "View All Requests",
      icon: <Shield className="w-5 h-5" />,
      href: "/dashboard/verify-request",
      description: "Review pending verifications",
    },
    {
      title: "User Management",
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/users",
      description: "Manage all user accounts",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "Verification approved",
      time: "10 minutes ago",
      icon: <CheckCircle className="w-4 h-4 text-success" />,
    },
    {
      id: 2,
      user: "Sarah Johnson",
      action: "Reported content",
      time: "25 minutes ago",
      icon: <AlertTriangle className="w-4 h-4 text-warning" />,
    },
    {
      id: 3,
      user: "Mike Chen",
      action: "New registration",
      time: "1 hour ago",
      icon: <Users className="w-4 h-4 text-primary" />,
    },
    {
      id: 4,
      user: "Emma Wilson",
      action: "Account suspended",
      time: "2 hours ago",
      icon: <Shield className="w-4 h-4 text-error" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.displayName || "Admin"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="px-3 py-1.5 bg-success/10 text-success rounded-full font-medium">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              All systems operational
            </span>
          </div>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <div
            key={index}
            className={`bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${
              card.href ? "cursor-pointer hover:border-primary/30" : ""
            }`}
            onClick={() => card.href && (window.location.href = card.href)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {card.value}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="group bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Recent Activity
            </h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <div className="p-2 bg-muted rounded-lg">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {activity.user}
                      <span className="font-normal text-muted-foreground ml-1">
                        {activity.action}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
              <a
                href="/admin/activity"
                className="block p-4 text-center text-sm text-primary hover:bg-muted/30 transition-colors font-medium"
              >
                View All Activity →
              </a>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Platform Status */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Platform Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  API Response Time
                </span>
                <span className="text-sm font-medium text-success">48ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <span className="text-sm font-medium text-success">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Sessions
                </span>
                <span className="text-sm font-medium text-primary">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Error Rate
                </span>
                <span className="text-sm font-medium text-warning">0.2%</span>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">
                Pending Tasks
              </h3>
              <span className="px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium">
                {adminStats.pendingRequests}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Verification Requests
                </span>
                <span className="font-medium">
                  {adminStats.pendingRequests}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">User Reports</span>
                <span className="font-medium">{adminStats.activeReports}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Support Tickets</span>
                <span className="font-medium">12</span>
              </div>
            </div>
            <a
              href="/admin/tasks"
              className="block w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-center font-medium hover:bg-primary-hover transition-colors"
            >
              View All Tasks
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
