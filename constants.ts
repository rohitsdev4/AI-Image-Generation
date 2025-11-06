
import type { AspectRatio } from './types';

export const IMAGE_STYLES = [
  "Photographic",
  "Anime",
  "Fantasy",
  "Cyberpunk",
  "Minimalist",
  "Abstract",
  "Impressionistic",
  "Pop Art",
  "Steampunk",
];

export const IMAGE_MOODS = [
  "Dramatic",
  "Cheerful",
  "Calm",
  "Mysterious",
  "Energetic",
  "Romantic",
  "Gloomy",
  "Whimsical",
];

export const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
  { label: "Square (1:1)", value: "1:1" },
  { label: "Widescreen (16:9)", value: "16:9" },
  { label: "Portrait (9:16)", value: "9:16" },
  { label: "Landscape (4:3)", value: "4:3" },
  { label: "Tall (3:4)", value: "3:4" },
];

export const IMAGE_QUALITIES = ["Standard", "High", "Ultra"];
