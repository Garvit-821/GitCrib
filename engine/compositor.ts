import { ViewportType, ViewportConfig, LayoutBox, GitHubDataPayload } from './types.js';

/**
 * Text-wrapping system: Splits a string into lines that fit within maxWidth.
 * Includes truncation and ellipsis support when maximum lines are exceeded.
 */
export function wrapText(text: string, maxWidth: number, fontSize: number, maxLines: number = 3): string[] {
  // Average width of a character is about 0.53 * fontSize for monospace/sans-serif
  const avgCharWidth = fontSize * 0.55;
  const maxChars = Math.max(6, Math.floor(maxWidth / avgCharWidth));
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    // Replace the end of the last line with ellipsis
    const lastLine = trimmed[maxLines - 1];
    if (lastLine.length > 3) {
      trimmed[maxLines - 1] = lastLine.substring(0, Math.max(3, maxChars - 4)) + '...';
    } else {
      trimmed[maxLines - 1] = lastLine + '...';
    }
    return trimmed;
  }

  return lines;
}

/**
 * Resolves standard viewport dimensions and layout parameters
 */
export function getViewportConfig(type: ViewportType): ViewportConfig {
  switch (type) {
    case 'instagram-post':
      return { type, width: 1080, height: 1080, padding: 20, columns: 2 };
    case 'instagram-portrait':
      return { type, width: 1080, height: 1350, padding: 20, columns: 2 };
    case 'twitter-post':
      return { type, width: 1600, height: 900, padding: 30, columns: 3 };
    case '4k':
      return { type, width: 3840, height: 2160, padding: 60, columns: 4 };
    case 'mobile':
      return { type, width: 1080, height: 2400, padding: 40, columns: 1 };
    case 'poster':
    default:
      return { type, width: 1200, height: 1600, padding: 40, columns: 3 };
  }
}

/**
 * Recalculates modular coordinate block positions for all target viewport modes
 */
