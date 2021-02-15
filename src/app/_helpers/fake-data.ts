import { IUser, ERole } from '../_interfaces/user';
import { ICode, ECodeType } from '../_interfaces/code';
import { IItem } from '../_interfaces/item';

const FAKE_USERS: IUser[] = [
    {
        id: 1,
        username: 'admin',
        name: 'Admin User',
        email: 'admin@mail.com',
        password: 'admin',
        role: ERole.Admin,
    },
    {
        id: 2,
        username: 'user',
        name: 'Regular User',
        email: 'user@mail.com',
        password: 'user',
        role: ERole.User,
    },
    {
        id: 3,
        username: 'luker',
        name: 'Luke Rogers',
        email: 'luker@mail.com',
        password: 'luker',
        role: ERole.User,
    },
    {
        id: 4,
        username: 'gailp',
        name: 'Gail Parsons',
        email: 'gailp@mail.com',
        password: 'gailp',
        role: ERole.User,
    },
    {
        id: 5,
        username: 'patches',
        name: 'Patches the Whippet',
        email: 'patches@mail.com',
        password: 'patches',
        role: ERole.User,
    },
    {
        id: 6,
        username: 'belladb',
        name: 'Bella deBoer',
        email: 'belladb@mail.com',
        password: 'belladb',
        role: ERole.User,
    },
];

const FAKE_CODES: ICode[] = [
    // kanban board
    {
        id: 1,
        codetype: ECodeType.Board,
        code: 'Dev',
        description: 'Dev board',
    },
    {
        id: 2,
        codetype: ECodeType.Board,
        code: 'Bugs',
        description: 'Bugs board',
    },
    // project
    {
        id: 3,
        codetype: ECodeType.Project,
        code: 'WebUi',
        description: 'Web UI Project',
    },
    {
        id: 4,
        codetype: ECodeType.Project,
        code: 'RestApi',
        description: 'Rest API Project',
    },
    // priority
    {
        id: 5,
        codetype: ECodeType.Priority,
        code: 'High',
        description: 'High Priority',
    },
    {
        id: 6,
        codetype: ECodeType.Priority,
        code: 'Medium',
        description: 'Medium Priority',
    },
    {
        id: 7,
        codetype: ECodeType.Priority,
        code: 'Low',
        description: 'Low Priority',
    },
    // status
    {
        id: 8,
        codetype: ECodeType.Status,
        code: 'Open',
        description: 'Open',
    },
    {
        id: 9,
        codetype: ECodeType.Status,
        code: 'Assigned',
        description: 'Assigned',
    },
    {
        id: 10,
        codetype: ECodeType.Status,
        code: 'Review',
        description: 'Review',
    },
    {
        id: 20,
        codetype: ECodeType.Status,
        code: 'Closed',
        description: 'Closed',
    },
    // size
    {
        id: 21,
        codetype: ECodeType.Size,
        code: 'Small',
        description: 'Small',
    },
    {
        id: 22,
        codetype: ECodeType.Size,
        code: 'Medium',
        description: 'Medium',
    },
    {
        id: 23,
        codetype: ECodeType.Size,
        code: 'Large',
        description: 'Large',
    },
];

