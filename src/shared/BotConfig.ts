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
export type LogConfig = {
    textAuditLogChannel: string|null,
    textAuditLogEventTypes: string[],
    errorMessageChannel: string|null
};
export type WelcomeBannerConfig = {
    avatarLeft: number,
    avatarTop: number,
    avatarSize: number,
    textColor: string,
    textLeft: number,
    textWidth: number,
    textCenterTop: number,
    textMinSize: number,
    textMaxSize: number,
    textShadowOffsetLeft: number,
    textShadowOffsetTop: number,
    textShadowColor: string,
    font: string
};
export type WelcomeConfig = {
    banner: WelcomeBannerConfig|null,
    channel: string|null
};

export type BotConfig = {
    xp: XpConfig,
    log: LogConfig
    welcome: WelcomeConfig
};