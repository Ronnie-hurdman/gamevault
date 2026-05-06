import { useState, useEffect } from 'react';
import { Game, Review } from '../types';

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const storedGames = localStorage.getItem('gv_games');
    const storedReviews = localStorage.getItem('gv_reviews');
    if (storedGames) setGames(JSON.parse(storedGames));
    if (storedReviews) setReviews(JSON.parse(storedReviews));
  }, []);

  const saveGames = (newGames: Game[]) => {
    setGames(newGames);
    localStorage.setItem('gv_games', JSON.stringify(newGames));
  };

  const saveReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem('gv_reviews', JSON.stringify(newReviews));
  };

  const addGame = (game: Omit<Game, 'id' | 'createdAt'>) => {
    const newGame: Game = {
      ...game,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    saveGames([...games, newGame]);
  };

  const updateGame = (id: string, updates: Partial<Game>) => {
    saveGames(games.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const removeGame = (id: string) => {
    saveGames(games.filter(g => g.id !== id));
  };

  const addReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    saveReviews([...reviews, newReview]);
  };

  return {
    games,
    reviews,
    addGame,
    updateGame,
    removeGame,
    addReview,
    ownedGames: games.filter(g => g.status === 'owned'),
    wishlist: games.filter(g => g.status === 'wishlist'),
  };
}