const FAKE_ITEMS: IItem[] = [
    {
        id: 1,
        title: 'Develop nav bar',
        disporder: 10001,
        boardcode: 'Dev' as ECodeType.Board,
        projectcode: 'WebUi' as ECodeType.Project,
        prioritycode: 'High' as ECodeType.Priority,
        sizecode: 'Medium' as ECodeType.Size,
        statuscode: 'Open' as ECodeType.Status,
        createdbyuser: 'user',
        createdtimestamp: new Date().toISOString(),
        assignedtouser: 'luker',
        assignedtimestamp: new Date().toISOString(),
        closedbyuser: '',
        closedtimestamp: '',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
        comments: '',
    },
    {
        id: 2,
        title: 'Develop CRUD for codes',
        disporder: 10002,
        boardcode: 'Dev' as ECodeType.Board,
        projectcode: 'WebUi' as ECodeType.Project,
        prioritycode: 'Medium' as ECodeType.Priority,
        sizecode: 'Small' as ECodeType.Size,
        statuscode: 'Open' as ECodeType.Status,
        createdbyuser: 'admin',
        createdtimestamp: new Date().toISOString(),
        assignedtouser: '',
        assignedtimestamp: '',
        closedbyuser: '',
        closedtimestamp: '',
        description:
            'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. ',
        comments: '',
    },
    {
        id: 3,
        title: 'Develop CRUD for users',
        disporder: 10003,
        boardcode: 'Dev' as ECodeType.Board,
        projectcode: 'WebUi' as ECodeType.Project,
        prioritycode: 'Medium' as ECodeType.Priority,
        sizecode: 'Small' as ECodeType.Size,
        statuscode: 'Open' as ECodeType.Status,
        createdbyuser: 'admin',
        createdtimestamp: new Date().toISOString(),
        assignedtouser: '',
        assignedtimestamp: '',
        closedbyuser: '',
        closedtimestamp: '',
        description:
            'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. ',
        comments: '',
    },
    {
        id: 4,
        title: 'Develop CRUD for items',
        disporder: 10004,
        boardcode: 'Dev' as ECodeType.Board,
        projectcode: 'WebUi' as ECodeType.Project,
        prioritycode: 'Medium' as ECodeType.Priority,
        sizecode: 'Small' as ECodeType.Size,
        statuscode: 'Open' as ECodeType.Status,
        createdbyuser: 'admin',
        createdtimestamp: new Date().toISOString(),
        assignedtouser: '',
        assignedtimestamp: '',
        closedbyuser: '',
        closedtimestamp: '',
        description:
            'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. ',
        comments: '',
    },
    {
        id: 5,
        title: 'Develop kanban board',
        disporder: 10005,
        boardcode: 'Dev' as ECodeType.Board,
        projectcode: 'WebUi' as ECodeType.Project,
        prioritycode: 'Medium' as ECodeType.Priority,
        sizecode: 'Small' as ECodeType.Size,
        statuscode: 'Open' as ECodeType.Status,
        createdbyuser: 'admin',
        createdtimestamp: new Date().toISOString(),
        assignedtouser: '',
        assignedtimestamp: '',
        closedbyuser: '',
        closedtimestamp: '',
        description:
            'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. ',
        comments: '',
    },
    {
        id: 6,
        title: 'Develop ui framework',
        disporder: 10006,
        boardcode: 'Dev' as ECodeType.Board,
        projectcode: 'WebUi' as ECodeType.Project,
        prioritycode: 'Medium' as ECodeType.Priority,
        sizecode: 'Small' as ECodeType.Size,
        statuscode: 'Assigned' as ECodeType.Status,
        createdbyuser: 'admin',
        createdtimestamp: new Date().toISOString(),
        assignedtouser: 'user',
        assignedtimestamp: new Date().toISOString(),
        closedbyuser: '',
        closedtimestamp: '',
        description:
            'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. ',
        comments: '',
    },
    {
        id: 7,
        title: 'Develop db schema',
        disporder: 10007,
        boardcode: 'Dev' as ECodeType.Board,
        projectcode: 'WebUi' as ECodeType.Project,
        prioritycode: 'Medium' as ECodeType.Priority,
        sizecode: 'Small' as ECodeType.Size,
        statuscode: 'Closed' as ECodeType.Status,
        createdbyuser: 'admin',
        createdtimestamp: new Date().toISOString(),
        assignedtouser: 'user',
        assignedtimestamp: new Date().toISOString(),
        closedbyuser: 'user',
        closedtimestamp: new Date().toISOString(),
        description:
            'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. ',
        comments: '',
    },
    {
        id: 8,
        title: 'Develop web api',
        disporder: 10008,
        boardcode: 'Dev' as ECodeType.Board,
        projectcode: 'WebUi' as ECodeType.Project,
        prioritycode: 'Medium' as ECodeType.Priority,
        sizecode: 'Small' as ECodeType.Size,
        statuscode: 'Review' as ECodeType.Status,
        createdbyuser: 'admin',
        createdtimestamp: new Date().toISOString(),
        assignedtouser: 'user',
        assignedtimestamp: new Date().toISOString(),
        closedbyuser: '',
        closedtimestamp: '',
        description:
            'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. ',
        comments: '',
    },
];

export const FakeDataLoader = () => {
    localStorage.removeItem('demoDb');
    let str = JSON.stringify({
        users: FAKE_USERS,
        code: FAKE_CODES,
        item: FAKE_ITEMS,
    });
    localStorage.setItem('demoDb', str);
};

/**
 * db object and core functions
 */
export let db = null;
export const fetchDb = () => {
    db = JSON.parse(localStorage.getItem('demoDb'));
};
export const persistDb = () => {
    localStorage.setItem('demoDb', JSON.stringify(db));
};
