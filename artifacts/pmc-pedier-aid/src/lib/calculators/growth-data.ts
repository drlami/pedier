/**
 * WHO Growth Standards Data (Simplified for Plotting)
 * Range: 0 - 60 months
 * Points: Median (M), -2SD, +2SD
 */

export interface GrowthPoint {
  month: number;
  p3: number;   // -2SD
  p15: number;  // -1SD
  p50: number;  // Median
  p85: number;  // +1SD
  p97: number;  // +2SD
}

export const WHO_WEIGHT_BOYS: GrowthPoint[] = [
  { month: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.4 },
  { month: 6, p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.8 },
  { month: 12, p3: 7.7, p15: 8.6, p50: 9.6, p85: 10.8, p97: 12.0 },
  { month: 24, p3: 9.7, p15: 10.8, p50: 12.2, p85: 13.6, p97: 15.3 },
  { month: 36, p3: 11.3, p15: 12.7, p50: 14.3, p85: 16.2, p97: 18.3 },
  { month: 48, p3: 12.7, p15: 14.4, p50: 16.3, p85: 18.5, p97: 21.2 },
  { month: 60, p3: 14.1, p15: 16.0, p50: 18.3, p85: 21.0, p97: 24.2 },
];

export const WHO_WEIGHT_GIRLS: GrowthPoint[] = [
  { month: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2 },
  { month: 6, p3: 5.8, p15: 6.5, p50: 7.3, p85: 8.2, p97: 9.2 },
  { month: 12, p3: 7.0, p15: 7.9, p50: 8.9, p85: 10.1, p97: 11.5 },
  { month: 24, p3: 9.0, p15: 10.2, p50: 11.5, p85: 13.0, p97: 14.8 },
  { month: 36, p3: 10.8, p15: 12.2, p50: 13.9, p85: 15.8, p97: 18.1 },
  { month: 48, p3: 12.3, p15: 14.0, p50: 16.1, p85: 18.4, p97: 21.5 },
  { month: 60, p3: 13.7, p15: 15.8, p50: 18.2, p85: 21.0, p97: 24.9 },
];

export const WHO_HEIGHT_BOYS: GrowthPoint[] = [
  { month: 0, p3: 46.1, p15: 48.0, p50: 49.9, p85: 51.8, p97: 53.7 },
  { month: 6, p3: 63.3, p15: 65.5, p50: 67.6, p85: 69.8, p97: 71.9 },
  { month: 12, p3: 71.0, p15: 73.4, p50: 75.7, p85: 78.1, p97: 80.5 },
  { month: 24, p3: 81.7, p15: 84.4, p50: 87.1, p85: 89.7, p97: 92.5 },
  { month: 36, p3: 89.9, p15: 93.0, p50: 96.1, p85: 99.2, p97: 102.3 },
  { month: 48, p3: 96.4, p15: 99.9, p50: 103.3, p85: 106.7, p97: 110.2 },
  { month: 60, p3: 102.3, p15: 106.2, p50: 110.0, p85: 113.9, p97: 117.7 },
];

export const WHO_HEIGHT_GIRLS: GrowthPoint[] = [
  { month: 0, p3: 45.4, p15: 47.3, p50: 49.1, p85: 51.0, p97: 52.9 },
  { month: 6, p3: 61.2, p15: 63.5, p50: 65.7, p85: 68.0, p97: 70.3 },
  { month: 12, p3: 68.9, p15: 71.4, p50: 74.0, p85: 76.6, p97: 79.2 },
  { month: 24, p3: 80.0, p15: 83.2, p50: 86.4, p85: 89.6, p97: 92.9 },
  { month: 36, p3: 88.4, p15: 91.8, p50: 95.1, p85: 98.4, p97: 101.8 },
  { month: 48, p3: 95.2, p15: 99.0, p50: 102.7, p85: 106.5, p97: 110.2 },
  { month: 60, p3: 101.3, p15: 105.4, p50: 109.4, p85: 113.5, p97: 117.5 },
];

export const WHO_HC_BOYS: GrowthPoint[] = [
  { month: 0, p3: 32.1, p15: 33.3, p50: 34.5, p85: 35.8, p97: 36.9 },
  { month: 6, p3: 41.0, p15: 42.1, p50: 43.3, p85: 44.5, p97: 45.6 },
  { month: 12, p3: 43.9, p15: 45.0, p50: 46.1, p85: 47.3, p97: 48.3 },
  { month: 24, p3: 45.9, p15: 47.1, p50: 48.3, p85: 49.5, p97: 50.7 },
  { month: 36, p3: 47.2, p15: 48.4, p50: 49.5, p85: 50.7, p97: 51.9 },
  { month: 48, p3: 48.1, p15: 49.3, p50: 50.4, p85: 51.6, p97: 52.8 },
  { month: 60, p3: 48.8, p15: 50.0, p50: 51.1, p85: 52.3, p97: 53.5 },
];

