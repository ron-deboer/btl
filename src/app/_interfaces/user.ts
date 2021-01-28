export enum ERole {
    User = 'user',
    Admin = 'admin',
}

export interface IUser {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: ERole[];
    token?: string;
}
