/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Platform = 'Sony' | 'Nintendo' | 'Steam';
export type GameStatus = 'owned' | 'wishlist';
export type PlayedStatus = 'Played' | 'Unplayed' | 'Playing';

export interface Game {
  id?: string;
  title: string;
  platform: Platform;
  status: GameStatus;
  playedStatus: PlayedStatus;
  isFavorite?: boolean;
  price?: string;
  availability?: string[];
  imageUrl?: string;
  rating?: number;
  description?: string;
  userId: string;
  createdAt: any;
}

export interface Review {
  id?: string;
  gameId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface Recommendation {
  title: string;
  reason: string;
  platform: Platform;
  estimatedPrice: string;
}
