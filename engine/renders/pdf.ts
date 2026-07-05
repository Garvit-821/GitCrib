import { GitHubDataPayload, ViewportType, ThemeColors } from '../types.js';
import { calculateBadges } from '../badges.js';
import { computeLayout, getViewportConfig, wrapText } from '../compositor.js';

const themeMap: Record<'blueprint' | 'cyberpunk' | 'matrix' | 'amber', ThemeColors> = {
  blueprint: { bg: '#05050a', grid: '#1b1432', stroke: '#7b3aed', accent1: '#a855f7', accent2: '#10b981', cardBg: '#0b0a15' },
  cyberpunk: { bg: '#0a0512', grid: '#ff007f', stroke: '#ff007f', accent1: '#00ffff', accent2: '#bc13fe', cardBg: '#11061e' },
  matrix: { bg: '#020804', grid: '#00ff41', stroke: '#00ff41', accent1: '#008000', accent2: '#39ff14', cardBg: '#051408' },
  amber: { bg: '#120d0a', grid: '#f59e0b', stroke: '#f59e0b', accent1: '#d97706', accent2: '#ef4444', cardBg: '#1c140f' }
};

// Helper: convert hex color string to PDF RGB decimals (e.g. "#7b3aed" -> "0.48 0.22 0.92")
function hexToPdfRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return `${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)}`;
}

export function renderToPDF(
  payload: GitHubDataPayload,
  type: ViewportType,
  themeName: 'blueprint' | 'cyberpunk' | 'matrix' | 'amber' = 'blueprint'
): Uint8Array {
  const colors = themeMap[themeName] || themeMap.blueprint;
  const config = getViewportConfig(type);
  const layout = computeLayout(type);
  const { width, height } = config;

  const bgRgb = hexToPdfRgb(colors.bg);
  const gridRgb = hexToPdfRgb(colors.grid);
  const strokeRgb = hexToPdfRgb(colors.stroke);
  const cardRgb = hexToPdfRgb(colors.cardBg);

  // PDF stream vector instructions list
  const stream: string[] = [];

  // Set Background fill
  stream.push(`q`);
  stream.push(`${bgRgb} rg`);
  stream.push(`0 0 ${width} ${height} re f`);
  stream.push(`Q`);

  // Draw background grids
  stream.push(`q`);
  stream.push(`${gridRgb} RG`);
  stream.push(`0.5 w`);
  for (let x = 0; x < width; x += 80) {
    stream.push(`m ${x} 0 l ${x} ${height} s`);
  }
  for (let y = 0; y < height; y += 80) {
    stream.push(`m 0 ${y} l ${width} ${y} s`);
  }
  stream.push(`Q`);

  // Draw modular panels
  Object.entries(layout).forEach(([id, box]) => {
    if (box.x < 0) return;
    
    // Invert Y axis coordinates because PDF page space starts at bottom-left corner
    const pdfY = height - box.y - box.height;

    stream.push(`q`);
    // Panel Background
    stream.push(`${cardRgb} rg`);
    stream.push(`${box.x} ${pdfY} ${box.width} ${box.height} re f`);
    
    // Panel border
    stream.push(`${gridRgb} RG`);
    stream.push(`1 w`);
    stream.push(`${box.x} ${pdfY} ${box.width} ${box.height} re s`);

    // Top indicator Accent line
    stream.push(`${strokeRgb} RG`);
    stream.push(`2 w`);
    stream.push(`m ${box.x + 20} ${pdfY + box.height} l ${box.x + box.width - 20} ${pdfY + box.height} s`);
    stream.push(`Q`);

    // Title text
    stream.push(`q`);
    stream.push(`${strokeRgb} rg`);
    stream.push(`BT`);
    stream.push(`/F1 11 Tf`);
    stream.push(`${box.x + 25} ${pdfY + box.height - 25} Td`);
    stream.push(`(${box.title.toUpperCase()}) Tj`);
    stream.push(`ET`);
    stream.push(`Q`);
  });

  // Basic Profile Text drawing
  const headerBox = layout['header'];
  if (headerBox && headerBox.x >= 0) {
    const pdfY = height - headerBox.y - headerBox.height;
    
    stream.push(`q`);
    stream.push(`1 1 1 rg`); // White color
    stream.push(`BT`);
    stream.push(`/F1 18 Tf`);
    stream.push(`${headerBox.x + 135} ${pdfY + headerBox.height - 60} Td`);
    stream.push(`(${payload.profile.name.toUpperCase()}) Tj`);
    stream.push(`ET`);

    stream.push(`BT`);
    stream.push(`/F1 11 Tf`);
    stream.push(`${headerBox.x + 135} ${pdfY + headerBox.height - 80} Td`);
    stream.push(`(@${payload.profile.username.toUpperCase()}) Tj`);
    stream.push(`ET`);

    // Bio Wrap lines
    const bioLines = wrapText(payload.profile.bio || 'Building things.', headerBox.width - 240, 11, 2);
    bioLines.forEach((line, idx) => {
      stream.push(`BT`);
      stream.push(`/F1 9 Tf`);
      stream.push(`0.66 0.66 0.66 rg`);
      stream.push(`${headerBox.x + 135} ${pdfY + headerBox.height - 105 - idx * 14} Td`);
      // Escape parenthesis to keep PDF syntax correct
      const escaped = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      stream.push(`(${escaped}) Tj`);
      stream.push(`ET`);
    });
    stream.push(`Q`);
  }

  // Footer branding
  const footerBox = layout['footer'];
  if (footerBox && footerBox.x >= 0) {
    const pdfY = height - footerBox.y - footerBox.height;
    stream.push(`q`);
    stream.push(`0.5 0.5 0.5 rg`);
    stream.push(`BT`);
    stream.push(`/F1 9 Tf`);
    stream.push(`${footerBox.x} ${pdfY + 24} Td`);
    stream.push(`(DEVELOPED BY GITHUB.COM/GARVIT-821 // LAUNCHED 2026) Tj`);
    stream.push(`ET`);
    stream.push(`Q`);
  }

  // Combine stream body
  const streamBody = stream.join('\n');
  const streamLength = streamBody.length;

  // Build compliant basic PDF document structure catalog
  const pdfTemplate = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${streamBody}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000247 00000 n 
0000000320 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
%%EOF`;

  const encoder = new TextEncoder();
  return encoder.encode(pdfTemplate);
}
