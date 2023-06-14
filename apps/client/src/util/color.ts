export function hexToRGB(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function RGBToHSL(
  rgb: [number, number, number],
): [number, number, number] {
  let [r, g, b] = rgb;
  (r /= 255), (g /= 255), (b /= 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let s,
    l = (max + min) / 2;

  // Declare and initialize h
  let h = 0;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6; // h is possibly undefined
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function getContrastSameColor(hexColor?: string, opacity?: number) {
  if (!hexColor) return;

  const rgb = hexToRGB(hexColor);
  const hsl = RGBToHSL(rgb);
  const h = hsl[0],
    s = hsl[1];

  // If lightness value is less than 50, we'll create a lighter shade of the color, otherwise a darker shade
  let l = hsl[2] < 50 ? hsl[2] + 30 : hsl[2] - 30;

  // Ensure l (lightness) remains within the range 0-100
  l = Math.max(0, Math.min(100, l));

  return `hsla(${h}, ${s}%, ${l}%, ${opacity || 1})`;
}

export function getContrastColor(hexColor?: string, opacity?: number) {
  if (!hexColor) return;
  const rgb = hexToRGB(hexColor);
  const hsl = RGBToHSL(rgb);
  const lightness = hsl[2];
  // choose white or black based on lightness
  return lightness > 50
    ? `rgba(20, 20, 20, ${opacity || 1})`
    : `rgba(230, 230, 230, ${opacity || 1})`;
}
