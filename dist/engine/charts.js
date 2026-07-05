/**
 * Generates an SVG cubic Bezier path for a smooth line chart
 */
export function renderLineChart(data, width, height, strokeColor, accentColor) {
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const minVal = 0;
    const maxVal = Math.max(...data, 10);
    const points = data.map((val, idx) => {
        const x = padding + (idx / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
        return { x, y };
    });
    if (points.length === 0) {
        return { path: '', areaPath: '', points: [] };
    }
    // Smooth Bezier Curve generator
    let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const cpX1 = p0.x + (p1.x - p0.x) / 2;
        const cpY1 = p0.y;
        const cpX2 = p0.x + (p1.x - p0.x) / 2;
        const cpY2 = p1.y;
        path += ` C ${cpX1.toFixed(1)} ${cpY1.toFixed(1)}, ${cpX2.toFixed(1)} ${cpY2.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    // Generate shaded area path
    const floorY = padding + chartHeight;
    const areaPath = `${path} L ${points[points.length - 1].x.toFixed(1)} ${floorY.toFixed(1)} L ${points[0].x.toFixed(1)} ${floorY.toFixed(1)} Z`;
    return { path, areaPath, points };
}
/**
 * Calculates rect elements for a monthly commit bar chart
 */
export function renderBarChart(data, width, height) {
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 30;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxVal = Math.max(...data, 10);
    const barGap = 12;
    const barWidth = (chartWidth - barGap * (data.length - 1)) / data.length;
    return data.map((val, idx) => {
        const w = barWidth;
        const h = (val / maxVal) * chartHeight;
        const x = paddingLeft + idx * (barWidth + barGap);
        const y = paddingTop + chartHeight - h;
        return { x, y, w, h, value: val };
    });
}
/**
 * Calculates arc segments and metadata for a Languages Donut Chart using trig
 */
export function renderDonutChart(languages, cx, cy, radius) {
    let cumulativeAngle = -Math.PI / 2; // Start from top
    const total = languages.reduce((sum, lang) => sum + lang.percentage, 0);
    return languages.map(lang => {
        const percentage = lang.percentage;
        const angleRange = (percentage / total) * Math.PI * 2;
        const startAngle = cumulativeAngle;
        const endAngle = cumulativeAngle + angleRange;
        cumulativeAngle = endAngle;
        const xStart = cx + radius * Math.cos(startAngle);
        const yStart = cy + radius * Math.sin(startAngle);
        const xEnd = cx + radius * Math.cos(endAngle);
        const yEnd = cy + radius * Math.sin(endAngle);
        const largeArcFlag = angleRange > Math.PI ? 1 : 0;
        const path = `M ${xStart.toFixed(1)} ${yStart.toFixed(1)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${xEnd.toFixed(1)} ${yEnd.toFixed(1)}`;
        // Text Label Coordinates in center of slice
        const midAngle = startAngle + angleRange / 2;
        const labelRadius = radius + 22;
        const labelX = cx + labelRadius * Math.cos(midAngle);
        const labelY = cy + labelRadius * Math.sin(midAngle);
        return {
            path,
            percentage,
            labelX,
            labelY,
            midAngle
        };
    });
}
/**
 * Calculates geometric angular points for a 5-dimension radar skill chart
 */
export function renderRadarChart(skills, cx, cy, radius) {
    const dimensions = skills.length;
    const stepAngle = (Math.PI * 2) / dimensions;
    // 1. Grid Polygon coordinates (3 nested grids at 30%, 65%, 100% scale)
    const scales = [0.35, 0.65, 1.0];
    const gridPolygons = scales.map(scale => {
        const r = radius * scale;
        const polyPoints = Array.from({ length: dimensions }, (_, i) => {
            const angle = i * stepAngle - Math.PI / 2;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        });
        return polyPoints.join(' ');
    });
    // 2. Axis Lines
    const axisLines = Array.from({ length: dimensions }, (_, i) => {
        const angle = i * stepAngle - Math.PI / 2;
        return {
            x1: cx,
            y1: cy,
            x2: cx + radius * Math.cos(angle),
            y2: cy + radius * Math.sin(angle)
        };
    });
    // 3. User skills polygon
    const maxVal = 100;
    const points = skills.map((s, i) => {
        const angle = i * stepAngle - Math.PI / 2;
        const r = radius * (s.value / maxVal);
        return {
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle),
            label: s.label,
            value: s.value
        };
    });
    const pointsString = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    return {
        pointsString,
        points,
        gridPolygons,
        axisLines
    };
}
/**
 * Calculates precise coordinates for a 7x53 calendar layout box matrix
 */
export function renderHeatmapGrid(commitData, startX, startY, squareSize, gap, colors) {
    // Ensure we have exactly 371 cells (53 columns * 7 rows)
    const data = commitData.length >= 371 ? commitData : Array.from({ length: 371 }, (_, i) => 0);
    const colSize = squareSize + gap;
    // Threshold colors
    const getFill = (val) => {
        if (val === 0)
            return colors.cardBg;
        if (val < 3)
            return colors.accent2 + '3a'; // 25% opacity
        if (val < 6)
            return colors.accent2 + '77'; // 50% opacity
        if (val < 10)
            return colors.accent2 + 'cc'; // 80% opacity
        return colors.accent2; // 100%
    };
    const cells = [];
    for (let c = 0; c < 53; c++) {
        for (let r = 0; r < 7; r++) {
            const idx = c * 7 + r;
            const val = data[idx] || 0;
            const x = startX + c * colSize;
            const y = startY + r * colSize;
            cells.push({
                x,
                y,
                val,
                color: getFill(val)
            });
        }
    }
    return cells;
}
