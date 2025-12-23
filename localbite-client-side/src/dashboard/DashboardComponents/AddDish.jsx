import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import {
  Utensils,
  DollarSign,
  AlertCircle,
  Image as ImageIcon,
  Plus,
  X,
  Save,
} from "lucide-react";
import Loading from "../../components/Loading";

const AddDish = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    ingredients: "",
    allergens: "",
    price: 0,
    isFree: false,
    currency: "BDT",
    unitLabel: "Per Portion",
    dietType: "other",
    availabilityStatus: "available",
    availablePortions: 1,
    coverPhotoUrl: "",
    photos: [],
    cuisine: "",
    tags: "",
    readyInMinutes: 0,
    deliveryTimeLabel: "",
    locationLabel: "",
    fulfillmentOptions: {
      pickup: true,
      delivery: false,
    },
  });

  // Fetch user data to get MongoDB _id (cookId)
  useEffect(() => {
    if (!user?.uid) return;

    axios
      .get(`http://localhost:3000/users/${user.uid}`)
      .then((res) => {
        setUserData(res.data.users);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "pickup" || name === "delivery") {
      setFormData({
        ...formData,
        fulfillmentOptions: {
          ...formData.fulfillmentOptions,
          [name]: checked,
        },
      });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?._id) {
      alert("User data not loaded. Please try again.");
      return;
    }

    setLoading(true);
    try {
      // Process ingredients and allergens arrays
      const ingredients = formData.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);
      const allergens = formData.allergens
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a);
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      // Prepare photos array
      const photos = formData.coverPhotoUrl
        ? [{ url: formData.coverPhotoUrl, caption: "" }]
        : [];

      const payload = {
        ...formData,
        cookId: userData._id,
        ingredients,
        allergens,
        tags,
        photos,
        availablePortions: parseInt(formData.availablePortions) || 1,
        readyInMinutes: parseInt(formData.readyInMinutes) || 0,
      };

      await axios.post("http://localhost:3000/meals", payload);
      alert("Meal added successfully!");
      navigate("/dashboard/my-dishes");
    } catch (error) {
      console.error("Failed to add meal:", error);
      alert("Failed to add meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral">Add New Dish</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share your homemade meal with the community
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold text-neutral flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meal Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Homemade Biryani"
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Short Description *
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  required
                  placeholder="A brief description (max 180 characters)"
                  maxLength={180}
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.shortDescription.length}/180 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of your meal"
                  maxLength={1500}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.description.length}/1500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cover Photo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="coverPhotoUrl"
                    value={formData.coverPhotoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                  <ImageIcon className="w-5 h-5 text-muted-foreground self-center" />
                </div>
              </div>
            </div>

            {/* Food Details */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold text-neutral flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Food Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ingredients *
                </label>
                <input
                  type="text"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  required
                  placeholder="Comma separated: rice, chicken, spices, onions"
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Allergens
                </label>
                <input
                  type="text"
                  name="allergens"
                  value={formData.allergens}
                  onChange={handleChange}
                  placeholder="Comma separated: nuts, dairy, gluten"
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Diet Type *
                </label>
                <select
                  name="dietType"
                  value={formData.dietType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non_veg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="halal">Halal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cuisine
                </label>
                <input
                  type="text"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  placeholder="e.g., Bengali, Indian, Italian"
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Comma separated: spicy, comfort-food, traditional"
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold text-neutral flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Pricing
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFree"
                  id="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="isFree" className="text-sm font-medium text-foreground">
                  This meal is free
                </label>
              </div>

              {!formData.isFree && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Price *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required={!formData.isFree}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="flex-1 px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                      />
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                      >
                        <option value="BDT">BDT</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Unit Label
                    </label>
                    <input
                      type="text"
                      name="unitLabel"
                      value={formData.unitLabel}
                      onChange={handleChange}
                      placeholder="e.g., Per Portion, Per Serving"
                      className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Availability */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold text-neutral flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Availability
              </h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Availability Status *
                </label>
                <select
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <option value="available">Available</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Available Portions *
                </label>
                <input
                  type="number"
                  name="availablePortions"
                  value={formData.availablePortions}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="1"
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ready In (Minutes)
                </label>
                <input
                  type="number"
                  name="readyInMinutes"
                  value={formData.readyInMinutes}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Delivery Time Label
                </label>
                <input
                  type="text"
                  name="deliveryTimeLabel"
                  value={formData.deliveryTimeLabel}
                  onChange={handleChange}
                  placeholder="e.g., Pickup within 2 hours"
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location Label
                </label>
                <input
                  type="text"
                  name="locationLabel"
                  value={formData.locationLabel}
                  onChange={handleChange}
                  placeholder="e.g., Dhanmondi, Dhaka"
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Fulfillment Options */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold text-neutral">
                Fulfillment Options
              </h2>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="pickup"
                    id="pickup"
                    checked={formData.fulfillmentOptions.pickup}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <label htmlFor="pickup" className="text-sm font-medium text-foreground">
                    Pickup Available
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="delivery"
                    id="delivery"
                    checked={formData.fulfillmentOptions.delivery}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <label htmlFor="delivery" className="text-sm font-medium text-foreground">
                    Delivery Available
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Add Meal</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-dishes")}
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted-foreground/10 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDish;
