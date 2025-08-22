import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
  rating: number;
  size?: string;
}

export function StarRating({ max = 5, value = 0, onChange }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const ratingValue = i + 1;
        return (
          <Star
            key={i}
            className={`w-5 h-5 cursor-pointer ${
              (hover ?? value) >= ratingValue
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => onChange?.(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          />
        );
      })}
    </div>
  );
}
