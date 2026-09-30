import * as THREE from 'three';

/**
 * Generates 3D points forming an elegant mathematical heart.
 */
export function generateHeartPoints(count: number, scale: number = 0.5): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    // Heart parametric equations
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    
    // Add volumetric depth and organic particle jitter
    const jitter = (Math.random() - 0.5) * 1.5;
    const z = (Math.random() - 0.5) * 6;

    // Distribute some points internally
    const interiorFactor = Math.pow(Math.random(), 0.5);

    positions[i * 3] = (x * interiorFactor + jitter) * scale * 0.12;
    positions[i * 3 + 1] = (y * interiorFactor + jitter) * scale * 0.12;
    positions[i * 3 + 2] = z * scale * 0.12;
  }

  return positions;
}

/**
 * Generates 3D points forming a clean, majestic, volumetric numeral "5".
 */
export function generateNumberFivePoints(count: number, scale: number = 1.0): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    let px = 0;
    let py = 0;
    const pz = (Math.random() - 0.5) * 1.8 * scale;
    const section = Math.random();

    if (section < 0.28) {
      // Top horizontal bar (from -2.5 to +2.5 at y = 4)
      const t = Math.random();
      px = -2.5 + t * 5.2;
      py = 4.2 + (Math.random() - 0.5) * 0.6;
    } else if (section < 0.50) {
      // Upper vertical stem (from y = 4 to y = 1 at x = -2.2)
      const t = Math.random();
      px = -2.2 + (Math.random() - 0.5) * 0.6;
      py = 1.2 + t * 3.0;
    } else {
      // Lower curved belly loop (centered around (0, -0.6) with radius ~ 2.6, sweeping from angle ~ +130 deg down to -140 deg)
      // Angle theta: from Math.PI * 0.7 down to -Math.PI * 0.8
      const theta = 2.2 - Math.random() * 4.4;
      const r = 2.5 + (Math.random() - 0.5) * 0.6;
      px = -0.1 + Math.cos(theta) * r;
      py = -0.5 + Math.sin(theta) * r;
    }

    // Add gentle organic scatter
    const scatter = (Math.random() - 0.5) * 0.3;
    positions[i * 3] = (px + scatter) * scale;
    positions[i * 3 + 1] = (py + scatter) * scale;
    positions[i * 3 + 2] = pz;
  }

  return positions;
}

/**
 * Generates random positions inside a spherical shell for stars and nebula.
 */
export function generateStarField(count: number, minRadius: number = 30, maxRadius: number = 200): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = minRadius + Math.cbrt(Math.random()) * (maxRadius - minRadius);

    const sinPhi = Math.sin(phi);
    positions[i * 3] = r * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  return positions;
}
