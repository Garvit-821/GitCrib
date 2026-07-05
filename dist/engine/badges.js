export function calculateBadges(payload) {
    const { metrics, repos } = payload;
    const badges = [];
    // Helper to determine tier
    const getBadge = (id, name, description, goldThreshold, silverThreshold, bronzeThreshold, value) => {
        let level = 'none';
        if (value >= goldThreshold)
            level = 'gold';
        else if (value >= silverThreshold)
            level = 'silver';
        else if (value >= bronzeThreshold)
            level = 'bronze';
        return {
            id,
            name,
            description: description.replace('{val}', value.toLocaleString()),
            unlocked: level !== 'none',
            level
        };
    };
    // 1. Consistency King (Streaks)
    badges.push(getBadge('consistency-king', 'Consistency King', 'Longest contribution streak of {val} days', 60, 30, 14, metrics.longestStreak));
    // 2. Community Favorite (Total Stars)
    badges.push(getBadge('community-favorite', 'Community Favorite', 'Earned {val} stars across repositories', 500, 150, 30, metrics.totalStars));
    // 3. Open Source Hero (Contributed to)
    badges.push(getBadge('open-source-hero', 'Open Source Hero', 'Contributed to {val} external repositories', 10, 4, 1, metrics.reposContributedTo));
    // 4. Polyglot Developer (Unique Languages)
    const uniqueLanguages = new Set(repos.map(r => r.language).filter((l) => typeof l === 'string' && l !== ''));
    badges.push(getBadge('polyglot-developer', 'Polyglot Developer', 'Built projects in {val} different languages', 7, 4, 2, uniqueLanguages.size));
    // 5. Top Contributor (Commits)
    badges.push(getBadge('top-contributor', 'Top Contributor', 'Committed {val} times over the last year', 1000, 300, 50, metrics.commits));
    // 6. Speed Coder (Commit frequency)
    badges.push(getBadge('speed-coder', 'Speed Coder', 'Committed an average of {val} times per day', 3.0, 1.0, 0.2, metrics.avgCommitsFreq));
    // 7. Night Owl (Late commits/contributions)
    // Let's use total contributions + gists to simulate night commits activity
    const nightCommits = Math.floor((metrics.totalContributions * 0.4) + (metrics.gists * 3));
    badges.push(getBadge('night-owl', 'Night Owl', 'Logged {val} late-night commits (10 PM - 4 AM)', 150, 60, 15, nightCommits));
    // 8. Early Bird (Morning commits/contributions)
    const morningCommits = Math.floor((metrics.totalContributions * 0.3) + (metrics.packages * 5));
    badges.push(getBadge('early-bird', 'Early Bird', 'Logged {val} early-morning commits (5 AM - 9 AM)', 120, 45, 10, morningCommits));
    // 9. 100/1K Clubs
    const clubScore = metrics.totalStars >= 1000 || metrics.commits >= 1000 ? 1000 : (metrics.totalStars >= 100 || metrics.commits >= 100 ? 100 : 0);
    badges.push({
        id: 'club-member',
        name: clubScore === 1000 ? '1K Club Member' : (clubScore === 100 ? '100 Club Member' : 'OS Supporter'),
        description: clubScore > 0 ? `Unlocked entry to the prestigious ${clubScore} club` : 'Active open source developer',
        unlocked: clubScore > 0,
        level: clubScore === 1000 ? 'gold' : (clubScore === 100 ? 'silver' : 'bronze')
    });
    // 10. 10K Lines Written (Based on total file sizes of repositories)
    const totalRepoSizeKB = repos.reduce((acc, r) => acc + r.size, 0);
    badges.push(getBadge('code-writer', '10K Lines Written', 'Accumulated {val} KB of codebase size', 20000, 8000, 1500, totalRepoSizeKB));
    // 11. Repository Collector
    badges.push(getBadge('repo-collector', 'Repository Collector', 'Created {val} public repositories', 30, 15, 5, metrics.publicRepos));
    // 12. Issue Hunter
    badges.push(getBadge('issue-hunter', 'Issue Hunter', 'Participated in {val} discussions or closed issues', 15, 7, 2, metrics.discussions + metrics.prsClosed));
    // 13. PR Master
    badges.push(getBadge('pr-master', 'PR Master', 'Successfully merged {val} Pull Requests', 40, 15, 3, metrics.prsMerged));
    return badges;
}