export const WHO_HC_GIRLS: GrowthPoint[] = [
  { month: 0, p3: 31.7, p15: 32.8, p50: 33.9, p85: 35.1, p97: 36.1 },
  { month: 6, p3: 39.7, p15: 40.9, p50: 42.2, p85: 43.4, p97: 44.6 },
  { month: 12, p3: 42.6, p15: 43.8, p50: 45.0, p85: 46.2, p97: 47.4 },
  { month: 24, p3: 44.8, p15: 46.0, p50: 47.2, p85: 48.4, p97: 49.6 },
  { month: 36, p3: 46.1, p15: 47.3, p50: 48.5, p85: 49.7, p97: 50.9 },
  { month: 48, p3: 47.1, p15: 48.3, p50: 49.5, p85: 50.7, p97: 51.9 },
  { month: 60, p3: 47.8, p15: 49.1, p50: 50.2, p85: 51.5, p97: 52.7 },
];

/**
 * Simplified BP Percentile Lookup (95th Percentile)
 * Formula varies by age/sex/height, but for rapid ER screening:
 * Median BP = 80 + (Age in years * 2)
 * High BP (95th) approx = 95 + (Age in years * 2)
 */
export const calculateSimplifiedBPPercentile = (ageYears: number, sex: 'male' | 'female') => {
    // 95th Percentile estimate for median height
    const systolic95 = 95 + (ageYears * 2);
    const diastolic95 = 60 + (ageYears * 1.5);
    
    return { systolic95, diastolic95 };
};

/**
 * Fenton Preterm Growth Data (Simplified)
 * Range: 22 - 50 weeks PMA
 */
export const FENTON_WEIGHT_BOYS: GrowthPoint[] = [
  { month: 22, p3: 0.35, p15: 0.42, p50: 0.50, p85: 0.60, p97: 0.70 },
  { month: 26, p3: 0.65, p15: 0.78, p50: 0.90, p85: 1.05, p97: 1.20 },
  { month: 30, p3: 1.10, p15: 1.30, p50: 1.50, p85: 1.75, p97: 2.00 },
  { month: 34, p3: 1.70, p15: 2.00, p50: 2.30, p85: 2.70, p97: 3.10 },
  { month: 38, p3: 2.40, p15: 2.80, p50: 3.20, p85: 3.70, p97: 4.20 },
  { month: 42, p3: 3.10, p15: 3.60, p50: 4.10, p85: 4.70, p97: 5.30 },
  { month: 46, p3: 3.80, p15: 4.40, p50: 5.00, p85: 5.80, p97: 6.50 },
  { month: 50, p3: 4.50, p15: 5.20, p50: 6.00, p85: 6.90, p97: 7.80 },
];

export const FENTON_WEIGHT_GIRLS: GrowthPoint[] = [
  { month: 22, p3: 0.33, p15: 0.40, p50: 0.48, p85: 0.58, p97: 0.68 },
  { month: 26, p3: 0.60, p15: 0.72, p50: 0.85, p85: 1.00, p97: 1.15 },
  { month: 30, p3: 1.00, p15: 1.20, p50: 1.40, p85: 1.65, p97: 1.90 },
  { month: 34, p3: 1.60, p15: 1.90, p50: 2.20, p85: 2.55, p97: 2.95 },
  { month: 38, p3: 2.25, p15: 2.65, p50: 3.05, p85: 3.50, p97: 4.00 },
  { month: 42, p3: 2.90, p15: 3.40, p50: 3.90, p85: 4.50, p97: 5.10 },
  { month: 46, p3: 3.55, p15: 4.15, p50: 4.75, p85: 5.50, p97: 6.20 },
  { month: 50, p3: 4.20, p15: 4.90, p50: 5.60, p85: 6.50, p97: 7.30 },
];

export const FENTON_HC_BOYS: GrowthPoint[] = [
  { month: 22, p3: 17.5, p15: 18.5, p50: 19.5, p85: 20.8, p97: 21.8 },
  { month: 30, p3: 25.5, p15: 26.8, p50: 28.1, p85: 29.5, p97: 30.8 },
  { month: 40, p3: 33.5, p15: 34.8, p50: 36.2, p85: 37.8, p97: 39.2 },
  { month: 50, p3: 38.0, p15: 39.5, p50: 41.0, p85: 42.8, p97: 44.2 },
];

export const FENTON_HC_GIRLS: GrowthPoint[] = [
  { month: 22, p3: 17.0, p15: 18.0, p50: 19.0, p85: 20.2, p97: 21.2 },
  { month: 30, p3: 24.8, p15: 26.0, p50: 27.2, p85: 28.5, p97: 29.8 },
  { month: 40, p3: 32.5, p15: 33.8, p50: 35.2, p85: 36.8, p97: 38.2 },
  { month: 50, p3: 37.0, p15: 38.5, p50: 40.0, p85: 41.8, p97: 43.2 },
];
