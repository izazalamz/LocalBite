import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import {
  ShoppingBag,
  Clock,
  MapPin,
  User,
  Check,
  X,
  AlertCircle,
  Utensils,
  Package,
} from "lucide-react";
import Loading from "../../components/Loading";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [filter, setFilter] = useState("all"); // all, requested, confirmed, completed, cancelled

  // Fetch user data to get MongoDB _id (cookId)
  useEffect(() => {
    if (!user?.uid) return;

    axios
      .get(`http://localhost:3000/users/${user.uid}`)
      .then((res) => {
        setUserData(res.data.users);
        if (res.data.users?._id) {
          fetchOrders(res.data.users._id);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        setLoading(false);
      });
  }, [user]);

  // Fetch orders for the cook
  const fetchOrders = async (cookId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/orders/cook/${cookId}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Confirm order
  const handleConfirm = async (orderId) => {
    try {
      await axios.post(`http://localhost:3000/orders/${orderId}/cook/confirm`);
      if (userData?._id) {
        fetchOrders(userData._id);
      }
      alert("Order confirmed successfully!");
    } catch (error) {
      console.error("Failed to confirm order:", error);
      alert(error.response?.data?.message || "Failed to confirm order");
    }
  };

  // Cancel order
  const handleCancel = async (orderId) => {
    const reason = window.prompt("Please provide a reason for cancellation:");
    if (!reason) return;

    try {
      await axios.post(`http://localhost:3000/orders/${orderId}/cook/cancel`, {
        reason,
      });
      if (userData?._id) {
        fetchOrders(userData._id);
      }
      alert("Order cancelled successfully!");
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  // Complete order
  const handleComplete = async (orderId) => {
    try {
      await axios.post(`http://localhost:3000/orders/${orderId}/complete`);
      if (userData?._id) {
        fetchOrders(userData._id);
      }
      alert("Order marked as completed!");
    } catch (error) {
      console.error("Failed to complete order:", error);
      alert(error.response?.data?.message || "Failed to complete order");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      requested: { label: "Requested", color: "bg-info text-white" },
      cook_confirmed: {
        label: "You Confirmed",
        color: "bg-primary text-white",
      },
      foodie_confirmed: {
        label: "Foodie Confirmed",
        color: "bg-primary text-white",
      },
      confirmed: { label: "Confirmed", color: "bg-success text-white" },
      cook_cancelled: {
        label: "Cancelled by You",
        color: "bg-error text-white",
      },
      foodie_cancelled: {
        label: "Cancelled by Foodie",
        color: "bg-error text-white",
      },
      completed: { label: "Completed", color: "bg-success text-white" },
      expired: { label: "Expired", color: "bg-warning text-white" },
    };
    const config = statusConfig[status] || statusConfig.requested;
    return (
      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "requested") return order.status === "requested";
    if (filter === "confirmed")
      return ["cook_confirmed", "foodie_confirmed", "confirmed"].includes(
        order.status
      );
    if (filter === "completed") return order.status === "completed";
    if (filter === "cancelled")
      return ["cook_cancelled", "foodie_cancelled"].includes(order.status);
    return true;
  });

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage incoming meal orders
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
          >
            <option value="all">All Orders</option>
            <option value="requested">Requested</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {orders.length === 0
              ? "No orders yet."
              : "No orders match the selected filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Meal Image */}
                <div className="w-full lg:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {order.mealSnapshot?.coverPhotoUrl ? (
                    <img
                      src={order.mealSnapshot.coverPhotoUrl}
                      alt={order.mealSnapshot.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Utensils className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Order Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl font-bold text-neutral">
                          {order.mealSnapshot?.name || "Meal"}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Order Code: <span className="font-mono">{order.orderCode}</span>
                      </p>
                    </div>
                  </div>

                  {/* Order Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4 text-primary" />
                        <span>
                          Ordered by:{" "}
                          <span className="font-medium text-foreground">
                            {order.foodieId?.fullName || "Unknown"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="w-4 h-4 text-primary" />
                        <span>
                          Quantity:{" "}
                          <span className="font-medium text-foreground">
                            {order.quantity}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          Fulfillment:{" "}
                          <span className="font-medium text-foreground capitalize">
                            {order.fulfillmentType}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Requested: {formatDate(order.requestedAt)}</span>
                      </div>
                      {order.confirmedAt && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-success" />
                          <span>Confirmed: {formatDate(order.confirmedAt)}</span>
                        </div>
                      )}
                      {order.completedAt && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-success" />
                          <span>Completed: {formatDate(order.completedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fulfillment Details */}
                  {order.fulfillmentType === "pickup" &&
                    order.pickupDetails?.pickupNote && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-foreground mb-1">
                          Pickup Note:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.pickupDetails.pickupNote}
                        </p>
                      </div>
                    )}

                  {order.fulfillmentType === "delivery" &&
                    order.deliveryDetails && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-foreground mb-1">
                          Delivery Address:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.deliveryDetails.addressLabel && (
                            <span className="font-medium">
                              {order.deliveryDetails.addressLabel}:{" "}
                            </span>
                          )}
                          {order.deliveryDetails.addressText}
                        </p>
                        {order.deliveryDetails.deliveryNote && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Note: {order.deliveryDetails.deliveryNote}
                          </p>
                        )}
                      </div>
                    )}

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-lg font-semibold text-neutral">
                      Total Price:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {order.mealSnapshot?.price === 0
                        ? "Free"
                        : `${(order.mealSnapshot?.price || 0) * order.quantity} ${
                            order.mealSnapshot?.currency || "BDT"
                          }`}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-border">
                    {order.status === "requested" && (
                      <>
                        <button
                          onClick={() => handleConfirm(order._id)}
                          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Confirm Order
                        </button>
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === "foodie_confirmed" && (
                      <>
                        <button
                          onClick={() => handleConfirm(order._id)}
                          className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Confirm Order
                        </button>
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === "confirmed" && (
                      <button
                        onClick={() => handleComplete(order._id)}
                        className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Mark as Completed
                      </button>
                    )}
                    {["cook_cancelled", "foodie_cancelled"].includes(
                      order.status
                    ) && (
                      <div className="flex items-center gap-2 text-sm text-error">
                        <AlertCircle className="w-4 h-4" />
                        <span>
                          {order.cancelInfo?.reason ||
                            "Order was cancelled"}
                        </span>
                      </div>
                    )}
                    {order.status === "completed" && (
                      <div className="flex items-center gap-2 text-sm text-success">
                        <Check className="w-4 h-4" />
                        <span>Order completed!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
