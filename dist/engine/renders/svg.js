import { calculateBadges } from '../badges.js';
import { renderBarChart, renderDonutChart, renderRadarChart, renderHeatmapGrid } from '../charts.js';
import { computeLayout, getViewportConfig, detectTechStack, computeInsights, wrapText } from '../compositor.js';
const themeMap = {
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
export function renderToSVG(payload, type, themeName = 'blueprint') {
    const colors = themeMap[themeName] || themeMap.blueprint;
    const config = getViewportConfig(type);
    const layout = computeLayout(type);
    const badges = calculateBadges(payload).filter(b => b.unlocked);
    const techStack = detectTechStack(payload);
    const insights = computeInsights(payload);
    const { width, height } = config;
    // Render Panel Helper
    const drawPanel = (id, children) => {
        const box = layout[id];
        if (!box || box.x < 0)
            return '';
        return `
    <g id="panel-${id}" transform="translate(${box.x}, ${box.y})">
      <!-- Glassmorphic Card Panel Background -->
      <rect width="${box.width}" height="${box.height}" rx="12" fill="${colors.cardBg}" fill-opacity="0.6" stroke="${colors.grid}" stroke-width="1" class="glass-panel" />
      <rect width="${box.width}" height="${box.height}" rx="12" fill="none" stroke="${colors.stroke}" stroke-width="1.5" stroke-opacity="0.08" />
      
      <!-- Accent top bar -->
      <line x1="20" y1="0" x2="${box.width - 20}" y2="0" stroke="${colors.stroke}" stroke-width="1.5" stroke-opacity="0.4" />
      
      <!-- Panel Title -->
      <text x="25" y="30" fill="${colors.stroke}" font-size="12" font-weight="800" letter-spacing="1">${box.title.toUpperCase()}</text>
      
      ${children}
    </g>`;
    };
    // 1. Profile Block
    const profileHtml = () => {
        const box = layout['header'];
        if (!box)
            return '';
        const bioLines = wrapText(payload.profile.bio || 'Building the future, one commit at a time.', box.width - 240, 11, 2);
        return drawPanel('header', `
      <!-- Avatar Glow & Image Frame -->
      <g transform="translate(25, 45)">
        <circle cx="45" cy="45" r="42" fill="none" stroke="${colors.stroke}" stroke-width="2" />
        <clipPath id="avatar-clip-engine">
          <circle cx="45" cy="45" r="40" />
        </clipPath>
        <image href="${payload.profile.avatarUrl || 'https://avatars.githubusercontent.com/u/9919?v=4'}" x="5" y="5" width="80" height="80" clip-path="url(#avatar-clip-engine)" />
      </g>

      <!-- Profile Info -->
      <text x="135" y="65" fill="#ffffff" font-size="22" font-weight="700">${payload.profile.name.toUpperCase()}</text>
      <text x="135" y="85" fill="${colors.accent1}" font-size="13" font-weight="600">@${payload.profile.username.toUpperCase()}</text>
      
      <!-- Bio Lines -->
      ${bioLines.map((line, idx) => `<text x="135" y="${110 + idx * 16}" fill="#a8a8a8" font-size="11">${line}</text>`).join('')}

      <!-- Quick Badges -->
      <g transform="translate(${box.width - 210}, 35)">
        <rect width="185" height="38" rx="6" fill="${colors.bg}" stroke="${colors.grid}" stroke-width="1" />
        <text x="15" y="23" fill="#a8a8a8" font-size="10">Since:</text>
        <text x="65" y="23" fill="#ffffff" font-size="10" font-weight="700">${payload.profile.createdAt.substring(0, 10)}</text>
      </g>
      <g transform="translate(${box.width - 210}, 80)">
        <rect width="185" height="38" rx="6" fill="${colors.bg}" stroke="${colors.grid}" stroke-width="1" />
        <text x="15" y="23" fill="#a8a8a8" font-size="10">Class:</text>
        <text x="65" y="23" fill="${colors.accent2}" font-size="10" font-weight="700">${insights.rank.toUpperCase()}</text>
      </g>
    `);
    };
    // 2. Overview metrics
    const overviewHtml = () => {
        const box = layout['overview'];
        if (!box)
            return '';
        const items = [
            { label: 'Total Stars:', val: payload.metrics.totalStars },
            { label: 'Total Commits:', val: payload.metrics.commits },
            { label: 'Longest Streak:', val: payload.metrics.longestStreak },
            { label: 'Merged PRs:', val: payload.metrics.prsMerged },
            { label: 'Created Repos:', val: payload.metrics.reposCreated },
            { label: 'GitHub Grade:', val: payload.metrics.grade }
        ];
        const rowHeight = (box.height - 70) / items.length;
        return drawPanel('overview', `
      <g transform="translate(25, 60)">
        ${items.map((item, idx) => {
            const y = idx * rowHeight;
            return `
            <g transform="translate(0, ${y})">
              ${idx > 0 ? `<line x1="0" y1="-10" x2="${box.width - 50}" y2="-10" stroke="${colors.grid}" stroke-width="0.5" stroke-opacity="0.3" />` : ''}
              <text x="0" y="10" fill="#a8a8a8" font-size="12">${item.label}</text>
              <text x="${box.width - 50}" y="10" fill="#ffffff" font-size="13" font-weight="700" text-anchor="end">${item.val}</text>
            </g>
          `;
        }).join('')}
      </g>
    `);
    };
    // 3. Heatmap Matrix
    const heatmapHtml = () => {
        const box = layout['heatmap'];
        if (!box)
            return '';
        const startX = 50;
        const startY = 65;
        const cells = renderHeatmapGrid(payload.commitData, startX, startY, 7, 2.5, colors);
        return drawPanel('heatmap', `
      <!-- Stats Summary -->
      <g transform="translate(${box.width - 240}, 20)">
        <text x="0" y="10" fill="#666666" font-size="9">Total contributions:</text>
        <text x="120" y="10" fill="#ffffff" font-size="10" font-weight="700" text-anchor="end">${payload.metrics.totalContributions}</text>
        <text x="0" y="22" fill="#666666" font-size="9">Longest streak:</text>
        <text x="120" y="22" fill="${colors.accent2}" font-size="10" font-weight="700" text-anchor="end">${payload.metrics.longestStreak} days</text>
      </g>

      <!-- Calendar Matrix -->
      ${cells.map(c => `
        <rect x="${c.x.toFixed(1)}" y="${c.y.toFixed(1)}" width="7" height="7" rx="1.2" fill="${c.color}" class="data-node" />
      `).join('')}

      <!-- Week Labels -->
      <text x="20" y="${startY + 9.5 * 1}" fill="#666666" font-size="8">Mon</text>
      <text x="20" y="${startY + 9.5 * 3}" fill="#666666" font-size="8">Wed</text>
      <text x="20" y="${startY + 9.5 * 5}" fill="#666666" font-size="8">Fri</text>

      <!-- Month Labels -->
      <g fill="#666666" font-size="8" transform="translate(${startX}, ${startY - 10})">
        <text x="0">Aug</text>
        <text x="76">Oct</text>
        <text x="152">Dec</text>
        <text x="228">Feb</text>
        <text x="304">Apr</text>
        <text x="380">Jun</text>
      </g>
    `);
    };
    // 4. Bar Chart
    const barChartHtml = () => {
        const box = layout['barChart'];
        if (!box || box.x < 0)
            return '';
        const bars = renderBarChart(payload.pushHistory, box.width, box.height);
        return drawPanel('barChart', `
      <!-- Grid lines -->
      <line x1="40" y1="170" x2="${box.width - 20}" y2="170" stroke="${colors.grid}" stroke-width="0.5" stroke-opacity="0.5" />
      <line x1="40" y1="110" x2="${box.width - 20}" y2="110" stroke="${colors.grid}" stroke-width="0.5" stroke-dasharray="3,3" stroke-opacity="0.2" />

      <!-- Bars rendering -->
      ${bars.map((b, i) => `
        <rect x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="3" fill="${colors.stroke}">
          <animate attributeName="height" from="0" to="${b.h.toFixed(1)}" dur="1s" begin="0.1s" fill="freeze" />
          <animate attributeName="y" from="170" to="${b.y.toFixed(1)}" dur="1s" begin="0.1s" fill="freeze" />
        </rect>
        <text x="${(b.x + b.w / 2).toFixed(1)}" y="186" fill="#666666" font-size="8" text-anchor="middle">${['A', 'S', 'O', 'N', 'D', 'J', 'F', 'M', 'A', 'M', 'J', 'J'][i]}</text>
      `).join('')}
    `);
    };
    // 5. Donut / Languages
    const donutChartHtml = () => {
        const box = layout['donutChart'];
        if (!box)
            return '';
        const languages = payload.repos.reduce((acc, r) => {
            if (r.language) {
                const found = acc.find(l => l.name === r.language);
                if (found)
                    found.count++;
                else
                    acc.push({ name: r.language, count: 1, color: colors.stroke });
            }
            return acc;
        }, []);
        // Sort and calculate percentages
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
        const slices = renderDonutChart(sortedLangs, 100, 130, 50);
        return drawPanel('donutChart', `
      <!-- Trig Slices -->
      ${slices.map((s, idx) => `
        <path d="${s.path}" fill="none" stroke="${sortedLangs[idx].color}" stroke-width="16" stroke-linecap="round" />
      `).join('')}

      <!-- Center percentage text -->
      <text x="100" y="136" fill="#ffffff" font-size="16" font-weight="800" text-anchor="middle">${sortedLangs[0].percentage}%</text>
      <text x="100" y="148" fill="#666666" font-size="9" text-anchor="middle">${sortedLangs[0].name}</text>

      <!-- Legends list on right -->
      <g transform="translate(180, 65)">
        ${sortedLangs.map((l, idx) => `
          <g transform="translate(0, ${idx * 32})">
            <circle cx="0" cy="5" r="5" fill="${l.color}" />
            <text x="15" y="9" fill="#ffffff" font-size="11" font-weight="700">${l.name}</text>
            <text x="15" y="21" fill="#666666" font-size="9">${l.percentage}% representation</text>
          </g>
        `).join('')}
      </g>
    `);
    };
    // 6. Skill Radar
    const radarChartHtml = () => {
        const box = layout['radarChart'];
        if (!box)
            return '';
        const skills = [
            { label: 'Architecture', value: Math.min(100, payload.metrics.reposCreated * 6 + 40) },
            { label: 'Commits', value: Math.min(100, Math.floor(payload.metrics.commits / 10) + 20) },
            { label: 'OS Quality', value: Math.min(100, payload.metrics.prsMerged * 8 + 30) },
            { label: 'Popularity', value: Math.min(100, payload.metrics.totalStars * 2 + 10) },
            { label: 'Polyglot', value: Math.min(100, techStack.length * 10 + 20) }
        ];
        const radar = renderRadarChart(skills, box.width / 2, box.height / 2 + 10, Math.min(box.width, box.height) * 0.32);
        return drawPanel('radarChart', `
      <!-- Nested grid lines -->
      ${radar.gridPolygons.map(p => `
        <polygon points="${p}" fill="none" stroke="${colors.grid}" stroke-width="0.5" stroke-opacity="0.4" />
      `).join('')}

      <!-- Axis lines -->
      ${radar.axisLines.map(line => `
        <line x1="${line.x1.toFixed(1)}" y1="${line.y1.toFixed(1)}" x2="${line.x2.toFixed(1)}" y2="${line.y2.toFixed(1)}" stroke="${colors.grid}" stroke-width="0.5" stroke-opacity="0.4" />
      `).join('')}

      <!-- User Skills polygon fill -->
      <polygon points="${radar.pointsString}" fill="${colors.stroke}" fill-opacity="0.25" stroke="${colors.stroke}" stroke-width="1.5" />

      <!-- Labels -->
      ${radar.points.map((p, i) => {
            // Calculate label positions offsets
            const textAnchor = p.x > box.width / 2 ? 'start' : (p.x < box.width / 2 ? 'end' : 'middle');
            const offset = p.y < box.height / 2 + 10 ? -8 : 12;
            return `
          <text x="${p.x.toFixed(1)}" y="${(p.y + offset).toFixed(1)}" fill="#a8a8a8" font-size="9" text-anchor="${textAnchor}">${p.label}</text>
        `;
        }).join('')}
    `);
    };
    // 7. Repos List
    const reposHtml = () => {
        const box = layout['repos'];
        if (!box)
            return '';
        const sortedRepos = [...payload.repos].sort((a, b) => b.stars - a.stars).slice(0, 3);
        const cardWidth = (box.width - 60) / sortedRepos.length;
        return drawPanel('repos', `
      <g transform="translate(20, 55)">
        ${sortedRepos.map((r, idx) => {
            const x = idx * (cardWidth + 10);
            const descLines = wrapText(r.desc || 'No description provided.', cardWidth - 30, 10, 2);
            return `
            <g transform="translate(${x}, 0)">
              <rect width="${cardWidth}" height="200" rx="8" fill="${colors.bg}" stroke="${colors.grid}" stroke-width="1" />
              
              <!-- Repo Name -->
              <text x="15" y="30" fill="#ffffff" font-size="12" font-weight="700">${r.name.length > 18 ? r.name.substring(0, 16) + '..' : r.name}</text>
              
              <!-- Repo Language -->
              <text x="15" y="48" fill="${colors.accent1}" font-size="10" font-weight="500">${r.language || 'Markdown'}</text>
              
              <!-- Desc -->
              ${descLines.map((line, lIdx) => `
                <text x="15" y="${75 + lIdx * 15}" fill="#666666" font-size="10">${line}</text>
              `).join('')}

              <!-- Bottom Stats -->
              <g transform="translate(15, 175)" fill="#a8a8a8" font-size="10">
                <!-- Stars Icon/Text -->
                <circle cx="5" cy="5" r="4" fill="${colors.stroke}" />
                <text x="15" y="8">${r.stars} Stars</text>

                <!-- Forks Icon/Text -->
                <circle cx="85" cy="5" r="4" fill="${colors.accent2}" />
                <text x="95" y="8">${r.forks} Forks</text>
              </g>
            </g>
          `;
        }).join('')}
      </g>
    `);
    };
    // 8. Badges Grid
    const badgesHtml = () => {
        const box = layout['badges'];
        if (!box)
            return '';
        const maxBadges = 5;
        const activeBadges = badges.slice(0, maxBadges);
        const cardWidth = (box.width - 60) / maxBadges;
        return drawPanel('badges', `
      <g transform="translate(20, 55)">
        ${activeBadges.map((b, idx) => {
            const x = idx * (cardWidth + 10);
            const nameLines = wrapText(b.name, cardWidth - 20, 10, 1);
            return `
            <g transform="translate(${x}, 0)">
              <rect width="${cardWidth}" height="100" rx="8" fill="${colors.bg}" stroke="${colors.grid}" stroke-width="1" />
              
              <!-- Badge Ribbon/Indicator -->
              <circle cx="${cardWidth / 2}" cy="35" r="16" fill="${b.level === 'gold' ? '#f59e0b' : (b.level === 'silver' ? '#94a3b8' : '#b45309')}" fill-opacity="0.2" stroke="${b.level === 'gold' ? '#f59e0b' : (b.level === 'silver' ? '#94a3b8' : '#b45309')}" stroke-width="1.5" />
              <text x="${cardWidth / 2}" y="40" fill="#ffffff" font-size="14" font-weight="800" text-anchor="middle">${b.name[0]}</text>
              
              <!-- Name & Tier -->
              <text x="${cardWidth / 2}" y="70" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">${nameLines[0]}</text>
              <text x="${cardWidth / 2}" y="85" fill="${colors.accent2}" font-size="9" text-anchor="middle">${b.level.toUpperCase()}</text>
            </g>
          `;
        }).join('')}
      </g>
    `);
    };
    // 9. Tech Stack
    const techStackHtml = () => {
        const box = layout['techStack'];
        if (!box || box.x < 0)
            return '';
        const cols = 4;
        const badgeW = (box.width - 60) / cols;
        const badgeH = 26;
        return drawPanel('techStack', `
      <g transform="translate(20, 50)">
        ${techStack.map((tech, idx) => {
            const r = Math.floor(idx / cols);
            const c = idx % cols;
            const x = c * (badgeW + 10);
            const y = r * (badgeH + 10);
            return `
            <g transform="translate(${x}, ${y})">
              <rect width="${badgeW}" height="${badgeH}" rx="5" fill="${colors.bg}" stroke="${colors.grid}" stroke-width="0.8" />
              <circle cx="12" cy="13" r="4" fill="${colors.stroke}" />
              <text x="24" y="17" fill="#ffffff" font-size="10" font-weight="600">${tech}</text>
            </g>
          `;
        }).join('')}
      </g>
    `);
    };
    // 10. Insights
    const insightsHtml = () => {
        const box = layout['insights'];
        if (!box || box.x < 0)
            return '';
        const list = [
            { label: 'Primary Focus:', val: insights.personality },
            { label: 'Dev rank:', val: insights.rank },
            { label: 'OS Score:', val: insights.osScore + ' / 100' },
            { label: 'Coffee Level:', val: '☕'.repeat(insights.coffeeLevel) }
        ];
        return drawPanel('insights', `
      <g transform="translate(25, 55)">
        ${list.map((item, idx) => `
          <g transform="translate(0, ${idx * 28})">
            <text x="0" y="10" fill="#666666" font-size="11">${item.label}</text>
            <text x="${box.width - 50}" y="10" fill="#ffffff" font-size="11" font-weight="700" text-anchor="end">${item.val}</text>
          </g>
        `).join('')}
      </g>
    `);
    };
    // 11. Timeline & Milestones
    const timelineHtml = () => {
        const box = layout['timeline'];
        if (!box || box.x < 0)
            return '';
        const milestones = [
            { year: '2021', label: 'Joined GitHub' },
            { year: '2023', label: 'First 100 stars' },
            { year: '2025', label: 'PR Master' },
            { year: 'Active', label: insights.rank }
        ];
        const stepW = (box.width - 100) / (milestones.length - 1);
        return drawPanel('timeline', `
      <!-- Timeline path lines -->
      <line x1="50" y1="65" x2="${box.width - 50}" y2="65" stroke="${colors.grid}" stroke-width="1.5" stroke-dasharray="4,4" />
      
      <!-- Steps circles & labels -->
      ${milestones.map((m, idx) => {
            const x = 50 + idx * stepW;
            return `
          <g transform="translate(${x}, 65)">
            <circle cx="0" cy="0" r="6" fill="${colors.bg}" stroke="${colors.stroke}" stroke-width="2" />
            <circle cx="0" cy="0" r="2" fill="${colors.accent2}" />
            <text x="0" y="-14" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">${m.year}</text>
            <text x="0" y="20" fill="#666666" font-size="9" text-anchor="middle">${m.label}</text>
          </g>
        `;
        }).join('')}
    `);
    };
    // 12. Footer Block
    const footerHtml = () => {
        const box = layout['footer'];
        if (!box || box.x < 0)
            return '';
        return `
    <g transform="translate(${box.x}, ${box.y})">
      <line x1="0" y1="0" x2="${box.width}" y2="0" stroke="${colors.grid}" stroke-width="0.5" stroke-opacity="0.5" />
      <text x="0" y="24" fill="#666666" font-size="10" font-family="monospace">DEVELOPED BY GITHUB.COM/GARVIT-821 // LAUNCHED 2026</text>
      <text x="${box.width}" y="24" fill="#666666" font-size="10" font-family="monospace" text-anchor="end">THEME: ${themeName.toUpperCase()} // RESOLUTION: ${type.toUpperCase()}</text>
    </g>`;
    };
    // Compile final responsive SVG string
    return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background:${colors.bg}; font-family:'JetBrains Mono', monospace;">
  <defs>
    <!-- Fonts import -->
    <style dangerouslySetInnerHTML="true">
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&amp;display=swap');
      
      /* Glassmorphism panel styling */
      .glass-panel {
        backdrop-filter: blur(8px);
      }

      /* Staggered load animation */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .panel-group {
        animation: fadeIn 0.8s ease-in-out forwards;
      }

      /* Heatmap pulsing cells */
      @keyframes cellPulse {
        0%, 100% { fill-opacity: 0.5; }
        50% { fill-opacity: 1; }
      }
      .data-node {
        animation: cellPulse 3s infinite ease-in-out;
      }
    </style>

    <!-- Grid lines background -->
    <pattern id="engine-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="none" />
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${colors.grid}" stroke-width="0.5" stroke-opacity="0.12" />
    </pattern>
  </defs>

  <!-- Background grid -->
  <rect width="${width}" height="${height}" fill="url(#engine-grid)" />

  <!-- Outer frames styling -->
  <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="${colors.stroke}" stroke-width="0.5" stroke-opacity="0.1" />
  <rect x="15" y="15" width="${width - 30}" height="${height - 30}" fill="none" stroke="${colors.stroke}" stroke-width="1" stroke-opacity="0.2" />

  <!-- Rendered Panels -->
  ${profileHtml()}
  ${overviewHtml()}
  ${heatmapHtml()}
  ${barChartHtml()}
  ${donutChartHtml()}
  ${radarChartHtml()}
  ${reposHtml()}
  ${badgesHtml()}
  ${techStackHtml()}
  ${insightsHtml()}
  ${timelineHtml()}
  ${footerHtml()}
</svg>`;
}
