import { IUser, ERole } from '../_interfaces/user';
import { ICode, ECodeType } from '../_interfaces/code';

export const FAKE_USERS: IUser[] = [
    {
        id: 1,
        username: 'admin',
        password: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        roles: [ERole.Admin, ERole.User],
    },
    {
        id: 2,
        username: 'user',
        password: 'user',
        firstName: 'Normal',
        lastName: 'User',
        roles: [ERole.User],
    },
];

export const FAKE_CODES: ICode[] = [
    {
        id: 1,
        codeType: ECodeType.Priority,
        code: 'High',
        description: 'High Priority',
    },
    {
        id: 2,
        codeType: ECodeType.Priority,
        code: 'Medium',
        description: 'Medium Priority',
    },
    {
        id: 2,
        codeType: ECodeType.Priority,
        code: 'Low',
        description: 'Low Priority',
    },
];