export function computeLayout(type: ViewportType): Record<string, LayoutBox> {
  const layout: Record<string, LayoutBox> = {};

  if (type === 'poster') {
    layout['header'] = { id: 'header', x: 40, y: 40, width: 1120, height: 160, title: 'Profile' };
    layout['overview'] = { id: 'overview', x: 40, y: 220, width: 350, height: 450, title: 'Overview' };
    layout['heatmap'] = { id: 'heatmap', x: 410, y: 220, width: 750, height: 210, title: 'Contribution Activity' };
    layout['barChart'] = { id: 'barChart', x: 410, y: 450, width: 360, height: 220, title: 'Monthly Commits' };
    layout['donutChart'] = { id: 'donutChart', x: 790, y: 450, width: 370, height: 220, title: 'Languages' };
    layout['radarChart'] = { id: 'radarChart', x: 40, y: 690, width: 350, height: 280, title: 'Skill Radar' };
    layout['repos'] = { id: 'repos', x: 410, y: 690, width: 750, height: 280, title: 'Top Repositories' };
    layout['badges'] = { id: 'badges', x: 40, y: 990, width: 1120, height: 180, title: 'Achievements' };
    layout['techStack'] = { id: 'techStack', x: 40, y: 1190, width: 540, height: 180, title: 'Tech Stack' };
    layout['insights'] = { id: 'insights', x: 600, y: 1190, width: 560, height: 180, title: 'Repository Insights' };
    layout['timeline'] = { id: 'timeline', x: 40, y: 1390, width: 1120, height: 100, title: 'Milestones' };
    layout['footer'] = { id: 'footer', x: 40, y: 1510, width: 1120, height: 50, title: 'Footer' };
  } else if (type === 'instagram-post') {
    layout['header'] = { id: 'header', x: 20, y: 20, width: 1040, height: 120, title: 'Profile' };
    layout['overview'] = { id: 'overview', x: 20, y: 160, width: 320, height: 380, title: 'Overview' };
    layout['donutChart'] = { id: 'donutChart', x: 360, y: 160, width: 340, height: 180, title: 'Languages' };
    layout['radarChart'] = { id: 'radarChart', x: 720, y: 160, width: 340, height: 180, title: 'Radar' };
    layout['heatmap'] = { id: 'heatmap', x: 360, y: 360, width: 700, height: 180, title: 'Contributions' };
    layout['repos'] = { id: 'repos', x: 20, y: 560, width: 500, height: 240, title: 'Top Repos' };
    layout['badges'] = { id: 'badges', x: 540, y: 560, width: 520, height: 240, title: 'Achievements' };
    layout['techStack'] = { id: 'techStack', x: 20, y: 820, width: 500, height: 140, title: 'Tech Stack' };
    layout['insights'] = { id: 'insights', x: 540, y: 820, width: 520, height: 140, title: 'Insights' };
    layout['footer'] = { id: 'footer', x: 20, y: 980, width: 1040, height: 80, title: 'Footer' };
    // Set off-screen or empty placeholders for other sizes to keep code safe
    layout['barChart'] = { id: 'barChart', x: -9999, y: -9999, width: 0, height: 0, title: '' };
    layout['timeline'] = { id: 'timeline', x: -9999, y: -9999, width: 0, height: 0, title: '' };
  } else if (type === 'instagram-portrait') {
    layout['header'] = { id: 'header', x: 20, y: 20, width: 1040, height: 130, title: 'Profile' };
    layout['overview'] = { id: 'overview', x: 20, y: 170, width: 320, height: 400, title: 'Overview' };
    layout['heatmap'] = { id: 'heatmap', x: 360, y: 170, width: 680, height: 190, title: 'Contributions' };
    layout['donutChart'] = { id: 'donutChart', x: 360, y: 380, width: 330, height: 190, title: 'Languages' };
    layout['radarChart'] = { id: 'radarChart', x: 710, y: 380, width: 330, height: 190, title: 'Radar' };
    layout['repos'] = { id: 'repos', x: 20, y: 590, width: 500, height: 260, title: 'Top Repos' };
    layout['badges'] = { id: 'badges', x: 540, y: 590, width: 520, height: 260, title: 'Achievements' };
    layout['techStack'] = { id: 'techStack', x: 20, y: 870, width: 500, height: 180, title: 'Tech Stack' };
    layout['insights'] = { id: 'insights', x: 540, y: 870, width: 520, height: 180, title: 'Insights' };
    layout['timeline'] = { id: 'timeline', x: 20, y: 1070, width: 1040, height: 110, title: 'Timeline' };
    layout['footer'] = { id: 'footer', x: 20, y: 1200, width: 1040, height: 130, title: 'Footer' };
    layout['barChart'] = { id: 'barChart', x: -9999, y: -9999, width: 0, height: 0, title: '' };
  } else if (type === 'twitter-post') {
    // 3 columns split layout
    layout['header'] = { id: 'header', x: 30, y: 30, width: 500, height: 200, title: 'Profile' };
    layout['overview'] = { id: 'overview', x: 30, y: 250, width: 500, height: 490, title: 'Overview' };
    layout['footer'] = { id: 'footer', x: 30, y: 760, width: 500, height: 110, title: 'Footer' };

    layout['heatmap'] = { id: 'heatmap', x: 560, y: 30, width: 490, height: 200, title: 'Contributions' };
    layout['donutChart'] = { id: 'donutChart', x: 560, y: 250, width: 490, height: 230, title: 'Languages' };
    layout['timeline'] = { id: 'timeline', x: 560, y: 500, width: 490, height: 160, title: 'Timeline' };
    layout['techStack'] = { id: 'techStack', x: 560, y: 680, width: 490, height: 190, title: 'Tech Stack' };

    layout['radarChart'] = { id: 'radarChart', x: 1080, y: 30, width: 490, height: 200, title: 'Radar' };
    layout['repos'] = { id: 'repos', x: 1080, y: 250, width: 490, height: 290, title: 'Top Repos' };
    layout['badges'] = { id: 'badges', x: 1080, y: 560, width: 490, height: 180, title: 'Achievements' };
    layout['insights'] = { id: 'insights', x: 1080, y: 760, width: 490, height: 110, title: 'Insights' };
    layout['barChart'] = { id: 'barChart', x: -9999, y: -9999, width: 0, height: 0, title: '' };
  } else if (type === '4k') {
    layout['header'] = { id: 'header', x: 60, y: 60, width: 1780, height: 220, title: 'Profile' };
    layout['overview'] = { id: 'overview', x: 60, y: 310, width: 540, height: 700, title: 'Overview' };
    layout['heatmap'] = { id: 'heatmap', x: 630, y: 310, width: 1210, height: 330, title: 'Contributions' };
    layout['donutChart'] = { id: 'donutChart', x: 630, y: 670, width: 590, height: 340, title: 'Languages' };
    layout['radarChart'] = { id: 'radarChart', x: 1250, y: 670, width: 590, height: 340, title: 'Radar' };
    layout['repos'] = { id: 'repos', x: 1900, y: 60, w: 1880, height: 550, title: 'Top Repos' } as any;
    layout['badges'] = { id: 'badges', x: 1900, y: 640, w: 1880, height: 370, title: 'Achievements' } as any;
    layout['techStack'] = { id: 'techStack', x: 60, y: 1040, width: 1780, height: 320, title: 'Tech Stack' };
    layout['insights'] = { id: 'insights', x: 1900, y: 1040, width: 1880, height: 320, title: 'Insights' };
    layout['timeline'] = { id: 'timeline', x: 60, y: 1390, width: 3720, height: 200, title: 'Timeline' };
    layout['footer'] = { id: 'footer', x: 60, y: 1620, width: 3720, height: 88, title: 'Footer' };
    layout['barChart'] = { id: 'barChart', x: -9999, y: -9999, width: 0, height: 0, title: '' };
  } else if (type === 'mobile') {
    // Single column scrolling stack
    layout['header'] = { id: 'header', x: 40, y: 40, width: 1000, height: 200, title: 'Profile' };
    layout['overview'] = { id: 'overview', x: 40, y: 260, width: 1000, height: 420, title: 'Overview' };
    layout['heatmap'] = { id: 'heatmap', x: 40, y: 700, width: 1000, height: 200, title: 'Contributions' };
    layout['donutChart'] = { id: 'donutChart', x: 40, y: 920, width: 480, height: 220, title: 'Languages' };
    layout['radarChart'] = { id: 'radarChart', x: 560, y: 920, width: 480, height: 220, title: 'Radar' };
    layout['repos'] = { id: 'repos', x: 40, y: 1160, width: 1000, height: 340, title: 'Top Repos' };
    layout['badges'] = { id: 'badges', x: 40, y: 1520, width: 1000, height: 260, title: 'Achievements' };
    layout['techStack'] = { id: 'techStack', x: 40, y: 1800, width: 1000, height: 200, title: 'Tech Stack' };
    layout['insights'] = { id: 'insights', x: 40, y: 2020, width: 1000, height: 200, title: 'Insights' };
    layout['timeline'] = { id: 'timeline', x: 40, y: 2240, width: 1000, height: 100, title: 'Timeline' };
    layout['footer'] = { id: 'footer', x: 40, y: 2360, width: 1000, height: 60, title: 'Footer' };
    layout['barChart'] = { id: 'barChart', x: -9999, y: -9999, width: 0, height: 0, title: '' };
  }

  // Backwards compatibility safety patches for width/height typing on repos/badges for 4k
  if (layout['repos'] && !layout['repos'].width) layout['repos'].width = (layout['repos'] as any).w;
  if (layout['badges'] && !layout['badges'].width) layout['badges'].width = (layout['badges'] as any).w;

  return layout;
}

