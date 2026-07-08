import { Fragment, h } from 'preact';
import {
  ProfileHeader,
  OverviewList,
  GradeCard,
  SimpleMetricCard,
  StreakCard,
  ContributionGraph,
  LanguagesDonut,
  ReposList,
  ActivitySummary,
  CalendarHeatmap,
  PushBarChart,
  SocialStrip,
  FooterBlocks,
  ThemeColors
} from './DataBlocks.js';

interface PosterProps {
  username?: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  joinedDate?: string;
  devClass?: string;
  followers?: number;
  following?: number;
  stars?: number;
  commits?: number;
  prs?: number;
  issues?: number;
  contributedTo?: number;
  grade?: string;
  totalContributions?: number;
  currentStreak?: number;
  longestStreak?: number;
  streakDateRange?: string;
  longestStreakDateRange?: string;
  contributionsHistory?: number[];
  languages?: Array<{ name: string; percentage: number; color: string }>;
  repos?: Array<{ name: string; stars: number }>;
  totalReposCount?: number;
  activityPRs?: number;
  activityIssuesOpened?: number;
  activityIssuesClosed?: number;
  activityReposContributed?: number;
  activityReposOwned?: number;
  activityTotalWatchers?: number;
  commitData?: number[];
  pushHistory?: number[];
  reviews?: number;
  starsGiven?: number;
  gists?: number;
  orgs?: string | number;
  projects?: number;
  packages?: number;
  aboutText?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  email?: string;
  location?: string;
  timestamp?: string;
  theme?: 'blueprint' | 'cyberpunk' | 'matrix' | 'amber';
  layout?: 'poster' | 'banner';
  badges?: any[];
}

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
    cardBg: '#140a24'
  },
  matrix: {
    bg: '#020804',
    grid: '#00ff41',
    stroke: '#00ff41',
    accent1: '#39ff14',
    accent2: '#008f11',
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

export const Poster = ({
  username = 'Garvit-821',
  name = 'GARVIT PRAKASH',
  avatarUrl = 'https://avatars.githubusercontent.com/u/77626922?v=4',
  bio = 'Building the future, one commit at a time.',
  joinedDate = 'Jan 19, 2021',
  followers = 18,
  following = 12,
  stars = 68,
  commits = 130,
  prs = 5,
  issues = 0,
  contributedTo = 0,
  devClass = 'Senior Core Engineer',
  grade = 'B-',
  totalContributions = 251,
  currentStreak = 10,
  longestStreak = 10,
  streakDateRange = 'Jun 25 - Jul 4',
  longestStreakDateRange = 'Jan 25 - Jul 4',
  contributionsHistory = [2, 5, 3, 8, 2, 4, 12, 18, 5, 9, 14, 8, 12, 5, 7],
  languages = [
    { name: 'JavaScript', percentage: 45.1, color: '#f7df1e' },
    { name: 'HTML', percentage: 23.7, color: '#e34f26' },
    { name: 'CSS', percentage: 12.4, color: '#1572b6' },
    { name: 'Python', percentage: 8.6, color: '#3776ab' },
    { name: 'Other', percentage: 10.2, color: '#666666' }
  ],
  repos = [
    { name: 'gpdev.in', stars: 23 },
    { name: 'ai-document-analyzer', stars: 12 },
    { name: 'hackhub', stars: 8 },
    { name: 'gpGenie', stars: 7 },
    { name: 'obsidian-chatroom', stars: 6 }
  ],
  totalReposCount = 20,
  activityPRs = 5,
  activityIssuesOpened = 0,
  activityIssuesClosed = 0,
  activityReposContributed = 0,
  activityReposOwned = 15,
  activityTotalWatchers = 23,
  commitData = Array.from({ length: 371 }, (_, i) => (i % 7 === 0 || i % 13 === 0) ? Math.floor(Math.random() * 8) : 0),
  pushHistory = [10, 20, 15, 20, 12, 16, 25, 20, 14, 18, 38, 75],
  reviews = 2,
  starsGiven = 12,
  gists = 3,
  orgs = '-',
  projects = 4,
  packages = 1,
  aboutText = 'Full Stack Developer | AI & Automation Builder of modern web apps, AI tools, and productivity solutions.',
  portfolioUrl = 'https://dev.gpdev.in',
  websiteUrl = 'https://gpdev.in',
  email = 'contact@gpdev.in',
  location = 'Delhi, India',
  timestamp = '2026-07-06 00:00:00 UTC',
  theme = 'blueprint',
  layout = 'poster',
  badges = []
}: PosterProps) => {
  const colors = themeMap[theme] || themeMap.blueprint;
  const width = 1200;
  const height = layout === 'banner' ? 400 : 1600;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      style={{ background: colors.bg, fontFamily: '"JetBrains Mono", monospace' }}
    >
      <defs>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&amp;display=swap');

          /* Heatmap node pulsing animation */
          @keyframes nodePulse {
            0%, 100% { fill-opacity: 0.45; }
            50% { fill-opacity: 1; }
          }
          .data-node {
            animation: nodePulse 3s infinite ease-in-out;
          }
        `}} />

        {/* Gradient for diagnostic area under line chart */}
        <linearGradient id="chart-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={colors.stroke} stopOpacity="0" />
        </linearGradient>

        {/* Grid pattern background */}
        <pattern id="poster-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="none" />
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={colors.grid} strokeWidth="0.5" strokeOpacity="0.04" />
        </pattern>
      </defs>

      <circle cx="0" cy="0" r="0" class="radar-beam" fill="none" />

      {/* --- BACKGROUND GRID --- */}
      <rect width={width} height={height} fill="url(#poster-grid)" />
      
      {/* Outer borders */}
      <rect x="15" y="15" width={width - 30} height={height - 30} fill="none" stroke={colors.stroke} strokeWidth="0.5" strokeOpacity="0.1" />
      <rect x="20" y="20" width={width - 40} height={height - 40} fill="none" stroke={colors.stroke} strokeWidth="1" strokeOpacity="0.2" />

      {layout === 'banner' ? (
        <Fragment>
          {/* BANNER LAYOUT (1200x400): side-by-side elements */}
          <g transform="translate(40, 40)">
            <ProfileHeader
              username={username}
              name={name}
              avatarUrl={avatarUrl}
              bio={bio}
              joinedDate={joinedDate}
              devClass={devClass}
              colors={colors}
              width={700}
              height={130}
            />
          </g>

          <g transform="translate(820, 40)">
            {/* Scale and position languages donut on right */}
            <LanguagesDonut languages={languages.slice(0, 3)} colors={colors} />
          </g>

          {/* Simple status line at bottom of banner */}
          <g transform="translate(40, 355)">
            <line x1="0" y1="0" x2="1120" y2="0" stroke={colors.grid} strokeWidth="0.5" strokeOpacity="0.4" />
            <text x="0" y="20" fill="#666666" fontSize="10" fontFamily="monospace">
              DEVELOPED BY GITHUB.COM/GARVIT-821 // LAUNCHED 2026
            </text>
            <text x="1120" y="20" fill="#666666" fontSize="10" fontFamily="monospace" textAnchor="end">
              TIMESTAMP: {timestamp}
            </text>
          </g>
        </Fragment>
      ) : (
        <Fragment>
          {/* POSTER LAYOUT (1200x1600) */}
          
          {/* 1. Header (y: 55) */}
          <g transform="translate(40, 55)">
            <ProfileHeader
              username={username}
              name={name}
              avatarUrl={avatarUrl}
              bio={bio}
              joinedDate={joinedDate}
              devClass={devClass}
              colors={colors}
              location={location}
              websiteUrl={websiteUrl}
              followers={followers}
              following={following}
              hireable={username === 'Garvit-821'}
            />
          </g>

          {/* 2. Row 2 (y: 205): 7 side-by-side circular stats cards */}
          <g transform="translate(40, 205)">
            <GradeCard grade={grade} colors={colors} />
          </g>
          <g transform="translate(204, 205)">
            <SimpleMetricCard value={stars} label="Total Stars" colors={colors} />
          </g>
          <g transform="translate(368, 205)">
            <SimpleMetricCard value={commits} label="Total Commits" subLabel="Last Year" colors={colors} />
          </g>
          <g transform="translate(532, 205)">
            <SimpleMetricCard value={prs} label="Total PRs" colors={colors} />
          </g>
          <g transform="translate(696, 205)">
            <SimpleMetricCard value={totalContributions} label="Total Contributions" subLabel={joinedDate + " - Present"} colors={colors} />
          </g>
          <g transform="translate(860, 205)">
            <StreakCard title="Current Streak" value={currentStreak} dateRange={streakDateRange} isCurrent={true} colors={colors} />
          </g>
          <g transform="translate(1024, 205)">
            <StreakCard title="Longest Streak" value={longestStreak} dateRange={longestStreakDateRange} isCurrent={false} colors={colors} />
          </g>

          {/* 3. Row 3 (y: 335): Contributions Line Chart (left) + Green Heatmap (right) */}
          <g transform="translate(40, 335)">
            <ContributionGraph history={contributionsHistory} colors={colors} />
          </g>
          <g transform="translate(610, 335)">
            <CalendarHeatmap commitData={commitData} colors={colors} isGreen={true} title="CONTRIBUTIONS IN THE LAST YEAR" />
          </g>

          {/* 4. Row 4 (y: 575): Languages (left) + Top Repos (middle) + Activity Summary (right) */}
          <g transform="translate(40, 575)">
            <LanguagesDonut languages={languages} colors={colors} />
          </g>
          <g transform="translate(400, 575)">
            <ReposList repos={repos} totalReposCount={totalReposCount} colors={colors} />
          </g>
          <g transform="translate(760, 575)">
            <ActivitySummary
              pullRequests={activityPRs}
              issuesOpened={activityIssuesOpened}
              issuesClosed={activityIssuesClosed}
              reposContributed={activityReposContributed}
              reposOwned={activityReposOwned}
              totalWatchers={activityTotalWatchers}
              colors={colors}
            />
          </g>

          {/* 5. Row 5 (y: 915): Purple themed Heatmap (left) + Push Bar Chart (right) */}
          <g transform="translate(40, 915)">
            <CalendarHeatmap commitData={commitData} colors={colors} isGreen={false} title="COMMIT ACTIVITY (LAST 12 MONTHS)" />
          </g>
          <g transform="translate(610, 915)">
            <PushBarChart pushHistory={pushHistory} colors={colors} />
          </g>

          {/* 6. Row 6 (y: 1155): 1x6 Social Strip */}
          <g transform="translate(40, 1155)">
            <SocialStrip
              reviews={reviews}
              starsGiven={starsGiven}
              gists={gists}
              orgs={orgs}
              projects={projects}
              packages={packages}
              colors={colors}
            />
          </g>

          {/* 7. Row 7 (y: 1265): Footer Columns */}
          <g transform="translate(40, 1265)">
            <FooterBlocks
              aboutText={aboutText}
              portfolioUrl={portfolioUrl}
              websiteUrl={websiteUrl}
              email={email}
              location={location}
              colors={colors}
              badges={badges}
            />
          </g>

          {/* 8. Row 8: Bottom Metabar (y: 1530) */}
          <g transform="translate(40, 1530)">
            <line x1="0" y1="0" x2="1120" y2="0" stroke={colors.grid} strokeWidth="0.5" strokeOpacity="0.4" />
            <text x="0" y="24" fill="#666666" fontSize="11" fontFamily="monospace">
              Last Updated: {timestamp}
            </text>
            <text x="1120" y="24" fill="#a8a8a8" fontSize="11" fontFamily="sans-serif" textAnchor="end">
              Made with <tspan fill={colors.stroke}>💜</tspan> by Garvit Prakash
            </text>
          </g>
        </Fragment>
      )}
    </svg>
  );
};
