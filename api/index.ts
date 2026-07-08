import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { Poster } from '../components/Poster.js';
import { getLandingPageHtml } from '../components/LandingPage.js';
import { calculateBadges } from '../engine/badges.js';

declare const process: {
  env: {
    GITHUB_TOKEN?: string;
    GEMINI_API_KEY?: string;
  };
};

export const config = {
  runtime: 'edge',
};

const colorMap: Record<string, string> = {
  typescript: '#3178c6',
  javascript: '#f7df1e',
  python: '#3776ab',
  rust: '#10b981',
  go: '#00add8',
  html: '#e34f26',
  css: '#1572b6',
  ruby: '#701516',
  java: '#b07219',
  'c++': '#f34b7d',
  c: '#555555',
  php: '#4f5d95',
  swift: '#f05138',
  kotlin: '#f18e33',
  shell: '#89e051'
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate high-fidelity deterministic stats for any user
function getDeterministicStats(username: string) {
  const seed = hashString(username);
  
  const joinedYear = 2015 + (seed % 10);
  const joinedMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][seed % 12];
  const joinedDay = 1 + (seed % 28);
  const joinedDate = `${joinedMonth} ${joinedDay}, ${joinedYear}`;

  const commits = 100 + (seed % 800);
  const prs = 5 + (seed % 40);
  const issues = seed % 15;
  const contributedTo = seed % 10;
  const totalContributions = commits + prs + issues + 120;
  
  const currentStreak = 2 + (seed % 18);
  const longestStreak = currentStreak + (seed % 12);
  const streakDateRange = `Jun 10 - Jun ${10 + currentStreak}`;
  const longestStreakDateRange = `May 15 - Jun ${15 + longestStreak}`;

  const reviews = seed % 8;
  const starsGiven = 10 + (seed % 120);
  const projects = seed % 6;
  const packages = seed % 3;

  // Contributions polyline history
  const contributionsHistory = Array.from({ length: 15 }, (_, i) => {
    const val = Math.max(1, Math.round(5 + Math.sin((i + seed) / 2) * 5 + ((seed >> i) % 8)));
    return val;
  });

  // 371 days heatmap grid
  const commitData = Array.from({ length: 371 }, (_, i) => {
    const active = (seed >> (i % 16)) & 1;
    return active ? Math.floor(Math.random() * 12) : 0;
  });

  // 12 months push history
  const pushHistory = Array.from({ length: 12 }, (_, i) => {
    const base = 10 + (seed % 30);
    const wave = Math.round(Math.sin((i + seed) / 2) * 10);
    return Math.max(5, base + wave);
  });

  return {
    joinedDate,
    commits,
    prs,
    issues,
    contributedTo,
    totalContributions,
    currentStreak,
    longestStreak,
    streakDateRange,
    longestStreakDateRange,
    reviews,
    starsGiven,
    projects,
    packages,
    contributionsHistory,
    commitData,
    pushHistory
  };
}

