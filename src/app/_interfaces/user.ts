export enum ERole {
    User = 'user',
    Admin = 'admin',
}

export interface IUser {
    id: number;
    username: string;
    name: string;
    email: string;
    role: ERole;
    password: string;
    token?: string;
}
