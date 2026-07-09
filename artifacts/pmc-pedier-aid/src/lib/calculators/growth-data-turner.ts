/**
 * Turner Syndrome Height Reference Data (2-19 years), untreated
 * Source: Lyon AJ, Preece MA, Grant DB. "Growth curve for girls with Turner
 * syndrome." Arch Dis Child. 1985;60(10):932-935 — the classic, most-cited
 * Turner-specific reference chart, reproduced by Genentech/Turner Syndrome
 * Foundation (TSF) as a standard clinical growth-chart handout.
 *
 * DATA QUALITY NOTE: unlike the Down syndrome, achondroplasia, and cerebral
 * palsy references in this app, no open per-age numeric table for this chart
 * could be located (it predates the LMS-parameter-sharing convention). These
 * points were visually digitized from the published chart's gridlines (5th/
 * 50th/95th percentile curves at each year, ~1cm reading precision), then the
 * full p3/p15/p50/p85/p97 set was derived via a split-normal approximation
 * (same method used for the achondroplasia chart). Treat as approximate.
 *
 * Height only — this chart has no weight or head-circumference curves, and
 * predates growth-hormone therapy (now standard of care), so a GH-treated
 * patient will plot shorter than their treatment-adjusted expectation.
 * Turner syndrome (45,X) occurs only in phenotypic females; this standard
 * has no male dataset.
 */

import { GrowthPoint } from "./growth-data";

export const TURNER_HEIGHT: GrowthPoint[] = [
  { month: 24, p3: 78.28, p15: 80.85, p50: 84, p85: 87.15, p97: 89.72 },
  { month: 36, p3: 83.71, p15: 86.53, p50: 90, p85: 93.47, p97: 96.29 },
  { month: 48, p3: 89.14, p15: 92.22, p50: 96, p85: 99.78, p97: 102.86 },
  { month: 60, p3: 94.07, p15: 97.4, p50: 101.5, p85: 105.6, p97: 108.93 },
  { month: 72, p3: 98.5, p15: 102.09, p50: 106.5, p85: 110.91, p97: 114.5 },
  { month: 84, p3: 102.42, p15: 106.27, p50: 111, p85: 115.73, p97: 119.58 },
  { month: 96, p3: 105.85, p15: 109.96, p50: 115, p85: 120.04, p97: 124.15 },
  { month: 108, p3: 108.78, p15: 113.14, p50: 118.5, p85: 123.86, p97: 128.22 },
  { month: 120, p3: 111.71, p15: 116.33, p50: 122, p85: 127.67, p97: 132.29 },
  { month: 132, p3: 114.14, p15: 119.01, p50: 125, p85: 130.99, p97: 135.86 },
  { month: 144, p3: 116.57, p15: 121.7, p50: 128, p85: 134.3, p97: 139.43 },
  { month: 156, p3: 118.99, p15: 124.38, p50: 131, p85: 137.62, p97: 143.01 },
  { month: 168, p3: 121.42, p15: 127.07, p50: 134, p85: 140.93, p97: 146.58 },
  { month: 180, p3: 124.42, p15: 130.07, p50: 137, p85: 143.93, p97: 149.58 },
  { month: 192, p3: 127.99, p15: 133.38, p50: 140, p85: 146.62, p97: 152.01 },
  { month: 204, p3: 131.07, p15: 136.2, p50: 142.5, p85: 148.8, p97: 153.93 },
  { month: 216, p3: 134.71, p15: 139.33, p50: 145, p85: 150.67, p97: 155.29 },
  { month: 228, p3: 137.85, p15: 141.96, p50: 147, p85: 152.04, p97: 156.15 },
];
