import type { RatingGrade } from './types';

/** Get color hex for a rating grade */
export function getRatingColor(grade: RatingGrade): string {
  switch (grade) {
    case 'A': return '#2D9F6E';
    case 'B': return '#6ABF4B';
    case 'C': return '#F5A623';
    case 'D': return '#E8863B';
    case 'F': return '#E04848';
  }
}

/** Get Tailwind CSS classes for a rating badge */
export function getRatingClasses(grade: RatingGrade): string {
  switch (grade) {
    case 'A': return 'bg-[#2D9F6E]';
    case 'B': return 'bg-[#6ABF4B]';
    case 'C': return 'bg-[#F5A623]';
    case 'D': return 'bg-[#E8863B]';
    case 'F': return 'bg-[#E04848]';
  }
}

/** Get rating label text */
export function getRatingLabel(grade: RatingGrade): string {
  switch (grade) {
    case 'A': return 'Excellent';
    case 'B': return 'Good';
    case 'C': return 'Average';
    case 'D': return 'Poor';
    case 'F': return 'Avoid';
  }
}

/** Check if rating is good (A or B) */
export function isGoodRating(grade: RatingGrade): boolean {
  return grade === 'A' || grade === 'B';
}

/** Check if rating is poor (D or F) */
export function isPoorRating(grade: RatingGrade): boolean {
  return grade === 'D' || grade === 'F';
}

/** Get CSS linear gradient for nutrition progress bar */
export function getNutriBarGradient(): string {
  return 'linear-gradient(90deg, #E04848 0%, #F5A623 50%, #2D9F6E 100%)';
}