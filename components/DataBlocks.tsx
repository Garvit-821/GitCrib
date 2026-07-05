import { Fragment, h } from 'preact';

export interface ThemeColors {
  bg: string;
  grid: string;
  stroke: string;
  accent1: string;
  accent2: string;
  cardBg: string;
}

// Helper: Format number with commas
export const formatNum = (n: number | string): string => {
  if (typeof n === 'string') return n;
  return n.toLocaleString();
};

// SVG Path Icons
const Icons = {
  star: <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" />,
  commit: <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm-9 5h5a4.002 4.002 0 017.8 0h5a1 1 0 110 2h-5a4.002 4.002 0 01-7.8 0H3a1 1 0 110-2z" fill="currentColor" />,
  pr: <path d="M18 16a3 3 0 100 6 3 3 0 000-6zm-11 0a3 3 0 100 6 3 3 0 000-6zm0-14a3 3 0 100 6 3 3 0 000-6zm6 9a3 3 0 10-6 0v2h6v-2zm-3-5V4H7v2h3z" fill="currentColor" />,
  issue: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />,
  repo: <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" fill="currentColor" />,
  people: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor" />,
  flame: <path d="M12 23a7.5 7.5 0 007.5-7.5c0-3.5-2.5-6-5.5-8.5-1.5-1.25-2-2.5-2-3.5 0-.5.5-1 1-1.5-3.5.5-5 3.5-5 6.5C8 13 9 14.5 9 15.5c0 1-.5 1.5-1 1.5-.5 0-1-.5-1-1.5 0-2-1.5-3.5-3-5.5-.5 2.5.5 6 3 8 1.5 1.25 3 2 5 2z" fill="currentColor" />,
  medal: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-1.07 1.07V15h-2v-3.07L9.93 9.25l1.41-1.41L12 8.51l.66-.67 1.41 1.41z" fill="currentColor" />,
  location: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />,
  watch: <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor" />,
  review: <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" fill="currentColor" />,
  gist: <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor" />,
  org: <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-6L2 9v1H20V9L11.5 4z" fill="currentColor" />,
  project: <path d="M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 4v4h16V6H4zm0 6v8h16v-8H4z" fill="currentColor" />,
  package: <path d="M12 2L2 7l10 5 10-5-10-5zm0 18l-10-5V9.5l10 5 10-5V15l-10 5z" fill="currentColor" />,
  globe: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.33-.14 2 0 .67.06 1.34.14 2H4.26zm.82 2h2.95c.18 1.3.65 2.51 1.38 3.56A8.03 8.03 0 015.08 16zm2.95-8H5.08a8.03 8.03 0 015.07-3.56C9.42 5.75 8.95 6.96 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.34-.16-2 0-.66.07-1.34.16-2h4.68c.09.66.16 1.34.16 2 0 .66-.07 1.34-.16 2zm.22 5.56c.73-1.05 1.2-2.26 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.62 14c.08-.66.14-1.33.14-2 0-.67-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" fill="currentColor" />,
  mail: <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor" />
};

