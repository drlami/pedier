// Age-based normal vital sign ranges for paediatric patients.
// References: APLS 6th ed. (2016); Bonafide et al. Pediatrics 2013.

export interface VitalsNormals {
  hrMin: number;
  hrMax: number;
  rrMin: number;
  rrMax: number;
  spo2Min: number;
  ageLabel: string;
}

// ageMonths: age in months
export function getVitalsNormals(ageMonths: number): VitalsNormals {
  if (ageMonths < 1)   return { ageLabel: 'Neonate',       hrMin: 100, hrMax: 160, rrMin: 40, rrMax: 60, spo2Min: 95 };
  if (ageMonths < 12)  return { ageLabel: 'Infant',        hrMin: 100, hrMax: 160, rrMin: 30, rrMax: 40, spo2Min: 95 };
  if (ageMonths < 36)  return { ageLabel: 'Toddler',       hrMin: 90,  hrMax: 150, rrMin: 24, rrMax: 40, spo2Min: 95 };
  if (ageMonths < 60)  return { ageLabel: 'Preschool',     hrMin: 80,  hrMax: 140, rrMin: 22, rrMax: 34, spo2Min: 95 };
  if (ageMonths < 144) return { ageLabel: 'School age',    hrMin: 70,  hrMax: 120, rrMin: 18, rrMax: 30, spo2Min: 95 };
  return                      { ageLabel: 'Adolescent',    hrMin: 60,  hrMax: 100, rrMin: 12, rrMax: 20, spo2Min: 95 };
}

export type VitalStatus = 'normal' | 'borderline' | 'abnormal';

export function hrStatus(hr: number, normals: VitalsNormals): VitalStatus {
  if (hr <= 0) return 'normal';
  if (hr > normals.hrMax * 1.2 || hr < normals.hrMin * 0.8) return 'abnormal';
  if (hr > normals.hrMax || hr < normals.hrMin) return 'borderline';
  return 'normal';
}

export function rrStatus(rr: number, normals: VitalsNormals): VitalStatus {
  if (rr <= 0) return 'normal';
  if (rr > normals.rrMax * 1.2 || rr < normals.rrMin * 0.8) return 'abnormal';
  if (rr > normals.rrMax || rr < normals.rrMin) return 'borderline';
  return 'normal';
}

export function spo2Status(spo2: number): VitalStatus {
  if (spo2 <= 0) return 'normal';
  if (spo2 < 92) return 'abnormal';
  if (spo2 < 95) return 'borderline';
  return 'normal';
}

export function statusColor(s: VitalStatus) {
  if (s === 'abnormal')   return { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300' };
  if (s === 'borderline') return { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-300' };
  return                         { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' };
}

export function statusLabel(s: VitalStatus, type: 'hr' | 'rr' | 'spo2', value: number, normals: VitalsNormals): string {
  if (value <= 0) return '';
  if (type === 'hr') {
    if (value > normals.hrMax) return `Tachycardic (> ${normals.hrMax})`;
    if (value < normals.hrMin) return `Bradycardic (< ${normals.hrMin})`;
  }
  if (type === 'rr') {
    if (value > normals.rrMax) return `Tachypnoeic (> ${normals.rrMax})`;
    if (value < normals.rrMin) return `Low RR (< ${normals.rrMin})`;
  }
  if (type === 'spo2') {
    if (value < 92) return 'Hypoxic (< 92%)';
    if (value < 95) return 'Low-normal (< 95%)';
  }
  return 'Normal';
}

// Parse age input: accepts "2", "2.5", "2y", "2y6m", "18m" → returns months
export function parseAgeToMonths(input: string): number {
  if (!input.trim()) return 0;
  const lower = input.toLowerCase().trim();
  // "18m" or "18 m"
  const mOnly = lower.match(/^(\d+\.?\d*)\s*m$/);
  if (mOnly) return parseFloat(mOnly[1]);
  // "2y6m" or "2y 6m"
  const ym = lower.match(/^(\d+\.?\d*)\s*y\s*(\d+\.?\d*)?\s*m?$/);
  if (ym) return parseFloat(ym[1]) * 12 + parseFloat(ym[2] || '0');
  // "2y" or "2 y"
  const yOnly = lower.match(/^(\d+\.?\d*)\s*y$/);
  if (yOnly) return parseFloat(yOnly[1]) * 12;
  // plain number → interpret as years
  const plain = parseFloat(lower);
  if (!isNaN(plain)) return plain * 12;
  return 0;
}
