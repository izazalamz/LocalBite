import React, { useState } from "react";
import { Clock, MapPin, User, X } from "lucide-react";

// Mock data - will be replaced with API data later
const mockFoodItems = [
  {
    id: 1,
    name: "Homemade Biryani",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&h=500&fit=crop",
    description: "Fragrant basmati rice cooked with tender chicken pieces, aromatic spices, and caramelized onions. Made fresh this morning with love from my grandmother's recipe. Perfect for lunch or dinner!",
    shortDescription: "Fragrant basmati rice with tender chicken and aromatic spices.",
    price: "৳120",
    unit: "Per Portion",
    cookName: "Fatima Rahman",
    deliveryTime: "Pickup within 2 hours",
    location: "Dhanmondi, Dhaka",
    availablePortions: 5,
  },
  {
    id: 2,
    name: "Mutton Korma with Naan",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&h=500&fit=crop",
    description: "Rich and creamy mutton korma slow-cooked with yogurt, cream, and a blend of traditional spices. Served with freshly baked naan bread. Comfort food at its finest!",
    shortDescription: "Rich and creamy mutton korma with freshly baked naan.",
    price: "৳180",
    unit: "Per Serving",
    cookName: "Karim Ahmed",
    deliveryTime: "Ready now",
    location: "Gulshan, Dhaka",
    availablePortions: 3,
  },
  {
    id: 3,
    name: "Vegetable Curry with Rice",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=500&fit=crop",
    description: "A healthy mix of seasonal vegetables cooked in a light curry with turmeric, cumin, and coriander. Served with steamed basmati rice. Perfect for a wholesome vegetarian meal.",
    shortDescription: "Healthy seasonal vegetables in a light, aromatic curry.",
    price: "৳80",
    unit: "Per Plate",
    cookName: "Rina Begum",
    deliveryTime: "Pickup within 1 hour",
    location: "Banani, Dhaka",
    availablePortions: 8,
  },
  {
    id: 4,
    name: "Beef Khichuri",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=500&fit=crop",
    description: "Comforting one-pot meal of rice and lentils cooked with tender beef pieces. Seasoned with whole spices and served with fried egg on top. A traditional Bengali favorite!",
    shortDescription: "Comforting one-pot rice and lentils with tender beef.",
    price: "৳100",
    unit: "Per Bowl",
    cookName: "Hasan Ali",
    deliveryTime: "Pickup within 3 hours",
    location: "Wari, Dhaka",
    availablePortions: 4,
  },
  {
    id: 5,
    name: "Fish Curry with Steamed Rice",
    image: "https://images.unsplash.com/photo-1544943910-04c1e2f5c94d?w=500&h=500&fit=crop",
    description: "Fresh rui fish cooked in a tangy and spicy curry with tomatoes, onions, and green chilies. A classic Bengali dish served with steamed rice. Made with fish caught fresh today!",
    shortDescription: "Fresh fish in tangy, spicy curry - a Bengali classic.",
    price: "৳150",
    unit: "Per Serving",
    cookName: "Shamima Khatun",
    deliveryTime: "Pickup within 2 hours",
    location: "Old Dhaka",
    availablePortions: 6,
  },
  {
    id: 6,
    name: "Chicken Roast with Paratha",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=500&fit=crop",
    description: "Succulent chicken pieces marinated in yogurt and spices, then roasted to perfection. Served with flaky, buttery paratha. A weekend special that's too good to miss!",
    shortDescription: "Succulent roasted chicken with buttery, flaky paratha.",
    price: "৳160",
    unit: "Per Plate",
    cookName: "Nazrul Islam",
    deliveryTime: "Ready now",
    location: "Mohammadpur, Dhaka",
    availablePortions: 2,
  },
  {
    id: 7,
    name: "Dal and Mixed Vegetables",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop",
    description: "Hearty lentil dal cooked with mixed vegetables, flavored with garlic and cumin. A nutritious and filling meal that's perfect for any time of day. Vegan-friendly!",
    shortDescription: "Hearty lentil dal with mixed vegetables - nutritious and vegan.",
    price: "৳70",
    unit: "Per Bowl",
    cookName: "Anjali Das",
    deliveryTime: "Pickup within 1 hour",
    location: "Dhanmondi, Dhaka",
    availablePortions: 10,
  },
  {
    id: 8,
    name: "Egg Curry with Rice",
    image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500&h=500&fit=crop",
    description: "Hard-boiled eggs cooked in a rich, flavorful curry with onions, tomatoes, and aromatic spices. Simple yet satisfying, served with steamed rice. A budget-friendly comfort meal.",
    shortDescription: "Rich egg curry with aromatic spices - simple and satisfying.",
    price: "৳60",
    unit: "Per Plate",
    cookName: "Moni Begum",
    deliveryTime: "Pickup within 2 hours",
    location: "Mirpur, Dhaka",
    availablePortions: 7,
  },
];

const AllFoods = () => {
  const [selectedFood, setSelectedFood] = useState(null);

  const handleCardClick = (food) => {
    setSelectedFood(food);
  };

  const handleCloseModal = () => {
    setSelectedFood(null);
  };

  const handleOrder = (foodId) => {
    // Order functionality will be implemented later
    console.log("Order placed for food ID:", foodId);
    alert(`Order placed for ${mockFoodItems.find(f => f.id === foodId)?.name}!`);
  };

  return (
    <div className="min-h-screen bg-background py-8 pt-20">
      <div className="fix-alignment">
        {/* Header Section */}
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral">
            All Foods
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Discover homemade meals shared by your neighbors. Click on any meal to see full details and place an order.
          </p>
        </div>

        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockFoodItems.map((food) => (
            <div
              key={food.id}
              className="card border border-border bg-card shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
              onClick={() => handleCardClick(food)}
            >
              {/* Food Image */}
              <figure className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Available Badge */}
                {food.availablePortions > 0 && (
                  <div className="absolute top-3 right-3 bg-success/90 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {food.availablePortions} Available
                  </div>
                )}
              </figure>

              {/* Card Body */}
              <div className="card-body p-4 space-y-3">
                {/* Delivery Time */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>{food.deliveryTime}</span>
                </div>

                {/* Food Name */}
                <h3 className="text-lg font-bold text-neutral line-clamp-1">
                  {food.name}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {food.shortDescription}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">
                    {food.price}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {food.unit}
                  </span>
                </div>

                {/* Cook Info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{food.cookName}</span>
                </div>

                {/* Order Button */}
                <button
                  className="btn-primary w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrder(food.id);
                  }}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Food Details */}
        {selectedFood && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border">
              {/* Modal Header */}
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between z-10">
                <h2 className="text-2xl font-bold text-neutral pr-4">
                  {selectedFood.name}
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
                <figure className="w-full h-64 rounded-2xl overflow-hidden">
                  <img
                    src={selectedFood.image}
                    alt={selectedFood.name}
                    className="w-full h-full object-cover"
                  />
                </figure>

                {/* Full Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-neutral">
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedFood.description}
                  </p>
                </div>

                {/* Food Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">{selectedFood.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm">{selectedFood.location}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm">{selectedFood.cookName}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Available: </span>
                      <span className="font-semibold text-success">
                        {selectedFood.availablePortions} portions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="flex items-baseline gap-3 pt-4 border-t border-border">
                  <span className="text-3xl font-bold text-primary">
                    {selectedFood.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {selectedFood.unit}
                  </span>
                </div>

                {/* Order Button */}
                <button
                  className="btn-primary w-full text-lg py-3"
                  onClick={() => {
                    handleOrder(selectedFood.id);
                    handleCloseModal();
                  }}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFoods;
