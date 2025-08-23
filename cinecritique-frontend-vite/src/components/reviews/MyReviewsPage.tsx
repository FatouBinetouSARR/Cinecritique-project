import { useState } from "react";
import { Star, Edit, Trash2, Calendar, Film } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { dataMyReviews, type MyReview } from "../../data/dataMyReviews";

export const MyReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<MyReview[]>(dataMyReviews);
  const [, setEditingReview] = useState<number | null>(null);
  

  const handleDeleteReview = (reviewId: number) => {
    setReviews(reviews.filter((review) => review.id !== reviewId));
  };

  const handleEditReview = (reviewId: number) => {
    setEditingReview(reviewId);
    console.log(`[v0] Editing review ${reviewId}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
      />
    ));
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-700 ">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">My Reviews</h1>
          </div>
          <p className="text-gray-400">Manage and edit your movie reviews</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 text-sm text-gray-400">
            <span>{reviews.length} Reviews</span>
            <span>Average Rating: {averageRating}/5</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="container mx-auto px-4 py-8">
        {reviews.length === 0 ? (
          <Card className="text-center py-12  border-gray-700">
            <CardContent>
              <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
              <p className="text-gray-400 mb-4">Start reviewing movies to see them here</p>
              <Button asChild className="bg-blue-600 text-white hover:bg-blue-500">
                <a href="/">Discover Movies</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="overflow-hidden bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-4 w-full sm:w-auto">
                      <img
                        src={review.moviePoster || "/placeholder.svg"}
                        alt={review.movieTitle}
                        className="w-20 h-28 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          <a
                            href={`/movie/${review.movieId}`}
                            className="hover:text-blue-500 transition-colors"
                          >
                            {review.movieTitle}
                          </a>
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">{renderStars(review.rating)}</div>
                          <Badge className="bg-yellow-400 text-gray-900">{review.rating}/5</Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                          {review.updatedAt !== review.createdAt && (
                            <span className="text-xs">(edited {new Date(review.updatedAt).toLocaleDateString()})</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <Button
                        onClick={() => handleEditReview(review.id)}
                        className="flex items-center gap-1 bg-gray-700 text-white hover:bg-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteReview(review.id)}
                        className="flex items-center gap-1 bg-red-600 text-white hover:bg-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 leading-relaxed">{review.review}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
