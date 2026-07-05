export interface GitHubRepo {
  name: string;
  desc?: string;
  language?: string;
  stars: number;
  forks: number;
  issues: number;
  watchers: number;
  size: number; // in KB
  license?: string;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  private: boolean;
}

export interface GitHubProfile {
  name: string;
  username: string;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
  twitter?: string;
  followers: number;
  following: number;
  createdAt: string;
  hireable: boolean;
  email?: string;
  orgCount: number;
  pinnedRepos: string[];
  profileLink: string;
  avatarUrl?: string;
}

export interface GitHubMetrics {
  totalStars: number;
  forks: number;
  watchers: number;
  publicRepos: number;
  privateRepos: number;
  gists: number;
  accountAge: number; // in years
  grade: string;
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  yearlyContributions: number;
  monthlyContributions: number;
  commits: number;
  prsMerged: number;
  prsOpen: number;
  prsClosed: number;
  reposContributedTo: number;
  packages: number;
  releases: number;
  projects: number;
  discussions: number;
  codeReviews: number;
  starsGiven: number;
  reposCreated: number;
  avgCommitsFreq: number; // commits/day
  avgContributionsFreq: number; // contributions/day
}

export interface GitHubDataPayload {
  profile: GitHubProfile;
  metrics: GitHubMetrics;
  repos: GitHubRepo[];
  commitData: number[]; // 371 values for heatmap
  pushHistory: number[]; // 12 monthly values
}

export type ViewportType = 
  | 'instagram-post'
  | 'instagram-portrait'
  | 'twitter-post'
  | 'poster'
  | '4k'
  | 'mobile';

export interface ViewportConfig {
  type: ViewportType;
  width: number;
  height: number;
  padding: number;
  columns: number;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  level: 'gold' | 'silver' | 'bronze' | 'none';
}

export interface ThemeColors {
  bg: string;
  grid: string;
  stroke: string;
  accent1: string;
  accent2: string;
  cardBg: string;
}

export interface LayoutBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
}
