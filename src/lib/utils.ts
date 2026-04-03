import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { adjectives, nouns } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomName() {
  const getRand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  return `${getRand(adjectives)} ${getRand(nouns)}`;
}

export function formatTimeRemaining(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