async function scrapeGithubProfile(username: string): Promise<any> {
  try {
    const url = `https://github.com/${username}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      throw new Error(`Profile HTTP status: ${res.status}`);
    }
    const html = await res.text();

    const nameMatch = html.match(/itemprop="name"[^>]*>\s*([^<\n\r]+)/);
    const name = nameMatch ? nameMatch[1].trim() : username.toUpperCase();

    const avatarMatch = html.match(/class="[^"]*avatar-user[^"]*"[^>]*src="([^"]+)"/);
    const avatarUrl = avatarMatch ? avatarMatch[1].replace(/&amp;/g, '&') : `https://avatars.githubusercontent.com/u/${hashString(username) % 999999}?v=4`;

    const bioMatch = html.match(/class="[^"]*user-profile-bio[^"]*"[^>]*><div>([\s\S]*?)<\/div>/);
    const bio = bioMatch ? bioMatch[1].trim().replace(/&amp;/g, '&') : 'Developer // Innovator';

    const followersMatch = html.match(/href="[^"]+\?tab=followers"[^>]*>[\s\S]*?<span[^>]*>([\d,]+)<\/span>[\s\S]*?followers/i);
    const followers = followersMatch ? parseInt(followersMatch[1].replace(/,/g, ''), 10) : 0;

    const followingMatch = html.match(/href="[^"]+\?tab=following"[^>]*>[\s\S]*?<span[^>]*>([\d,]+)<\/span>[\s\S]*?following/i);
    const following = followingMatch ? parseInt(followingMatch[1].replace(/,/g, ''), 10) : 0;

    const blogMatch = html.match(/itemprop="url"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"/);
    const blog = blogMatch ? blogMatch[1] : `github.com/${username}`;
    const portfolioUrl = blog.startsWith('http') ? blog : `https://${blog}`;
    const websiteUrl = `github.com/${username}`;
    const email = `contact@${username.toLowerCase()}.dev`;

    const locationMatch = html.match(/itemprop="homeLocation"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/);
    const location = locationMatch ? locationMatch[1].trim() : 'Earth';

    const repoCountRegex = new RegExp(`href="\\/${username}\\?tab=repositories"[^>]*>[\\s\\S]*?<span[^>]*>(\\d+)<\\/span>`, 'i');
    const repoCountMatch = html.match(repoCountRegex);
    const publicRepos = repoCountMatch ? parseInt(repoCountMatch[1], 10) : 10;

    const pinnedBlocks = html.match(/<div class="pinned-item-list-item-content">[\s\S]*?<\/p>\s*<\/div>/g) || [];
    const repos: Array<{ name: string; stars: number }> = [];
    pinnedBlocks.forEach(block => {
      const nMatch = block.match(/<span class="repo">([^<]+)<\/span>/);
      if (nMatch) {
        const n = nMatch[1].trim();
        const starMatch = block.match(/href="[^"]+\/stargazers"[^>]*>[\s\S]*?<\/svg>\s*([\d,]+)/i) || 
                          block.match(/aria-label="star"[^>]*>[\s\S]*?<\/svg>\s*([\d,]+)/i);
        const stars = starMatch ? parseInt(starMatch[1].replace(/,/g, ''), 10) : 0;
        repos.push({ name: n, stars });
      }
    });

    const langCounts: Record<string, number> = {};
    const langRegex = /<span itemprop="programmingLanguage">([^<]+)<\/span>/g;
    let langMatch;
    while ((langMatch = langRegex.exec(html)) !== null) {
      const lang = langMatch[1].trim();
      langCounts[lang] = (langCounts[lang] || 0) + 1;
    }
    const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0);
    let languages = Object.entries(langCounts)
      .map(([name, count]) => {
        const percentage = Math.round((count / (totalLangs || 1)) * 1000) / 10;
        const color = colorMap[name.toLowerCase()] || '#666666';
        return { name, percentage, color };
      })
      .sort((a, b) => b.percentage - a.percentage);

    if (languages.length === 0) {
      languages = [
        { name: 'JavaScript', percentage: 45.1, color: '#f7df1e' },
        { name: 'HTML', percentage: 23.7, color: '#e34f26' },
        { name: 'CSS', percentage: 12.4, color: '#1572b6' },
        { name: 'Python', percentage: 8.6, color: '#3776ab' },
        { name: 'Other', percentage: 10.2, color: '#666666' }
      ];
    }

    const stars = repos.reduce((sum, r) => sum + r.stars, 0);

    const score = (stars * 5) + (followers * 2) + publicRepos;
    let grade = 'B-';
    if (score > 1000) grade = 'A+';
    else if (score > 500) grade = 'A';
    else if (score > 250) grade = 'A-';
    else if (score > 120) grade = 'B+';
    else if (score > 60) grade = 'B';

    return {
      success: true,
      name,
      avatarUrl,
      bio,
      joinedDate: 'Jan 19, 2021', // scraper fallback default
      followers,
      following,
      stars,
      languages,
      repos,
      publicRepos,
      gists: 0,
      portfolioUrl,
      websiteUrl,
      email,
      location,
      grade
    };
  } catch (error) {
    console.warn(`[GitHub Scraper] Failed to scrape public profile for "${username}":`, error);
    return { success: false };
  }
}

