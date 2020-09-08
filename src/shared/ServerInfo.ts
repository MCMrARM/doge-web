export type ChannelInfo = {
    id: string,
    name: string
};
export type RoleInfo = {
    id: string,
    name: string,
    color: number,
    position: number
};

export type ServerInfo = {
    id: string,
    name: string,
    iconUrl: string,
    channels: {[id: string]: ChannelInfo},
    roles: {[id: string]: RoleInfo},
    globalCommands: [string, string][]
};