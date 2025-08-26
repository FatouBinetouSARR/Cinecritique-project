export interface User {
    _id: string;
    username?: string;
    email?: string;
  }
  
  export interface Review {
    _id: string;
    movieId: string;
    user?: User;
    comment: string;
    rating: number;
    likes?: number;
  }