async function fetchContributionCalendar(username: string): Promise<any> {
  try {
    const url = `https://github.com/users/${username}/contributions`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      throw new Error(`Contributions calendar HTTP status: ${res.status}`);
    }
    const html = await res.text();

    const totalMatch = html.match(/(\d+)\s+contributions\s+in\s+the\s+last\s+year/i);
    let totalContributions = totalMatch ? parseInt(totalMatch[1], 10) : 0;

    const tooltipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
    const tooltipMap = new Map<string, number>();
    let match;
    while ((match = tooltipRegex.exec(html)) !== null) {
      const id = match[1];
      const text = match[2];
      const countMatch = text.match(/^(\d+|No)\s+contribution/i);
      if (countMatch) {
        const val = countMatch[1].toLowerCase() === 'no' ? 0 : parseInt(countMatch[1], 10);
        tooltipMap.set(id, val);
      }
    }

    const tdTags = html.match(/<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g) || [];
    const dayMap = new Map<string, { date: string; level: number; count: number }>();
    tdTags.forEach(tag => {
      const dateMatch = tag.match(/data-date="([^"]+)"/);
      const idMatch = tag.match(/id="([^"]+)"/);
      const levelMatch = tag.match(/data-level="([^"]+)"/);
      
      if (dateMatch) {
        const date = dateMatch[1];
        const id = idMatch ? idMatch[1] : '';
        const level = levelMatch ? parseInt(levelMatch[1], 10) : 0;
        const count = id ? (tooltipMap.get(id) ?? (level > 0 ? level * 2 : 0)) : (level > 0 ? level * 2 : 0);
        dayMap.set(date, { date, level, count });
      }
    });

    const sortedDays = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    if (totalContributions === 0) {
      totalContributions = sortedDays.reduce((sum, d) => sum + d.count, 0);
    }

    let runningStreak = 0;
    let longestStreak = 0;
    sortedDays.forEach(d => {
      if (d.count > 0) {
        runningStreak++;
        if (runningStreak > longestStreak) {
          longestStreak = runningStreak;
        }
      } else {
        runningStreak = 0;
      }
    });

    let currentStreak = 0;
    let active = false;
    let tempStreak = 0;
    for (let i = sortedDays.length - 1; i >= 0; i--) {
      if (sortedDays[i].count > 0) {
        tempStreak++;
        active = true;
      } else {
        if (active) break;
        if (sortedDays.length - 1 - i > 1) { // 1 day grace
          break;
        }
      }
    }
    currentStreak = tempStreak;

    let streakDateRange = '';
    if (currentStreak > 0) {
      let lastActiveIdx = sortedDays.length - 1;
      while (lastActiveIdx >= 0 && sortedDays[lastActiveIdx].count === 0) {
        lastActiveIdx--;
      }
      const endActive = sortedDays[lastActiveIdx];
      const startActive = sortedDays[lastActiveIdx - currentStreak + 1];
      if (startActive && endActive) {
        streakDateRange = `${formatDateRange(startActive.date)} - ${formatDateRange(endActive.date)}`;
      }
    }

    let longestStreakDateRange = '';
    if (longestStreak > 0) {
      let maxStartIdx = 0;
      let maxEndIdx = 0;
      let curStartIdx = -1;
      let curStreak = 0;

      sortedDays.forEach((d, idx) => {
        if (d.count > 0) {
          if (curStartIdx === -1) curStartIdx = idx;
          curStreak++;
          if (curStreak === longestStreak) {
            maxStartIdx = curStartIdx;
            maxEndIdx = idx;
          }
        } else {
          curStartIdx = -1;
          curStreak = 0;
        }
      });

      const startD = sortedDays[maxStartIdx];
      const endD = sortedDays[maxEndIdx];
      if (startD && endD) {
        longestStreakDateRange = `${formatDateRange(startD.date)} - ${formatDateRange(endD.date)}`;
      }
    }

    const last15Days = sortedDays.slice(-15);
    const contributionsHistory = last15Days.map(d => d.count);
    while (contributionsHistory.length < 15) {
      contributionsHistory.unshift(0);
    }

    const commitData = sortedDays.slice(-371).map(d => d.count);
    while (commitData.length < 371) {
      commitData.unshift(0);
    }

    const monthlyGroups = new Map<string, number>();
    sortedDays.forEach(d => {
      const monthKey = d.date.substring(0, 7);
      monthlyGroups.set(monthKey, (monthlyGroups.get(monthKey) || 0) + d.count);
    });
    const sortedMonthKeys = Array.from(monthlyGroups.keys()).sort();
    const last12MonthsKeys = sortedMonthKeys.slice(-12);
    const pushHistory = last12MonthsKeys.map(key => monthlyGroups.get(key) || 0);
    while (pushHistory.length < 12) {
      pushHistory.unshift(0);
    }

    return {
      success: true,
      totalContributions,
      currentStreak,
      longestStreak,
      streakDateRange: streakDateRange || 'N/A',
      longestStreakDateRange: longestStreakDateRange || 'N/A',
      contributionsHistory,
      commitData,
      pushHistory
    };
  } catch (error) {
    console.warn(`[GitHub Scraper] Failed to fetch contribution calendar for "${username}":`, error);
    return { success: false };
  }
}

