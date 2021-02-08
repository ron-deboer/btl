import { IUser, ERole } from '../_interfaces/user';
import { ICode, ECodeType } from '../_interfaces/code';
import { IItem } from '../_interfaces/item';

export const FAKE_USERS: IUser[] = [
    {
        id: 1,
        username: 'admin',
        name: 'name-admin',
        email: 'email-admin',
        password: 'admin',
        role: [ERole.Admin, ERole.User],
    },
    {
        id: 2,
        username: 'user',
        name: 'name-user',
        email: 'email-user',
        password: 'user',
        role: [ERole.User],
    },
];

export const FAKE_CODES: ICode[] = [
    // project
    {
        id: 1,
        codeType: ECodeType.Project,
        code: 'PROJ-1',
        description: 'Project 1',
    },
    {
        id: 2,
        codeType: ECodeType.Project,
        code: 'PROJ-2',
        description: 'Project 2',
    },
    // priority
    {
        id: 3,
        codeType: ECodeType.Priority,
        code: 'High',
        description: 'High Priority',
    },
    {
        id: 4,
        codeType: ECodeType.Priority,
        code: 'Medium',
        description: 'Medium Priority',
    },
    {
        id: 5,
        codeType: ECodeType.Priority,
        code: 'Low',
        description: 'Low Priority',
    },
    // status
    {
        id: 6,
        codeType: ECodeType.Status,
        code: 'Open',
        description: 'Open',
    },
    {
        id: 7,
        codeType: ECodeType.Status,
        code: 'Assigned',
        description: 'Assigned',
    },
    {
        id: 8,
        codeType: ECodeType.Status,
        code: 'Closed',
        description: 'Closed',
    },
    // size
    {
        id: 9,
        codeType: ECodeType.Size,
        code: 'Small',
        description: 'Small',
    },
    {
        id: 10,
        codeType: ECodeType.Size,
        code: 'Medium',
        description: 'Medium',
    },
    {
        id: 11,
        codeType: ECodeType.Size,
        code: 'Large',
        description: 'Large',
    },
];

export const FAKE_ITEMS: IItem[] = [
    {
        id: 1,
        projectCode: 'PROJ-1',
        priorityCode: 'High',
        sizeCode: 'Medium',
        statusCode: 'Open',
        createdByUser: 'user',
        createdTimeStamp: new Date(),
        assignedToUser: null,
        assignedTimeStamp: null,
        closedByUser: null,
        closedTimeStamp: null,
        description: 'Test item 1',
        comments: null,
    },
    {
        id: 2,
        projectCode: 'PROJ-1',
        priorityCode: 'Medium',
        sizeCode: 'Small',
        statusCode: 'Open',
        createdByUser: 'admin',
        createdTimeStamp: new Date(),
        assignedToUser: null,
        assignedTimeStamp: null,
        closedByUser: null,
        closedTimeStamp: null,
        description: 'Test item 2',
        comments: null,
    },
];
