export interface UserDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    inviteCode?: string;
    discordLink?: string;
    role?: string;
    id?: number;
}
