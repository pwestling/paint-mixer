// Kubelka-Monk colour utilities

export const WAVELENGTHS = [
  380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490,
  500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610,
  620, 630, 640, 650, 660, 670, 680, 690, 700,
];

// CIE 1931 2° colour matching functions
const CMF_X = [
  0.00136800, 0.00424300, 0.01431000, 0.04351000, 0.13438000,
  0.28390000, 0.34828000, 0.33620000, 0.29080000, 0.19536000,
  0.09564000, 0.03201000, 0.00490000, 0.00930000, 0.06327000,
  0.16550000, 0.29040000, 0.43344990, 0.59450000, 0.76210000,
  0.91630000, 1.02630000, 1.06220000, 1.00260000, 0.85444990,
  0.64240000, 0.44790000, 0.28350000, 0.16490000, 0.08740000,
  0.04677000, 0.02270000, 0.01135916,
];
const CMF_Y = [
  0.00003900, 0.00012000, 0.00039600, 0.00121000, 0.00400000,
  0.01160000, 0.02300000, 0.03800000, 0.06000000, 0.09098000,
  0.13902000, 0.20802000, 0.32300000, 0.50300000, 0.71000000,
  0.86200000, 0.95400000, 0.99495010, 0.99500000, 0.95200000,
  0.87000000, 0.75700000, 0.63100000, 0.50300000, 0.38100000,
  0.26500000, 0.17500000, 0.10700000, 0.06100000, 0.03200000,
  0.01700000, 0.00821000, 0.00410200,
];
const CMF_Z = [
  0.00645000, 0.02005001, 0.06785001, 0.20740000, 0.64560000,
  1.38560000, 1.74706000, 1.77211000, 1.66920000, 1.28764000,
  0.81295010, 0.46518000, 0.27200000, 0.15820000, 0.07824999,
  0.04216000, 0.02030000, 0.00875000, 0.00390000, 0.00210000,
  0.00165000, 0.00110000, 0.00080000, 0.00034000, 0.00019000,
  0.00005000, 0.00002000, 0.00000000, 0.00000000, 0.00000000,
  0.00000000, 0.00000000, 0.00000000,
];

// Illuminant spectral distributions (relative units)
const SPD_D65 = [
  49.9755, 54.6482, 82.7549, 91.4860, 93.4318, 86.6823, 104.8650,
  117.0080, 117.8120, 114.8610, 115.9230, 108.8110, 109.3540, 107.8020,
  104.7900, 107.6890, 104.4050, 104.0460, 100.0000, 96.3342, 95.7880,
  88.6856, 90.0062, 89.5991, 87.6987, 83.2886, 83.6992, 80.0268, 80.2146,
  82.2778, 78.2842, 69.7213, 71.6091,
];
const SPD_A = [
  9.7951, 12.0853, 14.7080, 17.6753, 20.9950, 24.6709, 28.7027,
  33.0859, 37.8121, 42.8693, 48.2423, 53.9132, 59.8611, 66.0635,
  72.4959, 79.1326, 85.9470, 92.9120, 100.0000, 107.1840, 114.4360,
  121.7310, 129.0430, 136.3460, 143.6180, 150.8360, 157.9790, 165.0280,
  171.9630, 178.7690, 185.4290, 191.9310, 198.2610,
];

function rawRef(spd: number[]) {
  let X = 0;
  let Y = 0;
  let Z = 0;
  for (let i = 0; i < WAVELENGTHS.length; i++) {
    X += spd[i] * CMF_X[i];
    Y += spd[i] * CMF_Y[i];
    Z += spd[i] * CMF_Z[i];
  }
  return { X, Y, Z };
}

const RAW_D65 = rawRef(SPD_D65);
const RAW_A = rawRef(SPD_A);
const K_D65 = 100 / RAW_D65.Y;
const K_A = 100 / RAW_A.Y;
const WHITE_D65 = { X: RAW_D65.X * K_D65, Y: 100, Z: RAW_D65.Z * K_D65 };
const WHITE_A = { X: RAW_A.X * K_A, Y: 100, Z: RAW_A.Z * K_A };

// Convert spectral reflectance to XYZ under chosen illuminant
export function spectrumToXyz(
  spectrum: number[],
  illuminant: 'D65' | 'A' = 'D65',
) {
  const spd = illuminant === 'A' ? SPD_A : SPD_D65;
  const k = illuminant === 'A' ? K_A : K_D65;
  let X = 0;
  let Y = 0;
  let Z = 0;
  for (let i = 0; i < spectrum.length; i++) {
    const r = spectrum[i];
    const e = spd[i];
    X += r * e * CMF_X[i];
    Y += r * e * CMF_Y[i];
    Z += r * e * CMF_Z[i];
  }
  return { x: X * k, y: Y * k, z: Z * k };
}

// XYZ to CIE Lab
export function xyzToLab(
  xyz: { x: number; y: number; z: number },
  illuminant: 'D65' | 'A' = 'D65',
): [number, number, number] {
  const white = illuminant === 'A' ? WHITE_A : WHITE_D65;
  const xr = xyz.x / white.X;
  const yr = xyz.y / white.Y;
  const zr = xyz.z / white.Z;
  const e = 216 / 24389;
  const k = 24389 / 27;
  const fx = xr > e ? Math.cbrt(xr) : (k * xr + 16) / 116;
  const fy = yr > e ? Math.cbrt(yr) : (k * yr + 16) / 116;
  const fz = zr > e ? Math.cbrt(zr) : (k * zr + 16) / 116;
  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);
  return [L, a, b];
}

export function spectrumToLab(
  spectrum: number[],
  illuminant: 'D65' | 'A' = 'D65',
): [number, number, number] {
  return xyzToLab(spectrumToXyz(spectrum, illuminant), illuminant);
}

// Convert Lab (D65) to sRGB string using culori
import { formatRgb, convertLab65ToRgb } from 'culori';

export function labToRgb(lab: [number, number, number]): string {
  const [l, a, b] = lab;
  const rgb = convertLab65ToRgb({ mode: 'lab65', l, a, b });
  return formatRgb(rgb);
}

export interface KS {
  K: number[];
  S: number[];
}

export function mixKS(components: { ks: KS; phi: number }[]): KS {
  const K = new Array(WAVELENGTHS.length).fill(0);
  const S = new Array(WAVELENGTHS.length).fill(0);
  for (const { ks, phi } of components) {
    for (let i = 0; i < WAVELENGTHS.length; i++) {
      K[i] += ks.K[i] * phi;
      S[i] += ks.S[i] * phi;
    }
  }
  return { K, S };
}

export function ksToReflectance(ks: KS): number[] {
  const R: number[] = [];
  for (let i = 0; i < WAVELENGTHS.length; i++) {
    const K = ks.K[i];
    const S = ks.S[i];
    const r = 1 / (1 + K / S);
    R.push(r);
  }
  return R;
}

export function ksToLab(ks: KS, illuminant: 'D65' | 'A' = 'D65') {
  const R = ksToReflectance(ks);
  return spectrumToLab(R, illuminant);
}

export function ksToRgb(ks: KS, illuminant: 'D65' | 'A' = 'D65') {
  return labToRgb(ksToLab(ks, illuminant));
}

