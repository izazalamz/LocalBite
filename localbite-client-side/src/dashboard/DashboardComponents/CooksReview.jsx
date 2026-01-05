import { useEffect, useState } from "react";

const CooksReview = () => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const cookId = "123";

  useEffect(() => {
    fetch('http://localhost:5000/reviews/${cookId}')
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cookId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) return;

    const reviewData = {
      cookId,
      rating,
      comment,
    };

    fetch("http://localhost:5000/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })
      .then((res) => res.json())
      .then((savedReview) => {
        setReviews([...reviews, savedReview]);
        setRating(0);
        setComment("");
      });
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "No ratings yet";

  if (loading) {
    return <p className="p-6">Loading reviews...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Cook Reviews</h2>

      <p className="mb-4 text-lg">
        ⭐ Average Rating: <strong>{averageRating}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border px-3 py-2 w-full rounded"
        >
          <option value={0}>Select Rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 && "s"}
            </option>
          ))}
        </select>

        <textarea
          className="border px-3 py-2 w-full rounded"
          rows="3"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Review
        </button>
      </form>

   
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border p-3 rounded">
              <p className="font-semibold">⭐ {review.rating}</p>
              <p>{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CooksReview;
