import { IUser, ERole } from '../_interfaces/user';
import { ICode, ECodeType } from '../_interfaces/code';
import { IItem } from '../_interfaces/item';

declare var alasql: any;

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
        code: 'BOARD-1',
        description: 'Kanban Board 1',
    },
    {
        id: 2,
        codetype: ECodeType.Board,
        code: 'BOARD-2',
        description: 'Kanban Board 2',
    },
    // project
    {
        id: 3,
        codetype: ECodeType.Project,
        code: 'PROJ-1',
        description: 'Project 1',
    },
    {
        id: 4,
        codetype: ECodeType.Project,
        code: 'PROJ-2',
        description: 'Project 2',
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
        code: 'QA',
        description: 'In QA',
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
        boardcode: 'BOARD-1' as ECodeType.Board,
        projectcode: 'PROJ-1' as ECodeType.Project,
        prioritycode: 'High' as ECodeType.Priority,
        sizecode: 'Medium' as ECodeType.Size,
        statuscode: 'Open' as ECodeType.Status,
        createdbyuser: 'user',
        createdtimestamp: new Date().toISOString(),
        assignedtouser: 'luker',
        assignedtimestamp: new Date().toISOString(),
        closedbyuser: '',
        closedtimestamp: '',
        description: 'Test item 1',
        comments: '',
    },
    {
        id: 2,
        boardcode: 'BOARD-2' as ECodeType.Board,
        projectcode: 'PROJ-2' as ECodeType.Project,
        prioritycode: 'Medium' as ECodeType.Priority,
        sizecode: 'Low' as ECodeType.Size,
        statuscode: 'Open' as ECodeType.Status,
        createdbyuser: 'admin',
        createdtimestamp: new Date().toISOString(),
        assignedtouser: '',
        assignedtimestamp: '',
        closedbyuser: '',
        closedtimestamp: '',
        description: 'Test item 2',
        comments: '',
    },
];

export const FakeDataLoader = () => {
    let loader = new LoadData();
    loader.loadUsers();
    if (loader.newDataSet) {
        loader.loadCodes();
        loader.loadItems();
    }
};

class LoadData {
    newDataSet = false;
    constructor() {}

    loadUsers(): void {
        try {
            alasql(
                'CREATE TABLE db.users (id int, username string, name string, email string, password string, role string, token string)'
            );
        } catch (e) {
            return;
        }
        for (let i = 0; i < FAKE_USERS.length; i++) {
            const { id, username, name, email, password, role } = FAKE_USERS[i];
            alasql(
                `INSERT INTO db.users VALUES (${id}, '${username}', '${name}', '${email}', '${role}', '${password}',  '')`
            );
        }
        this.newDataSet = true;
        const result = alasql(`SELECT * FROM db.users`);
    }

    loadCodes(): void {
        alasql('CREATE TABLE db.code (id int, codetype string, code string, description string)');
        for (let i = 0; i < FAKE_CODES.length; i++) {
            const { id, codetype, code, description } = FAKE_CODES[i];
            alasql(
                `INSERT INTO db.code VALUES (${id}, '${codetype}', '${code}', '${description}')`
            );
        }
        const result = alasql(`SELECT * FROM db.code`);
    }

    loadItems(): void {
        alasql(`CREATE TABLE db.item (
            id int,
            boardcode string,
            projectcode string,
            prioritycode string,
            sizecode string,
            statuscode string,
            createdbyuser string,
            createdtimestamp string,
            assignedtouser string,
            assignedtimestamp string,
            closedbyuser string,
            closedtimestamp string,
            description string,
            comments string
        )`);
        for (let i = 0; i < FAKE_ITEMS.length; i++) {
            const {
                id,
                boardcode,
                projectcode,
                prioritycode,
                sizecode,
                statuscode,
                createdbyuser,
                createdtimestamp,
                assignedtouser,
                assignedtimestamp,
                closedbyuser,
                closedtimestamp,
                description,
                comments,
            } = FAKE_ITEMS[i];
            alasql(`INSERT INTO db.item VALUES (
                ${id},
                '${boardcode}',
                '${projectcode}',
                '${prioritycode}',
                '${sizecode}',
                '${statuscode}',
                '${createdbyuser}',
                '${createdtimestamp}',
                '${assignedtouser}',
                '${assignedtimestamp}',
                '${closedbyuser}',
                '${closedtimestamp}',
                '${description}',
                '${comments}'
            )`);
        }
        const result = alasql(`SELECT * FROM db.item`);
    }
}
