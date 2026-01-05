import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  X,
  Check,
  Clock,
  DollarSign,
  Utensils,
  AlertCircle,
} from "lucide-react";
import Loading from "../../components/Loading";

const MyDishes = () => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dietFilter, setDietFilter] = useState("all");
  const [editingMeal, setEditingMeal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [userData, setUserData] = useState(null);

  // Fetch user data to get MongoDB _id (cookId)
  useEffect(() => {
    if (!user?.uid) return;

    axios
      .get(`http://localhost:3000/users/${user.uid}`)
      .then((res) => {
        setUserData(res.data.users);
        if (res.data.users?._id) {
          fetchMeals(res.data.users._id);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        setLoading(false);
      });
  }, [user]);

  // Fetch meals for the cook
  const fetchMeals = async (cookId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/meals?cookId=${cookId}`
      );
      setMeals(response.data);
      setFilteredMeals(response.data);
    } catch (error) {
      console.error("Failed to fetch meals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search meals
  useEffect(() => {
    let filtered = [...meals];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (meal) =>
          meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Diet type filter
    if (dietFilter !== "all") {
      filtered = filtered.filter((meal) => meal.dietType === dietFilter);
    }

    setFilteredMeals(filtered);
  }, [searchQuery, dietFilter, meals]);

  // Toggle availability
  const toggleAvailability = async (mealId, currentStatus) => {
    const newStatus =
      currentStatus === "available" ? "sold_out" : "available";
    try {
      await axios.patch(
        `http://localhost:3000/meals/${mealId}/availability`,
        { availabilityStatus: newStatus }
      );
      // Refresh meals
      if (userData?._id) {
        fetchMeals(userData._id);
      }
    } catch (error) {
      console.error("Failed to update availability:", error);
      alert("Failed to update availability");
    }
  };

  // Delete meal
  const handleDelete = async (mealId) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;

    try {
      await axios.delete(`http://localhost:3000/meals/${mealId}`);
      // Refresh meals
      if (userData?._id) {
        fetchMeals(userData._id);
      }
    } catch (error) {
      console.error("Failed to delete meal:", error);
      alert("Failed to delete meal");
    }
  };

  // Start editing
  const startEdit = (meal) => {
    setEditingMeal(meal._id);
    setEditForm({
      name: meal.name || "",
      shortDescription: meal.shortDescription || "",
      description: meal.description || "",
      price: meal.price || 0,
      isFree: meal.isFree || false,
      dietType: meal.dietType || "other",
      availablePortions: meal.availablePortions || 1,
      ingredients: meal.ingredients?.join(", ") || "",
      allergens: meal.allergens?.join(", ") || "",
      availabilityStatus: meal.availabilityStatus || "available",
    });
  };

  // Save edit
  const saveEdit = async () => {
    try {
      const payload = {
        ...editForm,
        ingredients: editForm.ingredients
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
        allergens: editForm.allergens
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
      };

      await axios.patch(
        `http://localhost:3000/meals/${editingMeal}`,
        payload
      );
      setEditingMeal(null);
      setEditForm({});
      // Refresh meals
      if (userData?._id) {
        fetchMeals(userData._id);
      }
    } catch (error) {
      console.error("Failed to update meal:", error);
      alert("Failed to update meal");
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingMeal(null);
    setEditForm({});
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: "Available", color: "bg-success text-white" },
      sold_out: { label: "Sold Out", color: "bg-error text-white" },
      paused: { label: "Paused", color: "bg-warning text-white" },
    };
    const config = statusConfig[status] || statusConfig.available;
    return (
      <span
        className={`text-xs font-semibold px-2 py-1 rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral">My Dishes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your meal listings and track availability
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search meals by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={dietFilter}
            onChange={(e) => setDietFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="veg">Vegetarian</option>
            <option value="non_veg">Non-Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="halal">Halal</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Meals Grid */}
      {filteredMeals.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {meals.length === 0
              ? "No meals yet. Add your first dish to get started!"
              : "No meals match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <div
              key={meal._id}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Meal Image */}
              <div className="relative h-48 bg-muted overflow-hidden">
                {meal.coverPhotoUrl ? (
                  <img
                    src={meal.coverPhotoUrl}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Utensils className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(meal.availabilityStatus)}
                </div>
              </div>

              {/* Meal Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-neutral line-clamp-1">
                    {meal.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getDietTypeLabel(meal.dietType)}
                  </p>
                </div>

                {meal.shortDescription && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {meal.shortDescription}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      {meal.isFree
                        ? "Free"
                        : `${meal.price} ${meal.currency || "BDT"}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span>{meal.availablePortions} portions</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {editingMeal === meal._id ? (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <input
                      type="text"
                      placeholder="Meal Name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-sm"
                    />
                    <textarea
                      placeholder="Short Description"
                      value={editForm.shortDescription}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          shortDescription: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-sm"
                      rows="2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Price"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="px-3 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Portions"
                        value={editForm.availablePortions}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            availablePortions: parseInt(e.target.value) || 1,
                          })
                        }
                        className="px-3 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Ingredients (comma separated)"
                      value={editForm.ingredients}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          ingredients: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Allergens (comma separated)"
                      value={editForm.allergens}
                      onChange={(e) =>
                        setEditForm({ ...editForm, allergens: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-sm"
                    />
                    <select
                      value={editForm.dietType}
                      onChange={(e) =>
                        setEditForm({ ...editForm, dietType: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none text-sm"
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non_veg">Non-Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="halal">Halal</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted-foreground/10 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => startEdit(meal)}
                      className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleAvailability(meal._id, meal.availabilityStatus)}
                      className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                        meal.availabilityStatus === "available"
                          ? "bg-warning/10 text-warning hover:bg-warning/20"
                          : "bg-success/10 text-success hover:bg-success/20"
                      }`}
                    >
                      {meal.availabilityStatus === "available" ? (
                        <>
                          <X className="w-4 h-4" />
                          Mark Sold Out
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Mark Available
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(meal._id)}
                      className="px-3 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDishes;