/**
 * Scan GitHubDataPayload for tech keywords in repo names/languages/descriptions
 */
export function detectTechStack(payload: GitHubDataPayload): string[] {
  const repos = payload.repos;
  const keywordsMap: Record<string, string[]> = {
    React: ['react', 'next', 'jsx', 'tsx'],
    Next: ['nextjs', 'next.js', 'next-app'],
    Vue: ['vue', 'vuejs', 'nuxt'],
    Angular: ['angular', 'ng-'],
    Svelte: ['svelte', 'sveltech'],
    Node: ['node', 'nodejs', 'npm'],
    Express: ['express', 'expressjs'],
    Python: ['python', 'py'],
    FastAPI: ['fastapi'],
    Django: ['django'],
    Flask: ['flask'],
    Java: ['java', 'jar'],
    Spring: ['spring', 'springboot'],
    Go: ['go', 'golang'],
    Rust: ['rust', 'cargo', 'rs'],
    Docker: ['docker', 'dockerfile', 'compose'],
    K8s: ['kubernetes', 'k8s', 'helm'],
    AWS: ['aws', 's3', 'lambda', 'ec2'],
    Azure: ['azure'],
    GCP: ['gcp', 'google-cloud'],
    Firebase: ['firebase', 'firestore'],
    Mongo: ['mongodb', 'mongo', 'mongoose'],
    Postgres: ['postgresql', 'postgres', 'pg'],
    MySQL: ['mysql'],
    Redis: ['redis'],
    Tailwind: ['tailwind', 'tailwindcss'],
    Bootstrap: ['bootstrap'],
    Git: ['git', 'github'],
    'GH Actions': ['github-actions', 'workflows'],
    TensorFlow: ['tensorflow', 'tf'],
    PyTorch: ['pytorch', 'torch'],
    LangChain: ['langchain'],
    OpenAI: ['openai', 'chatgpt'],
    Ollama: ['ollama']
  };

  const detected = new Set<string>();

  // Add repo languages
  repos.forEach(r => {
    if (r.language) {
      const lang = r.language.trim();
      if (keywordsMap[lang]) {
        detected.add(lang);
      }
      // Direct matches for common tech stack
      if (['Python', 'Java', 'Go', 'Rust', 'TypeScript', 'JavaScript'].includes(lang)) {
        detected.add(lang);
      }
    }
  });

  // Scan description and names
  repos.forEach(r => {
    const textToSearch = `${r.name} ${r.desc || ''} ${r.topics.join(' ')}`.toLowerCase();
    for (const [techName, matches] of Object.entries(keywordsMap)) {
      for (const match of matches) {
        if (textToSearch.includes(match)) {
          detected.add(techName);
          break;
        }
      }
    }
  });

  // Return a sorted list, up to 16 technologies to keep it compact and pretty
  return Array.from(detected).slice(0, 16);
}