// Tech Logo SVG paths
const TechLogos: Record<string, h.JSX.Element> = {
  html: (
    <g transform="translate(0, 0) scale(1)">
      <path d="M2 2h20l-1.8 17.7L12 22 3.8 19.7z" fill="#E34F26" />
      <path d="M12 3.8v16.4l6.4-1.8 1.4-14.6z" fill="#EF652A" />
      <path d="M12 8.5H8.7l-.2-2.5h7l-.2 2.5zm0 5H9.1l-.2-2.5H12V8.5h3.2l-.3 3.5-3 1.5zm0 3.3l-3.2-.9-.2-2.4H6.1l.4 5.3 5.5 1.5z" fill="#FFF" />
    </g>
  ),
  css: (
    <g transform="translate(0, 0) scale(1)">
      <path d="M2 2h20l-1.8 17.7L12 22 3.8 19.7z" fill="#1572B6" />
      <path d="M12 3.8v16.4l6.4-1.8 1.4-14.6z" fill="#21A1F1" />
      <path d="M12 8.5H8.7l-.2-2.5h7l-.2 2.5zm0 5H9.1l-.2-2.5H12V8.5h3.2l-.3 3.5-3 1.5zm0 3.3l-3.2-.9-.2-2.4H6.1l.4 5.3 5.5 1.5z" fill="#FFF" />
    </g>
  ),
  javascript: (
    <g transform="translate(0, 0)">
      <rect width="24" height="24" rx="3" fill="#F7DF1E" />
      <path d="M18.8 18.2c-.3.8-.9 1.4-1.8 1.7-.8.3-1.8.4-2.8.4-1.2 0-2.1-.2-2.8-.7-.7-.5-1.1-1.2-1.3-2.1l2.3-1.3c.1.6.4 1 .8 1.3.4.3.9.4 1.6.4.6 0 1-.1 1.3-.4.3-.3.4-.6.4-1.1 0-.9-.6-1.4-1.9-1.5l-1-.1c-1.3-.2-2.3-.6-2.9-1.3-.6-.7-.9-1.6-.9-2.7 0-1.1.4-2 1.1-2.6s1.8-1 3.1-1c1.1 0 2 .2 2.7.6.7.4 1.2 1.1 1.4 1.9l-2.2 1.3c-.2-.4-.4-.7-.7-.9-.3-.2-.7-.3-1.2-.3-.5 0-.9.1-1.2.3-.3.2-.4.5-.4.9 0 .6.5.9 1.5 1.1l1.1.1c1.6.2 2.7.7 3.3 1.4.6.8.9 1.8.9 3z" fill="#000" />
    </g>
  ),
  react: (
    <g transform="translate(0, 0)">
      <circle cx="12" cy="12" r="2" fill="#61DAFB" />
      <ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(90 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(150 12 12)" />
    </g>
  ),
  node: (
    <g transform="translate(0, 0)">
      <path d="M12 2L4 6.5v9L12 20l8-4.5v-9L12 2zm6 12.5l-6 3.4-6-3.4V7.5l6-3.4 6 3.4v7z" fill="#339933" />
      <path d="M12 6.8l4 2.3v4.6l-4 2.3-4-2.3V9.1z" fill="#66CC33" />
    </g>
  ),
  python: (
    <g transform="translate(0, 0)">
      <path d="M12.1 2c-3.1 0-2.9 1.3-2.9 1.3v2.1h5.9v.8H9.2S6.3 5.9 6.3 9c0 3.1 2.6 3 2.6 3h1.6v-2.2c0-2.4 2-4.3 4.4-4.3h4.3V3.7c0-.1-.6-1.7-7.1-1.7zm5.6 4.3a.7.7 0 110 1.4.7.7 0 010-1.4z" fill="#3776AB" />
      <path d="M11.9 22c3.1 0 2.9-1.3 2.9-1.3V18.6H8.9v-.8h5.9s2.9.3 2.9-2.8c0-3.1-2.6-3-2.6-3h-1.6v2.2c0 2.4-2 4.3-4.4 4.3H4.8v1.8c0 .1.6 1.7 7.1 1.7zm-5.6-4.3a.7.7 0 110-1.4.7.7 0 010-1.4z" fill="#FFD43B" />
    </g>
  ),
  typescript: (
    <g transform="translate(0, 0)">
      <rect width="24" height="24" rx="3" fill="#3178C6" />
      <path d="M10.4 17.8H8.3v-8h-2.5v-1.7h7.5v1.7h-2.5v8.1zm8.3.1c-.5.8-1.2 1.3-2 1.6-.9.3-1.9.4-3 .4-1.2 0-2.2-.2-2.9-.6s-1.2-1.1-1.4-1.9l2.2-1.2c.1.4.3.7.6.9.3.2.7.3 1.3.3.6 0 1-.1 1.3-.3s.4-.5.4-.9c0-.9-.7-1.3-2.1-1.4l-1-.1c-1.3-.2-2.2-.6-2.8-1.2-.6-.7-.9-1.5-.9-2.6 0-1.1.4-1.9 1.1-2.5s1.8-.9 3-.9c1.1 0 2 .2 2.7.5.7.3 1.2 1 1.4 1.7l-2.1 1.2c-.1-.4-.3-.6-.5-.8-.2-.2-.6-.3-1.1-.3-.5 0-.9.1-1.1.3-.2.2-.3.4-.3.8 0 .5.4.8 1.3.9l1.1.1c1.5.2 2.6.7 3.2 1.3s.9 1.6.9 2.7z" fill="#FFF" />
    </g>
  ),
  git: (
    <g transform="translate(0, 0)">
      <path d="M22.6 11.3L12.7 1.4c-.5-.5-1.3-.5-1.8 0L9.4 3l3.6 3.6c.3-.1.7 0 1 .3.3.3.4.7.3 1l3.6 3.6c.3-.1.7 0 1 .3.4.4.4 1.1 0 1.5s-1.1.4-1.5 0c-.3-.3-.4-.7-.3-1l-3.5-3.5v5.1c.3.2.4.5.4.8 0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1c0-.3.1-.6.4-.8V9.2c-.3-.2-.4-.5-.4-.8 0-.3.1-.6.3-1L8.5 3.8 1.4 10.9c-.5.5-.5 1.3 0 1.8l9.9 9.9c.5.5 1.3.5 1.8 0l9.5-9.5c.5-.5.5-1.3 0-1.8z" fill="#F05032" />
    </g>
  ),
  github: (
    <g transform="translate(0, 0)">
      <path d="M12 .3C5.4.3 0 5.7 0 12.3c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0024 12C24 5.7 18.6.3 12 .3z" fill="#FFF" />
    </g>
  ),
  vercel: (
    <g transform="translate(0, 0)">
      <path d="M12 2L24 22H0z" fill="#FFF" />
    </g>
  ),
  figma: (
    <g transform="translate(0, 0)">
      <path d="M8 2h4v8H8zm8 4h-4v4h4zm-8 8h4v4H8zm8-4h4V6h-4zm0 8a4 4 0 11-4-4h4z" fill="#F24E1E" />
      <path d="M8 6a4 4 0 118 0 4 4 0 01-8 0z" fill="#FF7262" />
      <path d="M12 14v4a4 4 0 01-4-4h4z" fill="#1ABC9C" />
      <path d="M16 10a4 4 0 110-8 4 4 0 010 8z" fill="#A259FF" />
      <path d="M12 6h4v4h-4zm0 8h4v-4h-4z" fill="#1ABC9C" />
    </g>
  )
};

// 1. Profile Header Block
interface ProfileHeaderProps {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  joinedDate: string;
  devClass?: string;
  colors: ThemeColors;
  width?: number;
  height?: number;
}

export const ProfileHeader = ({
  username,
  name,
  avatarUrl,
  bio,
  joinedDate,
  devClass,
  colors,
  width = 1120,
  height = 130
}: ProfileHeaderProps) => {
  const avatarCX = 460;
  const avatarCY = 65;

  return (
    <g id="header-block">
      {/* Title */}
      <text x="40" y="45" fill="#ffffff" fontSize="36" fontFamily="sans-serif" fontWeight="800" letterSpacing="-1">
        DEVELOPER WORKSPACE
      </text>
      <text x="40" y="85" fill={colors.stroke} fontSize="28" fontFamily="sans-serif" fontWeight="800" letterSpacing="-1">
        GITHUB ANALYTICS
      </text>
      <text x="40" y="112" fill={colors.accent1} fontSize="11" fontFamily="monospace" fontWeight="800" letterSpacing="1.5">
        CODE. COMMIT. CONQUER.
      </text>

      {/* Avatar Image Frame */}
      <defs>
        <clipPath id="avatar-clip">
          <circle cx={avatarCX} cy={avatarCY} r="45" />
        </clipPath>
      </defs>
      
      {/* Avatar Shadow/Glow */}
      <circle cx={avatarCX} cy={avatarCY} r="48" fill="none" stroke={colors.stroke} strokeWidth="2.5" />
      
      {/* Dynamic Avatar Image */}
      <image
        href={avatarUrl || 'https://avatars.githubusercontent.com/u/9919?v=4'}
        x={avatarCX - 45}
        y={avatarCY - 45}
        width="90"
        height="90"
        clipPath="url(#avatar-clip)"
      />

      {/* Profile info text */}
      <text x="530" y="55" fill="#ffffff" fontSize="24" fontFamily="sans-serif" fontWeight="700">
        {name || username}
      </text>
      <text x="530" y="78" fill={colors.accent1} fontSize="14" fontFamily="monospace" fontWeight="500">
        @{username.toUpperCase()}{devClass ? ' // ' + devClass.toUpperCase() : ''}
      </text>
      <text x="530" y="105" fill="#a8a8a8" fontSize="13" fontFamily="sans-serif" width="280">
        {bio || 'Building the future, one commit at a time.'}
      </text>

      {/* Badges Right */}
      <g transform="translate(860, 20)">
        {/* Badge 1 */}
        <rect width="220" height="42" rx="6" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
        <g transform="translate(15, 12)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="badge-icon" style={{ color: colors.stroke }}>
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
          </svg>
          <text x="30" y="13" fill="#a8a8a8" fontSize="11" fontFamily="sans-serif">Since</text>
          <text x="75" y="13" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">{joinedDate || 'Jan 19, 2021'}</text>
        </g>

        {/* Badge 2 */}
        <g transform="translate(0, 52)">
          <rect width="220" height="42" rx="6" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
          <g transform="translate(15, 12)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="badge-icon" style={{ color: colors.stroke }}>
              <path d={Icons.globe.props.d} fill="currentColor" />
            </svg>
            <text x="30" y="13" fill="#a8a8a8" fontSize="11" fontFamily="sans-serif">Profile</text>
            <text x="75" y="13" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">github.com/{username}</text>
          </g>
        </g>
      </g>
    </g>
  );
};

// 2. Overview Card (Box 1 in Row 1)
interface OverviewProps {
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  contributedTo: number;
  followers: number | string;
  following: number | string;
  colors: ThemeColors;
}

export const OverviewList = ({
  stars,
  commits,
  prs,
  issues,
  contributedTo,
  followers,
  following,
  colors
}: OverviewProps) => {
  const items = [
    { label: 'Total Stars Earned:', value: formatNum(stars), icon: Icons.star },
    { label: 'Total Commits (last year):', value: formatNum(commits), icon: Icons.commit },
    { label: 'Total PRs:', value: formatNum(prs), icon: Icons.pr },
    { label: 'Total Issues:', value: formatNum(issues), icon: Icons.issue },
    { label: 'Contributed to (last year):', value: formatNum(contributedTo), icon: Icons.repo },
    { label: 'Followers:', value: formatNum(followers), icon: Icons.people },
    { label: 'Following:', value: formatNum(following), icon: Icons.people }
  ];

  return (
    <g id="metrics-grid">
      {/* Background Panel */}
      <rect width="340" height="450" rx="12" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
      
      <text x="25" y="35" fill={colors.stroke} fontSize="14" fontFamily="sans-serif" fontWeight="800" letterSpacing="0.5">
        OVERVIEW
      </text>

      {items.map((item, idx) => {
        const y = 80 + idx * 52;
        return (
          <g key={`ov-${idx}`} transform={`translate(25, ${y})`}>
            {/* Divider */}
            {idx > 0 && <line x1="0" y1="-15" x2="290" y2="-15" stroke={colors.grid} strokeWidth="0.5" strokeOpacity="0.5" />}
            
            {/* Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ color: colors.stroke }}>
              {item.icon}
            </svg>

            {/* Label */}
            <text x="28" y="13" fill="#a8a8a8" fontSize="13" fontFamily="sans-serif">
              {item.label}
            </text>

            {/* Value */}
            <text x="290" y="13" fill="#ffffff" fontSize="14" fontFamily="monospace" fontWeight="700" textAnchor="end">
              {item.value || '-'}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// 3. Grade Card Donut (y: 180, x: 400)
interface GradeCardProps {
  grade: string;
  colors: ThemeColors;
}

export const GradeCard = ({ grade = 'B-', colors }: GradeCardProps) => {
  const cx = 85;
  const cy = 80;
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  
  // Custom offset based on grade tier
  const getOffset = (g: string) => {
    if (g.startsWith('A')) return circ * 0.15;
    if (g.startsWith('B')) return circ * 0.35;
    return circ * 0.55;
  };

  return (
    <g>
      <rect width="170" height="160" rx="12" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
      
      {/* Outer track */}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={colors.grid} strokeWidth="8" strokeOpacity="0.2" />
      
      {/* Filled track */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={colors.stroke}
        strokeWidth="8"
        strokeDasharray={circ.toFixed(1)}
        strokeDashoffset={getOffset(grade).toFixed(1)}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />

      {/* Grade center value */}
      <text x={cx} y={cy + 8} fill="#ffffff" fontSize="24" fontFamily="monospace" fontWeight="900" textAnchor="middle">
        {grade}
      </text>

      <text x="85" y="138" fill={colors.stroke} fontSize="11" fontFamily="sans-serif" fontWeight="700" textAnchor="middle">
        GitHub Grade
      </text>
    </g>
  );
};

// 4. Contributions Card
interface ContributionsCardProps {
  total: number;
  dateRange: string;
  colors: ThemeColors;
}

export const ContributionsCard = ({ total, dateRange, colors }: ContributionsCardProps) => {
  return (
    <g>
      <rect width="170" height="160" rx="12" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
      
      <text x="85" y="65" fill="#ffffff" fontSize="38" fontFamily="monospace" fontWeight="900" textAnchor="middle">
        {formatNum(total)}
      </text>

      <text x="85" y="105" fill={colors.stroke} fontSize="11" fontFamily="sans-serif" fontWeight="700" textAnchor="middle">
        Total Contributions
      </text>

      <text x="85" y="132" fill="#888888" fontSize="9" fontFamily="monospace" textAnchor="middle">
        {dateRange || 'Jan 19, 2021 - Present'}
      </text>
    </g>
  );
};

// 5. Streak Card
interface StreakCardProps {
  title: string;
  value: number;
  dateRange: string;
  isCurrent: boolean;
  colors: ThemeColors;
}

export const StreakCard = ({ title, value, dateRange, isCurrent, colors }: StreakCardProps) => {
  return (
    <g>
      <rect width="170" height="160" rx="12" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
      
      {/* Icon top right */}
      <svg x="135" y="12" width="20" height="20" viewBox="0 0 24 24" style={{ color: colors.accent1 }}>
        {isCurrent ? Icons.flame : Icons.medal}
      </svg>

      <text x="85" y="65" fill="#ffffff" fontSize="38" fontFamily="monospace" fontWeight="900" textAnchor="middle">
        {value}
      </text>

      <text x="85" y="105" fill={colors.stroke} fontSize="11" fontFamily="sans-serif" fontWeight="700" textAnchor="middle">
        {title}
      </text>

      <text x="85" y="132" fill="#888888" fontSize="9" fontFamily="monospace" textAnchor="middle">
        {dateRange}
      </text>
    </g>
  );
};

// 6. Smooth Curved Line Contribution Graph
interface ContributionGraphProps {
  history: number[];
  colors: ThemeColors;
}

export const ContributionGraph = ({ history = [2, 5, 3, 8, 2, 4, 12, 18, 5, 9], colors }: ContributionGraphProps) => {
  const width = 760;
  const height = 270;

  // Render curved bezier path based on data points
  // 15 coordinates spaced evenly
  const pointsCount = history.length;
  const paddingX = 50;
  const graphWidth = width - paddingX * 2;
  const spacingX = graphWidth / (pointsCount - 1);
  const graphHeight = 140;
  const baseY = 210;

  const maxVal = Math.max(...history, 10);
  const coords = history.map((val, idx) => {
    const cx = paddingX + idx * spacingX;
    const cy = baseY - (val / maxVal) * graphHeight;
    return { x: cx, y: cy };
  });

  // Build smooth bezier curves path
  let pathStr = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const cpX1 = coords[i].x + spacingX / 3;
    const cpY1 = coords[i].y;
    const cpX2 = coords[i + 1].x - spacingX / 3;
    const cpY2 = coords[i + 1].y;
    pathStr += ` C ${cpX1.toFixed(1)} ${cpY1.toFixed(1)}, ${cpX2.toFixed(1)} ${cpY2.toFixed(1)}, ${coords[i+1].x.toFixed(1)} ${coords[i+1].y.toFixed(1)}`;
  }

  // Filled area path string
  const fillPathStr = `${pathStr} L ${coords[coords.length - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`;

  return (
    <g>
      <rect width={width} height={height} rx="12" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
      
      <text x="25" y="35" fill={colors.stroke} fontSize="13" fontFamily="sans-serif" fontWeight="800">
        CONTRIBUTION GRAPH
      </text>

      {/* Grid line specs */}
      <line x1={paddingX} y1={baseY} x2={width - paddingX} y2={baseY} stroke={colors.grid} strokeWidth="1" strokeOpacity="0.4" />
      <line x1={paddingX} y1={baseY - graphHeight / 2} x2={width - paddingX} y2={baseY - graphHeight / 2} stroke={colors.grid} strokeWidth="0.5" strokeDasharray="3,6" strokeOpacity="0.2" />
      <line x1={paddingX} y1={baseY - graphHeight} x2={width - paddingX} y2={baseY - graphHeight} stroke={colors.grid} strokeWidth="0.5" strokeDasharray="3,6" strokeOpacity="0.2" />

      {/* Area Gradient Fill */}
      <polygon points="" fill="url(#chart-area-gradient)" d={fillPathStr} />

      {/* Line path */}
      <path d={pathStr} fill="none" stroke={colors.stroke} strokeWidth="3" />

      {/* Dots on nodes */}
      {coords.map((c, i) => (
        <circle key={`node-${i}`} cx={c.x.toFixed(1)} cy={c.y.toFixed(1)} r="4.5" fill={colors.accent1} stroke="#ffffff" strokeWidth="1" />
      ))}

      {/* Axis dates / numbers */}
      <text x={paddingX - 12} y={baseY + 5} fill="#666666" fontSize="10" fontFamily="monospace" textAnchor="end">0</text>
      <text x={paddingX - 12} y={baseY - graphHeight / 2 + 4} fill="#666666" fontSize="10" fontFamily="monospace" textAnchor="end">{(maxVal / 2).toFixed(0)}</text>
      <text x={paddingX - 12} y={baseY - graphHeight + 4} fill="#666666" fontSize="10" fontFamily="monospace" textAnchor="end">{maxVal}</text>

      <text x="380" y="248" fill="#666666" fontSize="10" fontFamily="monospace" textAnchor="middle">Date</text>
      <text x={paddingX} y={230} fill="#666666" fontSize="10" fontFamily="monospace" textAnchor="middle">6</text>
      <text x={width - paddingX} y={230} fill="#666666" fontSize="10" fontFamily="monospace" textAnchor="middle">6</text>
    </g>
  );
};

// 7. Languages Donut component
interface LanguageData {
  name: string;
  percentage: number;
  color: string;
}

interface LanguagesDonutProps {
  languages: LanguageData[];
  colors: ThemeColors;
}

export const LanguagesDonut = ({ languages, colors }: LanguagesDonutProps) => {
  const cx = 95;
  const cy = 180;
  const radius = 52;
  const circ = 2 * Math.PI * radius;

  let cumulativePercentage = 0;

  return (
    <g id="language-spectrogram">
      <rect width="340" height="320" rx="12" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
      
      <text x="25" y="35" fill={colors.stroke} fontSize="13" fontFamily="sans-serif" fontWeight="800">
        LANGUAGES
      </text>

      {/* Donut base back circle */}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={colors.grid} strokeWidth="16" strokeOpacity="0.2" />

      {/* Segment Rendering */}
      {languages.map((lang, idx) => {
        const offset = circ - (lang.percentage / 100) * circ;
        const rotate = (cumulativePercentage / 100) * 360 - 90;
        cumulativePercentage += lang.percentage;

        return (
          <circle
            key={`lang-seg-${idx}`}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={lang.color}
            strokeWidth="16"
            strokeDasharray={circ.toFixed(1)}
            strokeDashoffset={offset.toFixed(1)}
            transform={`rotate(${rotate.toFixed(1)} ${cx} ${cy})`}
          />
        );
      })}

      {/* Legend list right */}
      {languages.map((lang, idx) => {
        const y = 80 + idx * 36;
        return (
          <g key={`lang-legend-${idx}`} transform={`translate(180, ${y})`}>
            {/* Color block */}
            <rect width="12" height="12" rx="3" fill={lang.color} />
            <text x="20" y="11" fill="#ffffff" fontSize="12" fontFamily="sans-serif" fontWeight="600">
              {lang.name}
            </text>
            <text x="135" y="11" fill="#a8a8a8" fontSize="12" fontFamily="monospace" textAnchor="end">
              {lang.percentage.toFixed(1)}%
            </text>
          </g>
        );
      })}
    </g>
  );
};

// 8. Top Repositories list
interface RepoData {
  name: string;
  stars: number;
}

interface ReposListProps {
  repos: RepoData[];
  totalReposCount: number;
  colors: ThemeColors;
}

export const ReposList = ({ repos = [], totalReposCount = 20, colors }: ReposListProps) => {
  return (
    <g>
      <rect width="340" height="320" rx="12" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
      
      <text x="25" y="35" fill={colors.stroke} fontSize="13" fontFamily="sans-serif" fontWeight="800">
        TOP REPOSITORIES
      </text>

      {repos.slice(0, 5).map((repo, idx) => {
        const y = 80 + idx * 40;
        return (
          <g key={`repo-${idx}`} transform={`translate(25, ${y})`}>
            <text x="0" y="15" fill="#a8a8a8" fontSize="12" fontFamily="monospace">
              {idx + 1}.
            </text>
            <text x="22" y="15" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">
              {repo.name.length > 20 ? repo.name.substring(0, 18) + '..' : repo.name}
            </text>
            <g transform="translate(250, 2)">
              <svg width="14" height="14" viewBox="0 0 24 24" style={{ color: colors.accent1 }}>
                {Icons.star}
              </svg>
              <text x="18" y="11" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">
                {repo.stars}
              </text>
            </g>
          </g>
        );
      })}

      {totalReposCount > 5 && (
        <text x="25" y="280" fill="#666666" fontSize="11" fontFamily="sans-serif">
          And {totalReposCount - 5} more repositories...
        </text>
      )}
    </g>
  );
};

// 9. Activity Summary list
interface ActivitySummaryProps {
  pullRequests: number;
  issuesOpened: number;
  issuesClosed: number;
  reposContributed: number;
  reposOwned: number;
  totalWatchers: number;
  colors: ThemeColors;
}

export const ActivitySummary = ({
  pullRequests,
  issuesOpened,
  issuesClosed,
  reposContributed,
  reposOwned,
  totalWatchers,
  colors
}: ActivitySummaryProps) => {
  const items = [
    { label: 'Pull Requests', value: pullRequests, icon: Icons.pr },
    { label: 'Issues Opened', value: issuesOpened, icon: Icons.issue },
    { label: 'Issues Closed', value: issuesClosed, icon: Icons.issue },
    { label: 'Repositories Contributed', value: reposContributed, icon: Icons.repo },
    { label: 'Repositories Owned', value: reposOwned, icon: Icons.repo },
    { label: 'Total Watchers', value: totalWatchers, icon: Icons.watch }
  ];

  return (
    <g>
      <rect width="400" height="320" rx="12" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
      
      <text x="25" y="35" fill={colors.stroke} fontSize="13" fontFamily="sans-serif" fontWeight="800">
        ACTIVITY SUMMARY
      </text>

      {items.map((item, idx) => {
        const y = 80 + idx * 36;
        return (
          <g key={`act-${idx}`} transform={`translate(25, ${y})`}>
            <svg width="15" height="15" viewBox="0 0 24 24" style={{ color: colors.stroke, marginRight: 8 }}>
              {item.icon}
            </svg>
            <text x="25" y="12" fill="#a8a8a8" fontSize="13" fontFamily="sans-serif">
              {item.label}
            </text>
            <text x="350" y="12" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="end">
              {item.value}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// 10. Commit Calendar Heatmap grid (Aug - Jul)
interface CalendarHeatmapProps {
  commitData: number[]; // ~371 elements
  colors: ThemeColors;
}

export const CalendarHeatmap = ({ commitData = [], colors }: CalendarHeatmapProps) => {
  const width = 550;
  const height = 220;
  
  // Fill commitData to 371 items if not sufficient
  const data = commitData.length >= 371 ? commitData : Array.from({ length: 371 }, (_, i) => (i % 7 === 0 || i % 13 === 0) ? Math.floor(Math.random() * 8) : 0);

  const startX = 65;
  const startY = 65;
  const squareSize = 6;
  const gap = 2.2;
  const colSize = squareSize + gap;

  // Resolve color bucket
  const getFill = (val: number) => {
    if (val === 0) return '#161426'; // Empty cell color
    if (val < 3) return '#3b2075';
    if (val < 6) return '#6230c0';
    if (val < 10) return '#7b3aed';
    return '#a855f7';
  };

  const gridElements: h.JSX.Element[] = [];
  for (let c = 0; c < 53; c++) {
    for (let r = 0; r < 7; r++) {
      const idx = c * 7 + r;
      const val = data[idx] || 0;
      const x = startX + c * colSize;
      const y = startY + r * colSize;
      
      gridElements.push(
        <rect
          key={`cell-${c}-${r}`}
          x={x.toFixed(1)}
          y={y.toFixed(1)}
          width={squareSize}
          height={squareSize}
          rx="1"
          fill={getFill(val)}
          class="data-node"
        />
      );
    }
  }

  // Months labels
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  return (
    <g id="central-radial-heatmap">
      <rect width={width} height={height} rx="12" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
      
      <text x="25" y="35" fill={colors.stroke} fontSize="13" fontFamily="sans-serif" fontWeight="800">
        COMMIT ACTIVITY (LAST 12 MONTHS)
      </text>

      {/* Week labels */}
      <text x="25" y={startY + colSize * 1 + 5} fill="#666666" fontSize="9" fontFamily="monospace">Mon</text>
      <text x="25" y={startY + colSize * 3 + 5} fill="#666666" fontSize="9" fontFamily="monospace">Wed</text>
      <text x="25" y={startY + colSize * 5 + 5} fill="#666666" fontSize="9" fontFamily="monospace">Fri</text>

      {/* Month Labels */}
      {months.map((m, i) => {
        const x = startX + i * 4.4 * colSize;
        return (
          <text key={`month-${i}`} x={x.toFixed(1)} y={startY - 12} fill="#666666" fontSize="9" fontFamily="monospace" textAnchor="middle">
            {m}
          </text>
        );
      })}

      {/* Matrix Cells */}
      {gridElements}

      {/* Legend */}
      <g transform="translate(380, 172)">
        <text x="-10" y="8" fill="#666666" fontSize="9" fontFamily="monospace" textAnchor="end">Less</text>
        <rect x="0" y="0" width="8" height="8" rx="1" fill="#161426" />
        <rect x="10" y="0" width="8" height="8" rx="1" fill="#3b2075" />
        <rect x="20" y="0" width="8" height="8" rx="1" fill="#6230c0" />
        <rect x="30" y="0" width="8" height="8" rx="1" fill="#7b3aed" />
        <rect x="40" y="0" width="8" height="8" rx="1" fill="#a855f7" />
        <text x="55" y="8" fill="#666666" fontSize="9" fontFamily="monospace">More</text>
      </g>
    </g>
  );
};

// 11. Push Activity Bar Chart
interface PushBarChartProps {
  pushHistory: number[];
  colors: ThemeColors;
}

export const PushBarChart = ({ pushHistory = [10, 20, 15, 20, 12, 16, 25, 20, 14, 18, 38, 75], colors }: PushBarChartProps) => {
  const width = 550;
  const height = 220;
  const startX = 65;
  const baseY = 160;
  const barWidth = 18;
  const gap = 20;

  const maxVal = Math.max(...pushHistory, 80);

  return (
    <g>
      <rect width={width} height={height} rx="12" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
      
      <text x="25" y="35" fill={colors.stroke} fontSize="13" fontFamily="sans-serif" fontWeight="800">
        PUSH ACTIVITY (LAST 12 MONTHS)
      </text>

      {/* Grid lines */}
      <line x1={startX} y1={baseY} x2={width - 50} y2={baseY} stroke={colors.grid} strokeWidth="1" strokeOpacity="0.4" />
      <line x1={startX} y1={baseY - 40} x2={width - 50} y2={baseY - 40} stroke={colors.grid} strokeWidth="0.5" strokeDasharray="3,6" strokeOpacity="0.2" />
      <line x1={startX} y1={baseY - 80} x2={width - 50} y2={baseY - 80} stroke={colors.grid} strokeWidth="0.5" strokeDasharray="3,6" strokeOpacity="0.2" />

      {/* Bars */}
      {pushHistory.map((val, idx) => {
        const x = startX + idx * (barWidth + gap) + 8;
        const barHeight = (val / maxVal) * 100;
        const y = baseY - barHeight;
        
        return (
          <rect
            key={`push-bar-${idx}`}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx="3"
            fill={colors.stroke}
          >
            <animate
              attributeName="height"
              from="0"
              to={barHeight.toFixed(1)}
              dur="1.2s"
              begin="0.2s"
              fill="freeze"
            />
            <animate
              attributeName="y"
              from={baseY}
              to={y.toFixed(1)}
              dur="1.2s"
              begin="0.2s"
              fill="freeze"
            />
          </rect>
        );
      })}

      {/* X Labels */}
      {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, idx) => {
        const x = startX + idx * (barWidth + gap) + 8 + barWidth / 2;
        return (
          <text key={`label-m-${idx}`} x={x} y={baseY + 16} fill="#666666" fontSize="9" fontFamily="monospace" textAnchor="middle">
            {m}
          </text>
        );
      })}

      {/* Y Axis text labels */}
      <text x={startX - 10} y={baseY + 4} fill="#666666" fontSize="9" fontFamily="monospace" textAnchor="end">0</text>
      <text x={startX - 10} y={baseY - 40 + 4} fill="#666666" fontSize="9" fontFamily="monospace" textAnchor="end">{(maxVal / 2).toFixed(0)}</text>
      <text x={startX - 10} y={baseY - 80 + 4} fill="#666666" fontSize="9" fontFamily="monospace" textAnchor="end">{maxVal}</text>
    </g>
  );
};

// 12. Social Strip (1x6 horizontal metrics boxes)
interface SocialStripProps {
  reviews: number;
  starsGiven: number;
  gists: number;
  orgs: string | number;
  projects: number;
  packages: number;
  colors: ThemeColors;
}

export const SocialStrip = ({
  reviews,
  starsGiven,
  gists,
  orgs,
  projects,
  packages,
  colors
}: SocialStripProps) => {
  const cards = [
    { title: 'Code Reviews Given', value: formatNum(reviews), icon: Icons.review },
    { title: 'Stars Given', value: formatNum(starsGiven), icon: Icons.star },
    { title: 'Gists Created', value: formatNum(gists), icon: Icons.gist },
    { title: 'Organizations', value: formatNum(orgs), icon: Icons.org },
    { title: 'Projects Created', value: formatNum(projects), icon: Icons.project },
    { title: 'Packages Published', value: formatNum(packages), icon: Icons.package }
  ];

  const cardWidth = 174;
  const gap = 15;
  const height = 90;

  return (
    <g>
      {cards.map((c, idx) => {
        const x = idx * (cardWidth + gap);
        return (
          <g key={`social-card-${idx}`} transform={`translate(${x}, 0)`}>
            <rect width={cardWidth} height={height} rx="8" fill={colors.cardBg} stroke={colors.grid} strokeWidth="1" />
            
            {/* Icon */}
            <svg x="18" y="14" width="16" height="16" viewBox="0 0 24 24" style={{ color: colors.accent1 }}>
              {c.icon}
            </svg>
            
            {/* Title */}
            <text x="40" y="26" fill="#a8a8a8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
              {c.title}
            </text>
            
            {/* Value */}
            <text x="18" y="65" fill="#ffffff" fontSize="24" fontFamily="monospace" fontWeight="900">
              {c.value || '-'}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// 13. Footer Blocks
interface FooterBlocksProps {
  aboutText: string;
  portfolioUrl: string;
  websiteUrl: string;
  email: string;
  location: string;
  colors: ThemeColors;
}

export const FooterBlocks = ({
  aboutText,
  portfolioUrl,
  websiteUrl,
  email,
  location,
  colors
}: FooterBlocksProps) => {
  return (
    <g>
      {/* About Box */}
      <g transform="translate(0, 0)">
        <text x="0" y="0" fill={colors.stroke} fontSize="13" fontFamily="sans-serif" fontWeight="800">
          ABOUT
        </text>
        <text x="0" y="24" fill="#a8a8a8" fontSize="12" fontFamily="sans-serif" width="280">
          {aboutText || 'Full Stack Developer | AI & Automation Builder of modern web apps, AI tools, and productivity solutions.'}
        </text>

        {/* Code loop block */}
        <g transform="translate(0, 75)">
          <rect width="280" height="90" rx="6" fill="#040308" stroke={colors.grid} strokeWidth="0.5" />
          <text x="15" y="25" fill={colors.accent1} fontSize="11" fontFamily="monospace">
            while
          </text>
          <text x="48" y="25" fill="#ffffff" fontSize="11" fontFamily="monospace">
            (alive) &#123;
          </text>
          <text x="30" y="42" fill={colors.stroke} fontSize="11" fontFamily="monospace">
            code();
          </text>
          <text x="30" y="58" fill={colors.stroke} fontSize="11" fontFamily="monospace">
            sleep();
          </text>
          <text x="30" y="74" fill={colors.stroke} fontSize="11" fontFamily="monospace">
            repeat();
          </text>
          <text x="15" y="90" fill="#ffffff" fontSize="11" fontFamily="monospace">
            &#125;
          </text>
        </g>
      </g>

      {/* Tech Stack Box */}
      <g transform="translate(360, 0)">
        <text x="0" y="0" fill={colors.stroke} fontSize="13" fontFamily="sans-serif" fontWeight="800">
          TECH STACK
        </text>
        
        {/* Row 1 Icons */}
        <g transform="translate(0, 25)">
          {['html', 'css', 'javascript', 'react', 'node', 'python'].map((tech, i) => {
            const x = i * 44;
            return (
              <g key={`tech-${tech}`} transform={`translate(${x}, 0)`}>
                <rect width="36" height="36" rx="6" fill="#131122" />
                <g transform="translate(6, 6) scale(1)">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    {TechLogos[tech]}
                  </svg>
                </g>
              </g>
            );
          })}
        </g>

        {/* Row 2 Icons */}
        <g transform="translate(0, 75)">
          {['typescript', 'git', 'github', 'vercel', 'figma'].map((tech, i) => {
            const x = i * 44;
            return (
              <g key={`tech-${tech}`} transform={`translate(${x}, 0)`}>
                <rect width="36" height="36" rx="6" fill="#131122" />
                <g transform="translate(6, 6) scale(1)">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    {TechLogos[tech]}
                  </svg>
                </g>
              </g>
            );
          })}
        </g>
      </g>

      {/* Connect Box */}
      <g transform="translate(760, 0)">
        <text x="0" y="0" fill={colors.stroke} fontSize="13" fontFamily="sans-serif" fontWeight="800">
          CONNECT
        </text>

        {/* Portfolio link */}
        <g transform="translate(0, 22)">
          <svg width="16" height="16" viewBox="0 0 24 24" style={{ color: colors.accent1 }}>
            {Icons.globe}
          </svg>
          <text x="24" y="12" fill="#a8a8a8" fontSize="12" fontFamily="sans-serif">Portfolio:</text>
          <text x="90" y="12" fill="#ffffff" fontSize="12" fontFamily="monospace">{portfolioUrl}</text>
        </g>

        {/* Website link */}
        <g transform="translate(0, 52)">
          <svg width="16" height="16" viewBox="0 0 24 24" style={{ color: colors.accent1 }}>
            {Icons.globe}
          </svg>
          <text x="24" y="12" fill="#a8a8a8" fontSize="12" fontFamily="sans-serif">Website:</text>
          <text x="90" y="12" fill="#ffffff" fontSize="12" fontFamily="monospace">{websiteUrl}</text>
        </g>

        {/* Email link */}
        <g transform="translate(0, 82)">
          <svg width="16" height="16" viewBox="0 0 24 24" style={{ color: colors.accent1 }}>
            {Icons.mail}
          </svg>
          <text x="24" y="12" fill="#a8a8a8" fontSize="12" fontFamily="sans-serif">Email:</text>
          <text x="90" y="12" fill="#ffffff" fontSize="12" fontFamily="monospace">{email}</text>
        </g>

        {/* Location link */}
        <g transform="translate(0, 112)">
          <svg width="16" height="16" viewBox="0 0 24 24" style={{ color: colors.accent1 }}>
            {Icons.location}
          </svg>
          <text x="24" y="12" fill="#a8a8a8" fontSize="12" fontFamily="sans-serif">Location:</text>
          <text x="90" y="12" fill="#ffffff" fontSize="12" fontFamily="sans-serif">{location}</text>
        </g>
      </g>
    </g>
  );
};
