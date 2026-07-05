import { GitHubDataPayload, ViewportType, ThemeColors } from '../types.js';
import { calculateBadges } from '../badges.js';
import {
  renderLineChart,
  renderBarChart,
  renderDonutChart,
  renderRadarChart,
  renderHeatmapGrid
} from '../charts.js';
import {
  computeLayout,
  getViewportConfig,
  detectTechStack,
  computeInsights,
  wrapText
} from '../compositor.js';

const themeMap: Record<'blueprint' | 'cyberpunk' | 'matrix' | 'amber', ThemeColors> = {
  blueprint: {
    bg: '#05050a',
    grid: '#1b1432',
    stroke: '#7b3aed',
    accent1: '#a855f7',
    accent2: '#10b981',
    cardBg: '#0b0a15'
  },
  cyberpunk: {
    bg: '#0a0512',
    grid: '#ff007f',
    stroke: '#ff007f',
    accent1: '#00ffff',
    accent2: '#bc13fe',
    cardBg: '#11061e'
  },
  matrix: {
    bg: '#020804',
    grid: '#00ff41',
    stroke: '#00ff41',
    accent1: '#008000',
    accent2: '#39ff14',
    cardBg: '#051408'
  },
  amber: {
    bg: '#120d0a',
    grid: '#f59e0b',
    stroke: '#f59e0b',
    accent1: '#d97706',
    accent2: '#ef4444',
    cardBg: '#1c140f'
  }
};

/**
 * Draws the complete technical career blueprint onto an HTML5 canvas context.
 */
