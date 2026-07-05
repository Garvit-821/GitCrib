import { renderToSVG } from './renders/svg.js';
import { renderToPDF } from './renders/pdf.js';
import { drawToCanvas } from './renders/canvas.js';
import { calculateBadges } from './badges.js';
import { detectTechStack, computeInsights } from './compositor.js';
// Mock GitHub payload matching types.ts
const mockPayload = {
    profile: {
        name: 'Garvit Prakash',
        username: 'Garvit-821',
        bio: 'Software engineer & builder. Creating GitCrib developer technical blueprint infographics.',
        location: 'New Delhi, India',
        company: 'GitCrib Dev',
        website: 'https://github.com/Garvit-821',
        twitter: 'garvit_821',
        followers: 120,
        following: 75,
        createdAt: '2021-08-15T00:00:00Z',
        hireable: true,
        email: 'garvit@example.com',
        orgCount: 3,
        pinnedRepos: ['GitCrib', 'StatPrint', 'VisionSystem'],
        profileLink: 'https://github.com/Garvit-821',
        avatarUrl: 'https://avatars.githubusercontent.com/u/82121?v=4'
    },
    metrics: {
        totalStars: 520,
        forks: 140,
        watchers: 85,
        publicRepos: 32,
        privateRepos: 10,
        gists: 4,
        accountAge: 5,
        grade: 'A+',
        currentStreak: 12,
        longestStreak: 45,
        totalContributions: 1420,
        yearlyContributions: 850,
        monthlyContributions: 120,
        commits: 1100,
        prsMerged: 42,
        prsOpen: 5,
        prsClosed: 8,
        reposContributedTo: 8,
        packages: 2,
        releases: 14,
        projects: 3,
        discussions: 5,
        codeReviews: 24,
        starsGiven: 180,
        reposCreated: 18,
        avgCommitsFreq: 3.2,
        avgContributionsFreq: 4.1
    },
    repos: [
        {
            name: 'GitCrib',
            desc: 'Sleek, customizable developer blue-print posters, banners, and layout engine configs for profiles.',
            language: 'TypeScript',
            stars: 480,
            forks: 120,
            issues: 12,
            watchers: 80,
            size: 4500,
            license: 'MIT',
            createdAt: '2025-01-10T12:00:00Z',
            updatedAt: '2026-07-01T15:00:00Z',
            topics: ['react', 'next', 'svg', 'canvas', 'compositor', 'typescript'],
            private: false
        },
        {
            name: 'StatPrint',
            desc: 'Technical infographics for github profile builders. Supports multi-aspect grid calculations.',
            language: 'TypeScript',
            stars: 35,
            forks: 15,
            issues: 2,
            watchers: 5,
            size: 1200,
            license: 'Apache-2.0',
            createdAt: '2026-02-15T10:00:00Z',
            updatedAt: '2026-07-05T20:00:00Z',
            topics: ['infographics', 'vector', 'pdf', 'rust', 'docker'],
            private: false
        },
        {
            name: 'fastapi-app',
            desc: 'FastAPI python boilerplate with docker backend and redis caching layers.',
            language: 'Python',
            stars: 5,
            forks: 5,
            issues: 0,
            watchers: 1,
            size: 250,
            license: 'MIT',
            createdAt: '2024-05-10T08:00:00Z',
            updatedAt: '2024-12-10T10:00:00Z',
            topics: ['fastapi', 'python', 'docker', 'redis'],
            private: false
        }
    ],
    commitData: Array.from({ length: 371 }, (_, i) => (i % 7 === 0 ? 5 : (i % 3 === 0 ? 2 : 0))),
    pushHistory: [12, 24, 8, 15, 30, 45, 60, 20, 10, 18, 55, 75]
};
async function testEngine() {
    console.log('--- STARTING STATPRINT ENGINE AUTOMATED VERIFICATION ---');
    // 1. Test Badges calculation
    const badges = calculateBadges(mockPayload);
    console.log(`✔ Calculated Badges. Total: ${badges.length}, Unlocked: ${badges.filter(b => b.unlocked).length}`);
    badges.forEach(b => {
        if (b.unlocked) {
            console.log(`  - [${b.level.toUpperCase()}] ${b.name}: ${b.description}`);
        }
    });
    // 2. Test Tech stack detection
    const detectedStack = detectTechStack(mockPayload);
    console.log(`✔ Inferred Tech Stack: ${detectedStack.join(', ')}`);
    // 3. Test Insights computation
    const insights = computeInsights(mockPayload);
    console.log(`✔ Repository Insights calculated:`);
    console.log(`  - Coding Personality: ${insights.personality}`);
    console.log(`  - Estimated Rank: ${insights.rank}`);
    console.log(`  - OS contribution score: ${insights.osScore}`);
    // 4. Test aspect ratio presets rendering to SVG
    const viewports = [
        'instagram-post',
        'instagram-portrait',
        'twitter-post',
        'poster',
        '4k',
        'mobile'
    ];
    console.log('\n--- VERIFYING ASPECT RATIO SVG OUTPUTS ---');
    viewports.forEach(vp => {
        const svg = renderToSVG(mockPayload, vp, 'cyberpunk');
        console.log(`✔ Rendered SVG for [${vp.toUpperCase()}]. Size: ${svg.length} characters.`);
        if (!svg.startsWith('<?xml')) {
            throw new Error(`Invalid SVG generated for preset: ${vp}`);
        }
    });
    // 5. Test PDF rendering
    console.log('\n--- VERIFYING Aspect Ratio PDF OUTPUTS ---');
    viewports.forEach(vp => {
        const pdfBytes = renderToPDF(mockPayload, vp, 'blueprint');
        console.log(`✔ Rendered PDF bytes for [${vp.toUpperCase()}]. Byte Length: ${pdfBytes.length} bytes.`);
        if (pdfBytes.length < 100) {
            throw new Error(`Invalid PDF generated for preset: ${vp}`);
        }
    });
    // 6. Test Canvas Drawing Context Mock
    console.log('\n--- VERIFYING CANVAS EXPORTER EXECUTION ---');
    const mockCanvasCtx = {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        globalAlpha: 1.0,
        font: '',
        fillRect(x, y, w, h) { },
        strokeRect(x, y, w, h) { },
        beginPath() { },
        moveTo(x, y) { },
        lineTo(x, y) { },
        stroke() { },
        fill() { },
        closePath() { },
        arc(cx, cy, r, start, end) { },
        fillText(text, x, y, maxW) { }
    };
    try {
        drawToCanvas(mockCanvasCtx, mockPayload, 'poster', 'matrix');
        console.log('✔ Draw to HTML5 Canvas context completed with zero runtime execution errors.');
    }
    catch (err) {
        console.error('❌ Canvas Context rendering failed:', err);
        throw err;
    }
    console.log('\n--- ALL STATPRINT ENGINE VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
}
testEngine();
