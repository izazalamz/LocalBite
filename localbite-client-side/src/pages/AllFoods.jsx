import React, { useState, useEffect, useContext } from "react";
import { Clock, MapPin, User, X, ShoppingCart, Utensils, Star } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import Loading from "../components/Loading";

const AllFoods = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    fulfillmentType: "pickup",
    pickupDetails: {
      pickupNote: "",
    },
    deliveryDetails: {
      addressLabel: "",
      addressText: "",
      deliveryNote: "",
    },
  });
  const [userData, setUserData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch meals
  useEffect(() => {
    fetchMeals();
  }, []);

  // Fetch user data if logged in
  useEffect(() => {
    if (user?.uid) {
      axios
        .get(`http://localhost:3000/users/${user.uid}`)
        .then((res) => {
          setUserData(res.data.users);
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err);
        });
    }
  }, [user]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/meals?availability=available"
      );
      setMeals(response.data);
    } catch (error) {
      console.error("Failed to fetch meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (meal) => {
    setSelectedMeal(meal);
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
  };

  const handleOrderClick = (meal) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!userData) {
      alert("Please wait, loading user data...");
      return;
    }
    setSelectedMeal(meal);
    setOrderModalOpen(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!userData?._id || !selectedMeal) return;

    setSubmitting(true);
    try {
      const payload = {
        mealId: selectedMeal._id,
        foodieId: userData._id,
        quantity: parseInt(orderForm.quantity),
        fulfillmentType: orderForm.fulfillmentType,
        pickupDetails:
          orderForm.fulfillmentType === "pickup"
            ? orderForm.pickupDetails
            : undefined,
        deliveryDetails:
          orderForm.fulfillmentType === "delivery"
            ? orderForm.deliveryDetails
            : undefined,
      };

      await axios.post("http://localhost:3000/orders", payload);
      alert("Order requested successfully! Check your orders in the dashboard.");
      setOrderModalOpen(false);
      setSelectedMeal(null);
      setOrderForm({
        quantity: 1,
        fulfillmentType: "pickup",
        pickupDetails: { pickupNote: "" },
        deliveryDetails: { addressLabel: "", addressText: "", deliveryNote: "" },
      });
    } catch (error) {
      console.error("Failed to create order:", error);
      alert(
        error.response?.data?.message ||
          "Failed to create order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (meal) => {
    if (meal.isFree) return "Free";
    return `${meal.price} ${meal.currency || "BDT"}`;
  };

  const getDietTypeLabel = (dietType) => {
    const labels = {
      veg: "Vegetarian",
      non_veg: "Non-Vegetarian",
      vegan: "Vegan",
      halal: "Halal",
      other: "Other",
    };
    return labels[dietType] || dietType;
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-background py-8 pt-20">
      <div className="fix-alignment">
        {/* Header Section */}
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral">
            All Foods
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Discover homemade meals shared by your neighbors. Click on any meal
            to see full details and place an order.
          </p>
        </div>

        {/* Food Cards Grid */}
        {meals.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No meals available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meals.map((meal) => (
              <div
                key={meal._id}
                className="card border border-border bg-card shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
                onClick={() => handleCardClick(meal)}
              >
                {/* Food Image */}
                <figure className="relative h-48 overflow-hidden bg-muted">
                  {meal.coverPhotoUrl ? (
                    <img
                      src={meal.coverPhotoUrl}
                      alt={meal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Utensils className="w-12 h-12" />
                    </div>
                  )}
                  {/* Available Badge */}
                  {meal.availablePortions > 0 && (
                    <div className="absolute top-3 right-3 bg-success/90 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {meal.availablePortions} Available
                    </div>
                  )}
                </figure>

                {/* Card Body */}
                <div className="card-body p-4 space-y-3">
                  {/* Delivery Time */}
                  {meal.deliveryTimeLabel && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{meal.deliveryTimeLabel}</span>
                    </div>
                  )}

                  {/* Food Name */}
                  <h3 className="text-lg font-bold text-neutral line-clamp-1">
                    {meal.name}
                  </h3>

                  {/* Short Description */}
                  {meal.shortDescription && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {meal.shortDescription}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(meal)}
                    </span>
                    {!meal.isFree && (
                      <span className="text-xs text-muted-foreground">
                        {meal.unitLabel || "Per Portion"}
                      </span>
                    )}
                  </div>

                  {/* Cook Info */}
                  {meal.cookId && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">
                          {meal.cookId.fullName || "Cook"}
                        </span>
                        {meal.cookId.isVerified && (
                          <span className="text-primary text-[10px] font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      {meal.avgMealRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-warning fill-warning" />
                          <span className="font-medium text-foreground">
                            {meal.avgMealRating.toFixed(1)}
                          </span>
                          {meal.mealRatingCount > 0 && (
                            <span className="text-muted-foreground">
                              ({meal.mealRatingCount})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Order Button */}
                  <button
                    className="btn-primary w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderClick(meal);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Food Details */}
        {selectedMeal && !orderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border">
              {/* Modal Header */}
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between z-10">
                <h2 className="text-2xl font-bold text-neutral pr-4">
                  {selectedMeal.name}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="btn btn-ghost btn-circle btn-sm"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Food Image */}
                <figure className="w-full h-64 rounded-2xl overflow-hidden bg-muted">
                  {selectedMeal.coverPhotoUrl ? (
                    <img
                      src={selectedMeal.coverPhotoUrl}
                      alt={selectedMeal.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Utensils className="w-16 h-16" />
                    </div>
                  )}
                </figure>

                {/* Full Description */}
                {selectedMeal.description && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral">
                      Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedMeal.description}
                    </p>
                  </div>
                )}

                {/* Ingredients */}
                {selectedMeal.ingredients && selectedMeal.ingredients.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral">
                      Ingredients
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedMeal.ingredients.join(", ")}
                    </p>
                  </div>
                )}

                {/* Allergens */}
                {selectedMeal.allergens && selectedMeal.allergens.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral">
                      Allergens
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedMeal.allergens.join(", ")}
                    </p>
                  </div>
                )}

                {/* Food Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    {selectedMeal.deliveryTimeLabel && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          {selectedMeal.deliveryTimeLabel}
                        </span>
                      </div>
                    )}
                    {selectedMeal.locationLabel && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm">{selectedMeal.locationLabel}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {selectedMeal.cookId && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          {selectedMeal.cookId.fullName || "Cook"}
                        </span>
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="text-muted-foreground">Available: </span>
                      <span className="font-semibold text-success">
                        {selectedMeal.availablePortions} portions
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Diet Type: </span>
                      <span className="font-semibold">
                        {getDietTypeLabel(selectedMeal.dietType)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="flex items-baseline gap-3 pt-4 border-t border-border">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(selectedMeal)}
                  </span>
                  {!selectedMeal.isFree && (
                    <span className="text-sm text-muted-foreground">
                      {selectedMeal.unitLabel || "Per Portion"}
                    </span>
                  )}
                </div>

                {/* Order Button */}
                <button
                  className="btn-primary w-full text-lg py-3"
                  onClick={() => {
                    handleOrderClick(selectedMeal);
                  }}
                >
                  <ShoppingCart className="w-5 h-5 inline mr-2" />
                  Order Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Request Modal */}
        {orderModalOpen && selectedMeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border">
              {/* Modal Header */}
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between z-10">
                <h2 className="text-2xl font-bold text-neutral pr-4">
                  Request Order: {selectedMeal.name}
                </h2>
                <button
                  onClick={() => {
                    setOrderModalOpen(false);
                    setSelectedMeal(null);
                  }}
                  className="btn btn-ghost btn-circle btn-sm"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Order Form */}
              <form onSubmit={handleOrderSubmit} className="p-6 space-y-6">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedMeal.availablePortions}
                    value={orderForm.quantity}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {selectedMeal.availablePortions} portions
                  </p>
                </div>

                {/* Fulfillment Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Fulfillment Type *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fulfillmentType"
                        value="pickup"
                        checked={orderForm.fulfillmentType === "pickup"}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            fulfillmentType: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span>Pickup</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fulfillmentType"
                        value="delivery"
                        checked={orderForm.fulfillmentType === "delivery"}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            fulfillmentType: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span>Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Pickup Details */}
                {orderForm.fulfillmentType === "pickup" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pickup Note (Optional)
                    </label>
                    <textarea
                      value={orderForm.pickupDetails.pickupNote}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          pickupDetails: {
                            ...orderForm.pickupDetails,
                            pickupNote: e.target.value,
                          },
                        })
                      }
                      placeholder="Any special instructions for pickup..."
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                )}

                {/* Delivery Details */}
                {orderForm.fulfillmentType === "delivery" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Address Label *
                      </label>
                      <input
                        type="text"
                        value={orderForm.deliveryDetails.addressLabel}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            deliveryDetails: {
                              ...orderForm.deliveryDetails,
                              addressLabel: e.target.value,
                            },
                          })
                        }
                        required={orderForm.fulfillmentType === "delivery"}
                        placeholder="e.g., Home, Office"
                        className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Address *
                      </label>
                      <textarea
                        value={orderForm.deliveryDetails.addressText}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            deliveryDetails: {
                              ...orderForm.deliveryDetails,
                              addressText: e.target.value,
                            },
                          })
                        }
                        required={orderForm.fulfillmentType === "delivery"}
                        placeholder="Enter your full delivery address..."
                        rows="3"
                        className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Delivery Note (Optional)
                      </label>
                      <textarea
                        value={orderForm.deliveryDetails.deliveryNote}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            deliveryDetails: {
                              ...orderForm.deliveryDetails,
                              deliveryNote: e.target.value,
                            },
                          })
                        }
                        placeholder="Any special instructions for delivery..."
                        rows="2"
                        className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Total Price */}
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-neutral">
                      Total Price:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {selectedMeal.isFree
                        ? "Free"
                        : `${selectedMeal.price * orderForm.quantity} ${
                            selectedMeal.currency || "BDT"
                          }`}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderModalOpen(false);
                      setSelectedMeal(null);
                    }}
                    className="flex-1 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted-foreground/10 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Request Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFoods;