function formatDateRange(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
  } catch {
    return dateStr;
  }
}

async function fetchAvatarAsBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) return url;
    const contentType = res.headers.get('content-type') || 'image/png';
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return `data:${contentType};base64,${base64}`;
  } catch (err) {
    console.warn('Failed to fetch avatar for base64 encoding:', err);
    return url;
  }
}

interface GeminiAnalysis {
  bio: string;
  devClass: string;
  aboutText: string;
  personality: string;
  rank: string;
}

async function callGeminiDeveloperAnalysis(
  username: string,
  name: string,
  bio: string,
  publicRepos: number,
  followers: number,
  totalContributions: number,
  languages: Array<{ name: string; percentage: number }>,
  repos: Array<{ name: string; stars: number }>
): Promise<GeminiAnalysis | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `You are GitCrib AI, an expert developer analyst.
Analyze the following GitHub profile data for username: "${username}":
Name: "${name}"
Bio: "${bio}"
Public Repositories: ${publicRepos}
Followers: ${followers}
Total Contributions (Last Year): ${totalContributions}
Top Languages: ${JSON.stringify(languages.slice(0, 5))}
Top Repositories: ${JSON.stringify(repos.slice(0, 5))}

Based on this data, generate:
1. A short, creative, professional Developer Bio (maximum 120 characters).
2. A Developer Class (e.g., "Full Stack Engineer", "Systems Architect", "Machine Learning Practitioner", etc.) - maximum 30 characters.
3. An "About Text" summary of their coding style, expertise, and focus areas (maximum 200 characters).
4. A "Coding Personality" (e.g., "Code Machine", "Elegant Optimizer", "AI Synthesizer", "OS Crusader") - maximum 25 characters.
5. An "Estimated Rank" (e.g., "Grandmaster Kernel Hacker", "Principal Systems Architect", "Lead Developer", "Elite Open Source Builder") - maximum 30 characters.

Return the response strictly as a JSON object with keys:
"bio", "devClass", "aboutText", "personality", "rank"
Do not include any markdown formatting, code blocks, or comments in your response. Just the raw JSON object.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API HTTP status: ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(text) as GeminiAnalysis;
    return {
      bio: parsed.bio || bio,
      devClass: parsed.devClass || 'Developer',
      aboutText: parsed.aboutText || bio,
      personality: parsed.personality || 'System Architect',
      rank: parsed.rank || 'Senior Developer'
    };
  } catch (error) {
    console.warn('[Gemini AI] Failed to perform developer analysis:', error);
    return null;
  }
}

async function fetchGithubStats(username: string): Promise<any> {
  const profileUrl = `https://api.github.com/users/${username}`;
  const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

  const headers = {
    'User-Agent': 'GitCrib-Analytics-Engine',
    ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
  };

  try {
    const profileRes = await fetch(profileUrl, { headers });
    if (!profileRes.ok) {
      throw new Error(`GitHub Profile fetch status: ${profileRes.status}`);
    }
    const profile = await profileRes.json();

    const name = profile.name || username.toUpperCase();
    const avatarUrl = profile.avatar_url;
    const bio = profile.bio || 'Building the future, one commit at a time.';
    
    const createdDate = new Date(profile.created_at);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const joinedDate = `${months[createdDate.getMonth()]} ${createdDate.getDate()}, ${createdDate.getFullYear()}`;

    const followers = profile.followers || 0;
    const following = profile.following || 0;
    const publicRepos = profile.public_repos || 0;
    const gists = profile.public_gists || 0;
    
    const blog = profile.blog || `github.com/${username}`;
    const portfolioUrl = blog.startsWith('http') ? blog : `https://${blog}`;
    const websiteUrl = `github.com/${username}`;
    const email = profile.email || `contact@${username.toLowerCase()}.dev`;
    const location = profile.location || 'Delhi, India';

    let stars = 0;
    let languages: Array<{ name: string; percentage: number; color: string }> = [];
    let repos: Array<{ name: string; stars: number }> = [];

    const reposRes = await fetch(reposUrl, { headers });
    if (reposRes.ok) {
      const reposList = await reposRes.json();
      if (Array.isArray(reposList)) {
        stars = reposList.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        
        repos = reposList
          .map(r => ({ name: r.name, stars: r.stargazers_count || 0 }))
          .sort((a, b) => b.stars - a.stars);

        const langCounts: Record<string, number> = {};
        reposList.forEach(repo => {
          if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
          }
        });

        const total = Object.values(langCounts).reduce((a, b) => a + b, 0);
        languages = Object.entries(langCounts)
          .map(([name, count]) => {
            const percentage = Math.round((count / (total || 1)) * 1000) / 10;
            const lowerName = name.toLowerCase();
            const color = colorMap[lowerName] || '#666666';
            return { name, percentage, color };
          })
          .sort((a, b) => b.percentage - a.percentage);
      }
    }

    if (languages.length === 0) {
      languages = [
        { name: 'JavaScript', percentage: 45.1, color: '#f7df1e' },
        { name: 'HTML', percentage: 23.7, color: '#e34f26' },
        { name: 'CSS', percentage: 12.4, color: '#1572b6' },
        { name: 'Python', percentage: 8.6, color: '#3776ab' },
        { name: 'Other', percentage: 10.2, color: '#666666' }
      ];
    }

    const score = (stars * 5) + (followers * 2) + publicRepos;
    let grade = 'B-';
    if (score > 1000) grade = 'A+';
    else if (score > 500) grade = 'A';
    else if (score > 250) grade = 'A-';
    else if (score > 120) grade = 'B+';
    else if (score > 60) grade = 'B';

    return {
      success: true,
      name,
      avatarUrl,
      bio,
      joinedDate,
      followers,
      following,
      stars,
      languages,
      repos,
      publicRepos,
      gists,
      portfolioUrl,
      websiteUrl,
      email,
      location,
      grade
    };
  } catch (error) {
    console.warn(`[GitHub API] Failed. Falling back to scraping for profile stats of "${username}".`);
    return await scrapeGithubProfile(username);
  }
}

