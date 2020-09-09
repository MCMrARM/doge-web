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
    textShadowBlur: number,
    textShadowColor: string,
    font: string
};
export type WelcomeConfig = {
    banner: WelcomeBannerConfig|null,
    channel: string|null
};
export type PermissionGroup = {
    id?: string,
    name?: string,
    allowedRoles: string[],
    disallowedRoles: string[],
    allowedChannels: string[],
    disallowedChannels: string[]
};
export type PermissionConfig = {
    default: {
        admin: PermissionGroup,
        mod: PermissionGroup,
        misc: PermissionGroup
    },
    custom: PermissionGroup[],
    commands: {[command: string]: string}
};
export type ModRoleConfig = {
    id: string,
    displayText: string,
    addRoles: string[],
    removeRoles: string[],
    assignCommand: string[],
    removeCommand: string[]
};
export type RoleConfig = {
    stickyRoles: string[],
    modroles: ModRoleConfig[]
}

export type BotConfig = {
    xp: XpConfig,
    log: LogConfig,
    welcome: WelcomeConfig,
    permission: PermissionConfig,
    role: RoleConfig
};