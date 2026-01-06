import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import Loading from "../../components/Loading";
import { Star, User, Calendar, Utensils, Search } from "lucide-react";

const CooksReview = () => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [selectedMealId, setSelectedMealId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user data
  useEffect(() => {
    if (!user?.uid) return;

    axios
      .get(`http://localhost:3000/users/${user.uid}`)
      .then((res) => {
        const userData = res.data.user || res.data.users;
        setUserData(userData);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, [user]);

  // Fetch all meals
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/meals");
        setMeals(response.data || []);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  // Fetch reviews for selected meal
  useEffect(() => {
    if (!selectedMealId) {
      setReviews([]);
      return;
    }

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/reviews/meal/${selectedMealId}`
        );
        setReviews(response.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [selectedMealId]);

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMeal = meals.find((m) => m._id === selectedMealId);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-warning fill-warning" : "text-muted-foreground"
        }`}
      />
    ));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral">Meal Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View reviews for meals from platform users
        </p>
      </div>

      {/* Meal Selection */}
      <div className="bg-card border border-border rounded-xl p-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Meal to View Reviews
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meals..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>
        {searchQuery && (
          <div className="mt-2 max-h-60 overflow-y-auto border border-border rounded-lg bg-muted">
            {filteredMeals.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">
                No meals found
              </p>
            ) : (
              filteredMeals.map((meal) => (
                <button
                  key={meal._id}
                  onClick={() => {
                    setSelectedMealId(meal._id);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left p-3 hover:bg-background transition-colors border-b border-border last:border-b-0 ${
                    selectedMealId === meal._id ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {meal.coverPhotoUrl ? (
                      <img
                        src={meal.coverPhotoUrl}
                        alt={meal.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Utensils className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{meal.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {meal.cookId?.fullName || "Unknown Cook"}
                      </p>
                    </div>
                    {meal.avgMealRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="text-sm font-medium">
                          {meal.avgMealRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
        {selectedMeal && (
          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-3">
              {selectedMeal.coverPhotoUrl ? (
                <img
                  src={selectedMeal.coverPhotoUrl}
                  alt={selectedMeal.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Utensils className="w-8 h-8 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {selectedMeal.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  by {selectedMeal.cookId?.fullName || "Unknown Cook"}
                </p>
                {selectedMeal.avgMealRating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(Math.round(selectedMeal.avgMealRating))}
                    <span className="text-sm font-medium">
                      {selectedMeal.avgMealRating.toFixed(1)} (
                      {selectedMeal.mealRatingCount} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Average Rating */}
      {selectedMealId && reviews.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-primary">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral">
          Reviews for {selectedMeal?.name || "..."}
        </h2>

        {!selectedMealId ? (
          <div className="bg-muted rounded-xl p-8 text-center">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">
              Select a meal to view reviews
            </p>
          </div>
        ) : reviewsLoading ? (
          <Loading />
        ) : reviews.length === 0 ? (
          <div className="bg-muted rounded-xl p-8 text-center">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review this meal!
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              (Reviews can only be submitted by users who completed orders)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {review.foodieId?.fullName || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Platform User
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-sm font-medium text-foreground">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                {review.comment && (
                  <p className="text-foreground mb-3">{review.comment}</p>
                )}

                {review.createdAt && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                )}
              </div>
            ))}
            </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-info/10 border border-info/20 rounded-xl p-4">
        <p className="text-sm text-foreground">
          <strong>Note:</strong> Reviews can only be submitted by authenticated
          platform users who have completed orders. To review a meal, go to{" "}
          <strong>My Orders</strong> and review your completed orders.
        </p>
      </div>
    </div>
  );
};

export default CooksReview;
