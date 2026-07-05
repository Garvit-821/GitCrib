import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Fragment } from 'preact';
import { ProfileHeader, OverviewList, GradeCard, ContributionsCard, StreakCard, ContributionGraph, LanguagesDonut, ReposList, ActivitySummary, CalendarHeatmap, PushBarChart, SocialStrip, FooterBlocks } from './DataBlocks.js';
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
export const Poster = ({ username = 'Garvit-821', name = 'GARVIT PRAKASH', avatarUrl = 'https://avatars.githubusercontent.com/u/77626922?v=4', bio = 'Building the future, one commit at a time.', joinedDate = 'Jan 19, 2021', followers = 18, following = 12, stars = 68, commits = 130, prs = 5, issues = 0, contributedTo = 0, devClass = 'Senior Core Engineer', grade = 'B-', totalContributions = 251, currentStreak = 10, longestStreak = 10, streakDateRange = 'Jun 25 - Jul 4', longestStreakDateRange = 'Jan 25 - Jul 4', contributionsHistory = [2, 5, 3, 8, 2, 4, 12, 18, 5, 9, 14, 8, 12, 5, 7], languages = [
    { name: 'JavaScript', percentage: 45.1, color: '#f7df1e' },
    { name: 'HTML', percentage: 23.7, color: '#e34f26' },
    { name: 'CSS', percentage: 12.4, color: '#1572b6' },
    { name: 'Python', percentage: 8.6, color: '#3776ab' },
    { name: 'Other', percentage: 10.2, color: '#666666' }
], repos = [
    { name: 'gpdev.in', stars: 23 },
    { name: 'ai-document-analyzer', stars: 12 },
    { name: 'hackhub', stars: 8 },
    { name: 'gpGenie', stars: 7 },
    { name: 'obsidian-chatroom', stars: 6 }
], totalReposCount = 20, activityPRs = 5, activityIssuesOpened = 0, activityIssuesClosed = 0, activityReposContributed = 0, activityReposOwned = 15, activityTotalWatchers = 23, commitData = Array.from({ length: 371 }, (_, i) => (i % 7 === 0 || i % 13 === 0) ? Math.floor(Math.random() * 8) : 0), pushHistory = [10, 20, 15, 20, 12, 16, 25, 20, 14, 18, 38, 75], reviews = 2, starsGiven = 12, gists = 3, orgs = '-', projects = 4, packages = 1, aboutText = 'Full Stack Developer | AI & Automation Builder of modern web apps, AI tools, and productivity solutions.', portfolioUrl = 'https://dev.gpdev.in', websiteUrl = 'https://gpdev.in', email = 'contact@gpdev.in', location = 'Delhi, India', timestamp = '2026-07-06 00:00:00 UTC', theme = 'blueprint', layout = 'poster' }) => {
    const colors = themeMap[theme] || themeMap.blueprint;
    const width = 1200;
    const height = layout === 'banner' ? 400 : 1600;
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${width} ${height}`, width: "100%", height: "100%", style: { background: colors.bg, fontFamily: '"JetBrains Mono", monospace' }, children: [_jsxs("defs", { children: [_jsx("style", { dangerouslySetInnerHTML: { __html: `
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&amp;display=swap');

          /* Heatmap node pulsing animation */
          @keyframes nodePulse {
            0%, 100% { fill-opacity: 0.45; }
            50% { fill-opacity: 1; }
          }
          .data-node {
            animation: nodePulse 3s infinite ease-in-out;
          }
        ` } }), _jsxs("linearGradient", { id: "chart-area-gradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: colors.stroke, stopOpacity: "0.35" }), _jsx("stop", { offset: "100%", stopColor: colors.stroke, stopOpacity: "0" })] }), _jsxs("pattern", { id: "poster-grid", width: "40", height: "40", patternUnits: "userSpaceOnUse", children: [_jsx("rect", { width: "40", height: "40", fill: "none" }), _jsx("path", { d: "M 40 0 L 0 0 0 40", fill: "none", stroke: colors.grid, strokeWidth: "0.5", strokeOpacity: "0.04" })] })] }), _jsx("circle", { cx: "0", cy: "0", r: "0", class: "radar-beam", fill: "none" }), _jsx("rect", { width: width, height: height, fill: "url(#poster-grid)" }), _jsx("rect", { x: "15", y: "15", width: width - 30, height: height - 30, fill: "none", stroke: colors.stroke, strokeWidth: "0.5", strokeOpacity: "0.1" }), _jsx("rect", { x: "20", y: "20", width: width - 40, height: height - 40, fill: "none", stroke: colors.stroke, strokeWidth: "1", strokeOpacity: "0.2" }), layout === 'banner' ? (_jsxs(Fragment, { children: [_jsx("g", { transform: "translate(40, 40)", children: _jsx(ProfileHeader, { username: username, name: name, avatarUrl: avatarUrl, bio: bio, joinedDate: joinedDate, devClass: devClass, colors: colors, width: 700, height: 130 }) }), _jsx("g", { transform: "translate(820, 40)", children: _jsx(LanguagesDonut, { languages: languages.slice(0, 3), colors: colors }) }), _jsxs("g", { transform: "translate(40, 355)", children: [_jsx("line", { x1: "0", y1: "0", x2: "1120", y2: "0", stroke: colors.grid, strokeWidth: "0.5", strokeOpacity: "0.4" }), _jsx("text", { x: "0", y: "20", fill: "#666666", fontSize: "10", fontFamily: "monospace", children: "DEVELOPED BY GITHUB.COM/GARVIT-821 // LAUNCHED 2026" }), _jsxs("text", { x: "1120", y: "20", fill: "#666666", fontSize: "10", fontFamily: "monospace", textAnchor: "end", children: ["TIMESTAMP: ", timestamp] })] })] })) : (_jsxs(Fragment, { children: [_jsx("g", { transform: "translate(40, 55)", children: _jsx(ProfileHeader, { username: username, name: name, avatarUrl: avatarUrl, bio: bio, joinedDate: joinedDate, devClass: devClass, colors: colors }) }), _jsx("g", { transform: "translate(40, 205)", children: _jsx(OverviewList, { stars: stars, commits: commits, prs: prs, issues: issues, contributedTo: contributedTo, followers: followers, following: following, colors: colors }) }), _jsx("g", { transform: "translate(400, 205)", children: _jsx(GradeCard, { grade: grade, colors: colors }) }), _jsx("g", { transform: "translate(590, 205)", children: _jsx(ContributionsCard, { total: totalContributions, dateRange: joinedDate + " - Present", colors: colors }) }), _jsx("g", { transform: "translate(780, 205)", children: _jsx(StreakCard, { title: "Current Streak", value: currentStreak, dateRange: streakDateRange, isCurrent: true, colors: colors }) }), _jsx("g", { transform: "translate(970, 205)", children: _jsx(StreakCard, { title: "Longest Streak", value: longestStreak, dateRange: longestStreakDateRange, isCurrent: false, colors: colors }) }), _jsx("g", { transform: "translate(400, 385)", children: _jsx(ContributionGraph, { history: contributionsHistory, colors: colors }) }), _jsx("g", { transform: "translate(40, 675)", children: _jsx(LanguagesDonut, { languages: languages, colors: colors }) }), _jsx("g", { transform: "translate(400, 675)", children: _jsx(ReposList, { repos: repos, totalReposCount: totalReposCount, colors: colors }) }), _jsx("g", { transform: "translate(760, 675)", children: _jsx(ActivitySummary, { pullRequests: activityPRs, issuesOpened: activityIssuesOpened, issuesClosed: activityIssuesClosed, reposContributed: activityReposContributed, reposOwned: activityReposOwned, totalWatchers: activityTotalWatchers, colors: colors }) }), _jsx("g", { transform: "translate(40, 1015)", children: _jsx(CalendarHeatmap, { commitData: commitData, colors: colors }) }), _jsx("g", { transform: "translate(610, 1015)", children: _jsx(PushBarChart, { pushHistory: pushHistory, colors: colors }) }), _jsx("g", { transform: "translate(40, 1255)", children: _jsx(SocialStrip, { reviews: reviews, starsGiven: starsGiven, gists: gists, orgs: orgs, projects: projects, packages: packages, colors: colors }) }), _jsx("g", { transform: "translate(40, 1365)", children: _jsx(FooterBlocks, { aboutText: aboutText, portfolioUrl: portfolioUrl, websiteUrl: websiteUrl, email: email, location: location, colors: colors }) }), _jsxs("g", { transform: "translate(40, 1545)", children: [_jsx("line", { x1: "0", y1: "0", x2: "1120", y2: "0", stroke: colors.grid, strokeWidth: "0.5", strokeOpacity: "0.4" }), _jsxs("text", { x: "0", y: "24", fill: "#666666", fontSize: "11", fontFamily: "monospace", children: ["Last Updated: ", timestamp] }), _jsxs("text", { x: "1120", y: "24", fill: "#a8a8a8", fontSize: "11", fontFamily: "sans-serif", textAnchor: "end", children: ["Made with ", _jsx("tspan", { fill: colors.stroke, children: "\uD83D\uDC9C" }), " by Garvit Prakash"] })] })] }))] }));
};