export default async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);

    // Serve landing page HTML if no username parameter is present
    const usernameParam = url.searchParams.get('username');
    if (!usernameParam) {
      return new Response(getLandingPageHtml(), {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    const username = usernameParam;
    const geminiParam = url.searchParams.get('gemini');
    const useGemini = geminiParam === 'true';

    // 1. Fetch profile stats
    const github = await fetchGithubStats(username);

    // 2. Fetch contribution calendar stats
    const calendar = await fetchContributionCalendar(username);

    // Deterministic fallback
    const det = getDeterministicStats(username);

    // Resolve values
    const hasLiveProfile = github.success;
    const hasLiveCalendar = calendar.success;

    const name = hasLiveProfile ? github.name! : username.toUpperCase();
    const avatarUrlRaw = hasLiveProfile ? github.avatarUrl! : `https://avatars.githubusercontent.com/u/${hashString(username) % 999999}?v=4`;
    let avatarUrl = avatarUrlRaw;
    if (avatarUrlRaw.startsWith('http')) {
      avatarUrl = await fetchAvatarAsBase64(avatarUrlRaw);
    }
    const bio = hasLiveProfile ? github.bio! : 'Developer // Innovator';
    const joinedDate = hasLiveProfile ? github.joinedDate! : det.joinedDate;
    
    const followers = hasLiveProfile ? github.followers! : 12;
    const following = hasLiveProfile ? github.following! : 8;

    const starsParam = url.searchParams.get('stars');
    const stars = starsParam ? parseInt(starsParam, 10) : (hasLiveProfile ? github.stars! : 45);

    const totalContributions = hasLiveCalendar ? calendar.totalContributions : det.totalContributions;
    const currentStreak = hasLiveCalendar ? calendar.currentStreak : det.currentStreak;
    const longestStreak = hasLiveCalendar ? calendar.longestStreak : det.longestStreak;
    const streakDateRange = hasLiveCalendar ? calendar.streakDateRange : det.streakDateRange;
    const longestStreakDateRange = hasLiveCalendar ? calendar.longestStreakDateRange : det.longestStreakDateRange;
    const contributionsHistory = hasLiveCalendar ? calendar.contributionsHistory : det.contributionsHistory;
    const commitData = hasLiveCalendar ? calendar.commitData : det.commitData;
    const pushHistory = hasLiveCalendar ? calendar.pushHistory : det.pushHistory;

    // Search API or local estimation for commits, prs, issues, reviews
    let commits = Math.round(totalContributions * 0.8) || det.commits;
    let prs = Math.round(totalContributions * 0.15) || det.prs;
    let issues = Math.round(totalContributions * 0.05) || det.issues;
    let contributedTo = hasLiveProfile ? (github.repos ? Math.min(github.repos.length, 5) : 0) : det.contributedTo;

    const headers = {
      'User-Agent': 'GitCrib-Analytics-Engine',
      ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
    };
    try {
      const searchCommitsUrl = `https://api.github.com/search/commits?q=author:${username}`;
      const searchCommitsRes = await fetch(searchCommitsUrl, {
        headers: {
          ...headers,
          'Accept': 'application/vnd.github.cloak-preview'
        }
      });
      if (searchCommitsRes.ok) {
        const data = await searchCommitsRes.json();
        if (typeof data.total_count === 'number') {
          commits = data.total_count;
        }
      }

      const searchPRsUrl = `https://api.github.com/search/issues?q=author:${username}+type:pr`;
      const searchPRsRes = await fetch(searchPRsUrl, { headers });
      if (searchPRsRes.ok) {
        const data = await searchPRsRes.json();
        if (typeof data.total_count === 'number') {
          prs = data.total_count;
        }
      }

      const searchIssuesUrl = `https://api.github.com/search/issues?q=author:${username}+type:issue`;
      const searchIssuesRes = await fetch(searchIssuesUrl, { headers });
      if (searchIssuesRes.ok) {
        const data = await searchIssuesRes.json();
        if (typeof data.total_count === 'number') {
          issues = data.total_count;
        }
      }
    } catch (err) {
      // Ignore search api errors, keep fallbacks
    }

    const grade = hasLiveProfile ? github.grade! : 'B';
    const languages: Array<{ name: string; percentage: number; color: string }> = hasLiveProfile ? github.languages! : [
      { name: 'JavaScript', percentage: 65, color: '#f7df1e' },
      { name: 'HTML', percentage: 20, color: '#e34f26' },
      { name: 'CSS', percentage: 15, color: '#1572b6' }
    ];

    const repos = hasLiveProfile ? github.repos!.slice(0, 5) : [
      { name: 'repo-alpha', stars: 10 },
      { name: 'repo-beta', stars: 5 }
    ];

    const totalReposCount = hasLiveProfile ? github.publicRepos! : 2;
    const activityPRs = prs;
    const activityIssuesOpened = Math.floor(issues * 0.4);
    const activityIssuesClosed = Math.floor(issues * 0.6);
    const activityReposContributed = contributedTo;
    const activityReposOwned = Math.max(0, totalReposCount - contributedTo);
    const activityTotalWatchers = stars + 5;

    const reviewsParam = url.searchParams.get('reviews');
    const reviews = reviewsParam ? parseInt(reviewsParam, 10) : det.reviews;
    const starsGiven = det.starsGiven;
    const gists = hasLiveProfile ? github.gists! : 1;
    const orgs = hashString(username) % 3 === 0 ? '1' : '-';
    const projects = det.projects;
    const packages = det.packages;

    const portfolioUrl = hasLiveProfile ? github.portfolioUrl! : `github.com/${username}`;
    const websiteUrl = hasLiveProfile ? github.websiteUrl! : `github.com/${username}`;
    const email = hasLiveProfile ? github.email! : `contact@${username.toLowerCase()}.dev`;
    const location = hasLiveProfile ? github.location! : 'Earth';

    // 3. Call Gemini developer analysis
    let geminiData: GeminiAnalysis | null = null;
    if (useGemini && process.env.GEMINI_API_KEY) {
      geminiData = await callGeminiDeveloperAnalysis(
        username,
        name,
        bio,
        totalReposCount,
        followers,
        totalContributions,
        languages,
        repos
      );
    }

    let calculatedDevClass = 'Senior Core Engineer';
    if (languages && languages.length > 0) {
      const topLang = languages[0].name.toLowerCase();
      if (['typescript', 'javascript'].includes(topLang)) {
        calculatedDevClass = 'Full Stack Engineer';
      } else if (['python', 'r'].includes(topLang)) {
        calculatedDevClass = 'AI & Data Specialist';
      } else if (['rust', 'go', 'c++', 'c'].includes(topLang)) {
        calculatedDevClass = 'Systems Architect';
      } else if (['java', 'kotlin'].includes(topLang)) {
        calculatedDevClass = 'Enterprise Developer';
      } else if (['html', 'css'].includes(topLang)) {
        calculatedDevClass = 'Frontend Engineer';
      }
    }

    const devClassParam = url.searchParams.get('devClass');
    const devClass = devClassParam || (geminiData ? geminiData.devClass : calculatedDevClass);

    const calculatedAboutText = bio || 'Open source contributor building technical solutions.';
    const aboutText = geminiData ? geminiData.aboutText : calculatedAboutText;

    const themeParam = url.searchParams.get('theme') || 'blueprint';
    const theme = (['blueprint', 'cyberpunk', 'matrix', 'amber'].includes(themeParam))
      ? themeParam as 'blueprint' | 'cyberpunk' | 'matrix' | 'amber'
      : 'blueprint';

    const layoutParam = url.searchParams.get('layout') || 'poster';
    const layout = (['poster', 'banner'].includes(layoutParam))
      ? layoutParam as 'poster' | 'banner'
      : 'poster';

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // Construct payload to calculate achievements/badges
    const payloadRepos = languages.map(l => ({
      name: 'repo',
      desc: '',
      language: l.name,
      stars: 0,
      forks: 0,
      issues: 0,
      watchers: 0,
      size: 1000,
      createdAt: '',
      updatedAt: '',
      topics: [],
      private: false
    }));

    const badges = calculateBadges({
      profile: {
        name,
        username,
        createdAt: '2021-01-19T00:00:00Z',
        followers,
        following,
        orgCount: orgs === '-' ? 0 : 1,
        pinnedRepos: [],
        profileLink: `https://github.com/${username}`,
        hireable: true
      },
      metrics: {
        totalStars: stars,
        forks: 0,
        watchers: 0,
        publicRepos: totalReposCount,
        privateRepos: 0,
        gists,
        accountAge: 5,
        grade,
        currentStreak,
        longestStreak,
        totalContributions,
        yearlyContributions: totalContributions,
        monthlyContributions: totalContributions / 12,
        commits,
        prsMerged: prs,
        prsOpen: 0,
        prsClosed: 0,
        reposContributedTo: contributedTo,
        packages,
        releases: 0,
        projects,
        discussions: 0,
        codeReviews: reviews,
        starsGiven,
        reposCreated: totalReposCount,
        avgCommitsFreq: commits / 365,
        avgContributionsFreq: totalContributions / 365
      },
      repos: payloadRepos,
      commitData,
      pushHistory
    });

    // Render Poster component
    const svg = render(h(Poster, {
      username,
      name,
      avatarUrl,
      bio: geminiData ? geminiData.bio : bio,
      joinedDate,
      devClass,
      followers,
      following,
      stars,
      commits,
      prs,
      issues,
      contributedTo,
      grade,
      totalContributions,
      currentStreak,
      longestStreak,
      streakDateRange,
      longestStreakDateRange,
      contributionsHistory,
      languages,
      repos,
      totalReposCount,
      activityPRs,
      activityIssuesOpened,
      activityIssuesClosed,
      activityReposContributed,
      activityReposOwned,
      activityTotalWatchers,
      commitData,
      pushHistory,
      reviews,
      starsGiven,
      gists,
      orgs,
      projects,
      packages,
      aboutText,
      portfolioUrl,
      websiteUrl,
      email,
      location,
      timestamp,
      theme,
      layout,
      badges
    }));

    // Return response
    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (err: any) {
    return new Response(`Error in Edge handler:\n${err.message}\n\nStack:\n${err.stack}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
