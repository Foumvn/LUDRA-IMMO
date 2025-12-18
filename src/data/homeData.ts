// data/homeData.ts (simplifié)
import { Statistic, ProcessStep } from '@/types/home';

export const processSteps: ProcessStep[] = [
  {
    icon: 'Search',
    title: 'process.search',
    description: 'process.search_description'
  },
  {
    icon: 'Calendar',
    title: 'process.book',
    description: 'process.book_description'
  },
  {
    icon: 'Home',
    title: 'process.move_in',
    description: 'process.move_in_description'
  }
];

export const statistics: Statistic[] = [
  { number: '4K+', label: 'hero.stats.listings' },
  { number: '6+', label: 'hero.stats.cities' },
  { number: '8.9/10', label: 'hero.stats.satisfaction' },
  { number: '24/7', label: 'hero.stats.support' }
];

export const heroImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1920&h=1080&fit=crop'
];