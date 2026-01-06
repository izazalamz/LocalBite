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
  Star,
} from "lucide-react";
import Loading from "../../components/Loading";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch user data to get MongoDB _id (foodieId)
  useEffect(() => {
    if (!user?.uid) return;

    axios
      .get(`http://localhost:3000/users/${user.uid}`)
      .then((res) => {
        // Handle both user and users for backward compatibility
        const userData = res.data.user || res.data.users;
        setUserData(userData);
        if (userData?._id) {
          fetchOrders(userData._id);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        setLoading(false);
      });
  }, [user]);

  // Fetch orders for the foodie
  const fetchOrders = async (foodieId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/orders/foodie/${foodieId}`
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
      await axios.post(
        `http://localhost:3000/orders/${orderId}/foodie/confirm`
      );
      if (userData?._id) {
        fetchOrders(userData._id);
      }
      alert("Order confirmed successfully!");
    } catch (error) {
      console.error("Failed to confirm order:", error);
      alert(error.response?.data?.message || "Failed to confirm order");
    }
  };

  // Submit review for completed order
  const handleReview = (order) => {
    setSelectedOrder(order);
    setReviewRating(0);
    setReviewComment("");
    setReviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      alert("Please select a rating");
      return;
    }

    if (!user?.uid) {
      alert("You must be logged in to review");
      return;
    }

    try {
      setSubmittingReview(true);
      await axios.post("http://localhost:3000/reviews", {
        orderId: selectedOrder._id,
        rating: reviewRating,
        comment: reviewComment.trim(),
        uid: user.uid,
      });

      alert("Review submitted successfully!");
      setReviewModalOpen(false);
      setSelectedOrder(null);
      setReviewRating(0);
      setReviewComment("");

      // Refresh orders
      if (userData?._id) {
        fetchOrders(userData._id);
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert(
        error.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // Cancel order
  const handleCancel = async (orderId) => {
    const reason = window.prompt("Please provide a reason for cancellation:");
    if (!reason) return;

    try {
      await axios.post(
        `http://localhost:3000/orders/${orderId}/foodie/cancel`,
        {
          reason,
        }
      );
      if (userData?._id) {
        fetchOrders(userData._id);
      }
      alert("Order cancelled successfully!");
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      requested: { label: "Requested", color: "bg-info text-white" },
      cook_confirmed: {
        label: "Cook Confirmed",
        color: "bg-primary text-white",
      },
      foodie_confirmed: {
        label: "You Confirmed",
        color: "bg-primary text-white",
      },
      confirmed: { label: "Confirmed", color: "bg-success text-white" },
      cook_cancelled: {
        label: "Cancelled by Cook",
        color: "bg-error text-white",
      },
      foodie_cancelled: {
        label: "Cancelled by You",
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

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage your meal orders
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No orders yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Browse meals and place your first order!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
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
                        Order Code:{" "}
                        <span className="font-mono">{order.orderCode}</span>
                      </p>
                    </div>
                  </div>

                  {/* Order Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4 text-primary" />
                        <span>
                          Cook:{" "}
                          <span className="font-medium text-foreground">
                            {order.cookId?.fullName || "Unknown"}
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
                          <span>
                            Confirmed: {formatDate(order.confirmedAt)}
                          </span>
                        </div>
                      )}
                      {order.completedAt && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-success" />
                          <span>
                            Completed: {formatDate(order.completedAt)}
                          </span>
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
                        : `${
                            (order.mealSnapshot?.price || 0) * order.quantity
                          } ${order.mealSnapshot?.currency || "BDT"}`}
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
                    {order.status === "cook_confirmed" && (
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
                    {["cook_cancelled", "foodie_cancelled"].includes(
                      order.status
                    ) && (
                      <div className="flex items-center gap-2 text-sm text-error">
                        <AlertCircle className="w-4 h-4" />
                        <span>
                          {order.cancelInfo?.reason || "Order was cancelled"}
                        </span>
                      </div>
                    )}
                    {order.status === "confirmed" && (
                      <div className="flex items-center gap-2 text-sm text-success">
                        <Check className="w-4 h-4" />
                        <span>Order confirmed! Waiting for completion.</span>
                      </div>
                    )}
                    {order.status === "completed" && (
                      <div className="flex items-center gap-2">
                        {order.hasReview ? (
                          <div className="flex items-center gap-2 text-sm text-success">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            <span>Reviewed</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleReview(order)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                          >
                            <Star className="w-4 h-4" />
                            Review Meal
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-neutral">Review Meal</h3>
              <button
                onClick={() => {
                  setReviewModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="font-medium text-foreground mb-2">
                {selectedOrder.mealSnapshot?.name || "Meal"}
              </p>
              <p className="text-sm text-muted-foreground">
                Order Code: {selectedOrder.orderCode}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rating *
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <option value={0}>Select Rating</option>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r} Star{r > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Review (Optional)
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitReview}
                  disabled={submittingReview || !reviewRating}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  onClick={() => {
                    setReviewModalOpen(false);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
