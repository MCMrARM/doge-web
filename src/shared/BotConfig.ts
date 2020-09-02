export type XpConfig = {
    enabled: boolean,
    multiplier: number,
    disabledChannels: string[],
    disabledRoles: string[],
    levelUpAnnouncementMode: "channel"|"direct"|null,
    levelUpChannel: string|null,
    levelUpMessages: string[],
    roles: [number, string, string|null][]
};

export type BotConfig = {
    xp: XpConfig
};