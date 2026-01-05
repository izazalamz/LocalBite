import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import {
  Utensils,
  ShoppingBag,
  Leaf,
  TrendingUp,
  Star,
  Award,
  Users,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatsCard = ({ title, value, icon: Icon, color = "bg-primary" }) => (
  <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 shadow-sm">
    <div
      className={`w-12 h-12 rounded-lg ${color}/10 flex items-center justify-center`}
    >
      <Icon size={24} className={color.replace("bg-", "text-")} />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold text-neutral">{value}</h3>
    </div>
  </div>
);

const Insights = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/stats/dashboard"
        );
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load insights stats", err);
        setError("Failed to load insights");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {error || "Failed to load insights"}
        </p>
      </div>
    );
  }

  // Format monthly orders data for chart
  const formatMonthlyData = () => {
    if (!stats.monthlyOrders || stats.monthlyOrders.length === 0) {
      return [];
    }

    return stats.monthlyOrders.map((item) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthName = monthNames[item._id.m - 1];
      return {
        month: `${monthName} ${item._id.y}`,
        orders: item.count,
      };
    });
  };

  const monthlyData = formatMonthlyData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral flex items-center gap-3">
          <BarChart3 className="text-primary" />
          Insights
        </h1>
        <p className="text-muted-foreground mt-1">
          Discover the impact of our food-sharing community
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Meals Shared"
          value={stats.totalMeals || 0}
          icon={Utensils}
          color="bg-primary"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatsCard
          title="Food Waste Saved"
          value={`${(stats.estimatedWasteSavedKg || 0).toFixed(1)} kg`}
          icon={Leaf}
          color="bg-success"
        />
        <StatsCard
          title="Completed Orders"
          value={stats.totalCompleted || 0}
          icon={TrendingUp}
          color="bg-secondary"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Orders Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-primary" />
            <h3 className="text-lg font-bold text-neutral">
              Monthly Order Trends
            </h3>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgb(229 231 235)"
                />
                <XAxis
                  dataKey="month"
                  stroke="rgb(107 114 128)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="rgb(107 114 128)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid rgb(229 231 235)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="orders"
                  fill="rgb(76 175 80)"
                  radius={[8, 8, 0, 0]}
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>No order data available yet</p>
            </div>
          )}
        </div>

        {/* Line Chart for Trends */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-success" />
            <h3 className="text-lg font-bold text-neutral">Order Growth</h3>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgb(229 231 235)"
                />
                <XAxis
                  dataKey="month"
                  stroke="rgb(107 114 128)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="rgb(107 114 128)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid rgb(229 231 235)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="rgb(76 175 80)"
                  strokeWidth={2}
                  dot={{ fill: "rgb(76 175 80)", r: 4 }}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>No order data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Cooks and Popular Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top-Rated Cooks */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-warning" />
            <h3 className="text-lg font-bold text-neutral">Top-Rated Cooks</h3>
          </div>
          {stats.topCooks && stats.topCooks.length > 0 ? (
            <div className="space-y-4">
              {stats.topCooks.slice(0, 5).map((cook, index) => (
                <div
                  key={cook._id || index}
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-neutral">
                        {cook.fullName || "Unknown Cook"}
                      </p>
                      {cook.isVerified && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-sm text-muted-foreground">
                        {cook.avgCookRating
                          ? cook.avgCookRating.toFixed(1)
                          : "N/A"}{" "}
                        ({cook.cookRatingCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No cooks available yet</p>
            </div>
          )}
        </div>

        {/* Popular Dishes */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Utensils className="text-secondary" />
            <h3 className="text-lg font-bold text-neutral">Popular Dishes</h3>
          </div>
          {stats.popularMeals && stats.popularMeals.length > 0 ? (
            <div className="space-y-4">
              {stats.popularMeals.slice(0, 5).map((meal, index) => (
                <div
                  key={meal.mealId || index}
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                    {index + 1}
                  </div>
                  {meal.coverPhotoUrl && (
                    <img
                      src={meal.coverPhotoUrl}
                      alt={meal.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-neutral">
                      {meal.name || "Unknown Dish"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {meal.orders || 0} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No popular dishes yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Leaf className="text-primary mt-1" size={24} />
          <div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Community Impact
            </h3>
            <p className="text-neutral/80 mb-4">
              Together, we've shared{" "}
              <strong>{stats.totalMeals || 0} meals</strong> and saved
              approximately{" "}
              <strong>
                {(stats.estimatedWasteSavedKg || 0).toFixed(1)} kg
              </strong>{" "}
              of food from going to waste. Every meal shared strengthens our
              local community and promotes sustainable living.
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-primary" size={16} />
                <span className="text-muted-foreground">
                  {stats.totalCompleted || 0} successful orders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-primary" size={16} />
                <span className="text-muted-foreground">
                  {stats.topCooks?.length || 0} active cooks
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