/**
 * Computes insights summaries and fun stats based on Github metrics
 */
export function computeInsights(payload: GitHubDataPayload) {
  const repos = payload.repos;
  const metrics = payload.metrics;

  const sortedByStars = [...repos].sort((a, b) => b.stars - a.stars);
  const sortedByForks = [...repos].sort((a, b) => b.forks - a.forks);
  const sortedBySize = [...repos].sort((a, b) => b.size - a.size);

  const mostStarred = sortedByStars[0]?.name || '-';
  const mostForked = sortedByForks[0]?.name || '-';
  const largestRepo = sortedBySize[0]?.name || '-';

  // Coding Personality Algorithm
  let personality = 'System Architect';
  if (metrics.commits > 500 && metrics.longestStreak > 20) {
    personality = 'Code Machine';
  } else if (metrics.reposContributedTo > 5) {
    personality = 'Open Source Evangelist';
  } else if (metrics.prsMerged > 30) {
    personality = 'Collaborator Extraordinaire';
  } else if (repos.some(r => r.topics.includes('ai') || r.topics.includes('openai'))) {
    personality = 'AI Synthesizer';
  }

  // estimated coffee level (1 to 5)
  const coffeeLevel = Math.min(5, Math.max(1, Math.floor(metrics.commits / 150)));

  // OS Contribution score
  const osScore = Math.min(100, Math.floor(metrics.prsMerged * 5 + metrics.reposContributedTo * 10));

  // Dev rank based on grade/contributions
  let rank = 'Junior CodeSmith';
  if (metrics.grade === 'A+' || metrics.grade === 'S') {
    rank = 'Grandmaster Kernel Hacker';
  } else if (metrics.grade.startsWith('A')) {
    rank = 'Staff Engineer';
  } else if (metrics.grade.startsWith('B')) {
    rank = 'Senior Developer';
  }

  return {
    mostStarred,
    mostForked,
    largestRepo,
    personality,
    coffeeLevel,
    osScore,
    rank,
    avgRepoStars: repos.length ? parseFloat((repos.reduce((acc, r) => acc + r.stars, 0) / repos.length).toFixed(1)) : 0,
    avgRepoForks: repos.length ? parseFloat((repos.reduce((acc, r) => acc + r.forks, 0) / repos.length).toFixed(1)) : 0,
    commitVelocity: parseFloat((metrics.commits / 365).toFixed(2)) // commits per day
  };
}