export function drawToCanvas(
  ctx: any, // CanvasRenderingContext2D
  payload: GitHubDataPayload,
  type: ViewportType,
  themeName: 'blueprint' | 'cyberpunk' | 'matrix' | 'amber' = 'blueprint'
): void {
  const colors = themeMap[themeName] || themeMap.blueprint;
  const config = getViewportConfig(type);
  const layout = computeLayout(type);
  const badges = calculateBadges(payload).filter(b => b.unlocked);
  const techStack = detectTechStack(payload);
  const insights = computeInsights(payload);

  const { width, height } = config;

  // 1. Draw Canvas background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);

  // Background Grid patterns
  ctx.strokeStyle = colors.grid + '1e'; // low opacity
  ctx.lineWidth = 0.5;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw panel cards helper
  const drawPanel = (id: string, drawContent: (cx: number, cy: number, w: number, h: number) => void) => {
    const box = layout[id];
    if (!box || box.x < 0) return;

    ctx.fillStyle = colors.cardBg;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(box.x, box.y, box.width, box.height);
    ctx.globalAlpha = 1.0;

    // Borders
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    ctx.strokeStyle = colors.stroke;
    ctx.globalAlpha = 0.08;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(box.x + 1, box.y + 1, box.width - 2, box.height - 2);
    ctx.globalAlpha = 1.0;

    // Accent line top
    ctx.strokeStyle = colors.stroke;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(box.x + 20, box.y);
    ctx.lineTo(box.x + box.width - 20, box.y);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Panel Title
    ctx.fillStyle = colors.stroke;
    ctx.font = '800 11px sans-serif';
    ctx.fillText(box.title.toUpperCase(), box.x + 25, box.y + 30);

    drawContent(box.x, box.y, box.width, box.height);
  };

  // 1. Profile Block
  drawPanel('header', (cx, cy, w, h) => {
    // Avatar Frame
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx + 70, cy + 90, 42, 0, Math.PI * 2);
    ctx.stroke();

    // Name & Username
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px sans-serif';
    ctx.fillText(payload.profile.name.toUpperCase(), cx + 135, cy + 65);

    ctx.fillStyle = colors.accent1;
    ctx.font = '600 13px monospace';
    ctx.fillText(`@${payload.profile.username.toUpperCase()}`, cx + 135, cy + 85);

    // Bio
    ctx.fillStyle = '#a8a8a8';
    ctx.font = '11px sans-serif';
    const bioLines = wrapText(payload.profile.bio || 'Building the future.', w - 240, 11, 2);
    bioLines.forEach((line, idx) => {
      ctx.fillText(line, cx + 135, cy + 110 + idx * 16);
    });

    // Right Quick tags
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.fillStyle = colors.bg;
    ctx.strokeRect(cx + w - 210, cy + 35, 185, 38);
    ctx.fillRect(cx + w - 210, cy + 35, 185, 38);

    ctx.fillStyle = '#a8a8a8';
    ctx.font = '10px sans-serif';
    ctx.fillText('Since:', cx + w - 195, cy + 58);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 10px monospace';
    ctx.fillText(payload.profile.createdAt.substring(0, 10), cx + w - 145, cy + 58);

    // Class Tag
    ctx.strokeStyle = colors.grid;
    ctx.strokeRect(cx + w - 210, cy + 80, 185, 38);
    ctx.fillRect(cx + w - 210, cy + 80, 185, 38);

    ctx.fillStyle = '#a8a8a8';
    ctx.font = '10px sans-serif';
    ctx.fillText('Class:', cx + w - 195, cy + 103);
    ctx.fillStyle = colors.accent2;
    ctx.font = '700 10px monospace';
    ctx.fillText(insights.rank.toUpperCase(), cx + w - 145, cy + 103);
  });

  // 2. Overview metrics
  drawPanel('overview', (cx, cy, w, h) => {
    const items = [
      { label: 'Total Stars:', val: payload.metrics.totalStars },
      { label: 'Total Commits:', val: payload.metrics.commits },
      { label: 'Longest Streak:', val: payload.metrics.longestStreak },
      { label: 'Merged PRs:', val: payload.metrics.prsMerged },
      { label: 'Created Repos:', val: payload.metrics.reposCreated },
      { label: 'GitHub Grade:', val: payload.metrics.grade }
    ];

    const rowHeight = (h - 70) / items.length;
    items.forEach((item, idx) => {
      const y = cy + 60 + idx * rowHeight;
      if (idx > 0) {
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx + 25, y - 10);
        ctx.lineTo(cx + w - 25, y - 10);
        ctx.stroke();
      }

      ctx.fillStyle = '#a8a8a8';
      ctx.font = '12px sans-serif';
      ctx.fillText(item.label, cx + 25, y + 10);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 13px monospace';
      ctx.fillText(item.val.toString(), cx + w - 25, y + 10, w - 150);
    });
  });

  // 3. Heatmap Matrix
  drawPanel('heatmap', (cx, cy, w, h) => {
    const cells = renderHeatmapGrid(payload.commitData, cx + 50, cy + 65, 7, 2.5, colors);

    ctx.fillStyle = '#666666';
    ctx.font = '8px monospace';
    ctx.fillText('Mon', cx + 20, cy + 65 + 9.5 * 1 + 5);
    ctx.fillText('Wed', cx + 20, cy + 65 + 9.5 * 3 + 5);
    ctx.fillText('Fri', cx + 20, cy + 65 + 9.5 * 5 + 5);

    // Render cells
    cells.forEach(c => {
      ctx.fillStyle = c.color;
      ctx.fillRect(c.x, c.y, 7, 7);
    });
  });

  // 4. Bar Chart
  drawPanel('barChart', (cx, cy, w, h) => {
    const bars = renderBarChart(payload.pushHistory, w, h);
    bars.forEach((b, idx) => {
      ctx.fillStyle = colors.stroke;
      ctx.fillRect(cx + b.x, cy + b.y, b.w, b.h);

      ctx.fillStyle = '#666666';
      ctx.font = '8px monospace';
      ctx.fillText(
        ['A', 'S', 'O', 'N', 'D', 'J', 'F', 'M', 'A', 'M', 'J', 'J'][idx],
        cx + b.x + b.w / 2 - 3,
        cy + 186
      );
    });
  });

  // 5. Donut / Languages
  drawPanel('donutChart', (cx, cy, w, h) => {
    const languages = payload.repos.reduce((acc: any[], r) => {
      if (r.language) {
        const found = acc.find(l => l.name === r.language);
        if (found) found.count++;
        else acc.push({ name: r.language, count: 1, color: colors.stroke });
      }
      return acc;
    }, []);

    const totalCount = languages.reduce((sum, l) => sum + l.count, 0);
    const sortedLangs = languages
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
      .map((l, i) => ({
        name: l.name,
        percentage: totalCount ? parseFloat(((l.count / totalCount) * 100).toFixed(1)) : 0,
        color: [colors.stroke, colors.accent1, colors.accent2, '#ffffff'][i] || '#666666'
      }));

    if (sortedLangs.length === 0) {
      sortedLangs.push({ name: 'JavaScript', percentage: 100, color: colors.stroke });
    }

    // Draw slices
    let cumulativeAngle = -Math.PI / 2;
    sortedLangs.forEach(lang => {
      const angle = (lang.percentage / 100) * Math.PI * 2;
      ctx.strokeStyle = lang.color;
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.arc(cx + 100, cy + 130, 50, cumulativeAngle, cumulativeAngle + angle);
      ctx.stroke();
      cumulativeAngle += angle;
    });

    // Draw Legends
    sortedLangs.forEach((l, idx) => {
      const y = cy + 65 + idx * 32;
      ctx.fillStyle = l.color;
      ctx.beginPath();
      ctx.arc(cx + 180, y + 5, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 11px sans-serif';
      ctx.fillText(l.name, cx + 195, y + 9);

      ctx.fillStyle = '#666666';
      ctx.font = '9px sans-serif';
      ctx.fillText(`${l.percentage}% representation`, cx + 195, y + 21);
    });
  });

  // 6. Skill Radar
  drawPanel('radarChart', (cx, cy, w, h) => {
    const skills = [
      { label: 'Architecture', value: Math.min(100, payload.metrics.reposCreated * 6 + 40) },
      { label: 'Commits', value: Math.min(100, Math.floor(payload.metrics.commits / 10) + 20) },
      { label: 'OS Quality', value: Math.min(100, payload.metrics.prsMerged * 8 + 30) },
      { label: 'Popularity', value: Math.min(100, payload.metrics.totalStars * 2 + 10) },
      { label: 'Polyglot', value: Math.min(100, techStack.length * 10 + 20) }
    ];

    const radar = renderRadarChart(skills, cx + w / 2, cy + h / 2 + 10, Math.min(w, h) * 0.32);

    // Draw axis and grid polygons
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;
    radar.gridPolygons.forEach(p => {
      ctx.beginPath();
      const coords = p.split(' ').map(c => c.split(',').map(Number));
      ctx.moveTo(coords[0][0], coords[0][1]);
      for (let i = 1; i < coords.length; i++) {
        ctx.lineTo(coords[i][0], coords[i][1]);
      }
      ctx.closePath();
      ctx.stroke();
    });

    // Skill poly filled
    ctx.fillStyle = colors.stroke;
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    radar.points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.stroke();
  });

  // 7. Repos List
  drawPanel('repos', (cx, cy, w, h) => {
    const sortedRepos = [...payload.repos].sort((a, b) => b.stars - a.stars).slice(0, 3);
    const cardWidth = (w - 60) / sortedRepos.length;

    sortedRepos.forEach((r, idx) => {
      const rx = cx + 20 + idx * (cardWidth + 10);
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.fillStyle = colors.bg;
      ctx.fillRect(rx, cy + 55, cardWidth, 200);
      ctx.strokeRect(rx, cy + 55, cardWidth, 200);

      // Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 12px sans-serif';
      ctx.fillText(r.name.substring(0, 16), rx + 15, cy + 85);

      // Lang
      ctx.fillStyle = colors.accent1;
      ctx.font = '600 10px monospace';
      ctx.fillText(r.language || 'Markdown', rx + 15, cy + 103);
    });
  });

  // 8. Badges Grid
  drawPanel('badges', (cx, cy, w, h) => {
    const activeBadges = badges.slice(0, 5);
    const cardWidth = (w - 60) / 5;

    activeBadges.forEach((b, idx) => {
      const bx = cx + 20 + idx * (cardWidth + 10);
      ctx.strokeStyle = colors.grid;
      ctx.fillStyle = colors.bg;
      ctx.fillRect(bx, cy + 55, cardWidth, 100);
      ctx.strokeRect(bx, cy + 55, cardWidth, 100);

      // Badge name
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 10px sans-serif';
      ctx.fillText(b.name.substring(0, 15), bx + 10, cy + 90);
    });
  });

  // 9. Tech Stack
  drawPanel('techStack', (cx, cy, w, h) => {
    const cols = 4;
    const badgeW = (w - 60) / cols;
    const badgeH = 26;

    techStack.forEach((tech, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const tx = cx + 20 + c * (badgeW + 10);
      const ty = cy + 50 + r * (badgeH + 10);

      ctx.strokeStyle = colors.grid;
      ctx.fillStyle = colors.bg;
      ctx.fillRect(tx, ty, badgeW, badgeH);
      ctx.strokeRect(tx, ty, badgeW, badgeH);

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 10px monospace';
      ctx.fillText(tech, tx + 24, ty + 17);
    });
  });

  // 10. Insights
  drawPanel('insights', (cx, cy, w, h) => {
    const list = [
      { label: 'Primary Focus:', val: insights.personality },
      { label: 'Dev rank:', val: insights.rank },
      { label: 'OS Score:', val: insights.osScore.toString() },
      { label: 'Coffee Level:', val: 'Coffee level 4/5' }
    ];

    list.forEach((item, idx) => {
      const y = cy + 55 + idx * 28;
      ctx.fillStyle = '#666666';
      ctx.font = '11px sans-serif';
      ctx.fillText(item.label, cx + 25, y + 10);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 11px monospace';
      ctx.fillText(item.val, cx + w - 25, y + 10);
    });
  });

  // 11. Timeline
  const timelineBox = layout['timeline'];
  if (timelineBox && timelineBox.x >= 0) {
    drawPanel('timeline', (cx, cy, w, h) => {
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + 50, cy + 65);
      ctx.lineTo(cx + w - 50, cy + 65);
      ctx.stroke();
    });
  }

  // 12. Footer Block
  const footerBox = layout['footer'];
  if (footerBox && footerBox.x >= 0) {
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(footerBox.x, footerBox.y);
    ctx.lineTo(footerBox.x + footerBox.width, footerBox.y);
    ctx.stroke();

    ctx.fillStyle = '#666666';
    ctx.font = '10px monospace';
    ctx.fillText('DEVELOPED BY GITHUB.COM/GARVIT-821 // LAUNCHED 2026', footerBox.x, footerBox.y + 24);
  }
}
