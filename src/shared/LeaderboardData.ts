export type LeaderboardMeta = {
    serverName: string,
    serverIconUrl: string,
    xpMultiplier: number,
    xpRoles: {level: number, roleName: string, roleColor: number}[]
};

export type LeaderboardEntry = {
    userName: string,
    userImageUrl: string,
    messages: number,
    xp: number,
    level: number,
    progress: number
}

export type LeaderboardData = {
    meta?: LeaderboardMeta,
    leaderboard: LeaderboardEntry[]
};