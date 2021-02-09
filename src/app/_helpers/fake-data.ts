import { IUser, ERole } from '../_interfaces/user';
import { ICode, ECodeType } from '../_interfaces/code';
import { IItem } from '../_interfaces/item';

declare var alasql: any;

const FAKE_USERS: IUser[] = [
    {
        id: 1,
        username: 'admin',
        name: 'admin',
        email: 'admin@mail.com',
        password: 'admin',
        role: ERole.Admin,
    },
    {
        id: 2,
        username: 'user',
        name: 'user',
        email: 'user@mail.com',
        password: 'user',
        role: ERole.User,
    },
];

const FAKE_CODES: ICode[] = [
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

const FAKE_ITEMS: IItem[] = [
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

export const FakeDataLoader = () => {
    let loader = new LoadData();
    loader.loadUsers();
    loader.loadCodes();
    loader.loadItems();
};

class LoadData {
    loadUsers(): void {
        alasql(
            'CREATE TABLE users (id int, username string, name string, email string, password string, role string)'
        );
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((json) => {
                for (let i = 0; i < FAKE_USERS.length; i++) {
                    const { id, username, name, email, password, role } = FAKE_USERS[i];
                    alasql(
                        `INSERT INTO users VALUES (${id}, '${username}', '${name}', '${email}', '${password}', '${role}')`
                    );
                }
                json.forEach((x, idx) => {
                    const n = x.name.split(' ');
                    const { id, username, name, email, password, role } = Object.assign(
                        {},
                        {
                            id: idx + 101,
                            username: x.username,
                            name: x.name,
                            email: `${x.username}@mail.com`,
                            password: `${x.username}`,
                            role: 'user',
                        }
                    );
                    alasql(
                        `INSERT INTO users VALUES (${id}, '${username}', '${name}', '${email}', '${password}', '${role}')`
                    );
                });
                const result = alasql(`SELECT * FROM users`);
                console.log('users >>>', result);
            });
    }

    loadCodes(): void {
        alasql('CREATE TABLE code (id int, codeType string, code string, description string)');
        for (let i = 0; i < FAKE_CODES.length; i++) {
            const { id, codeType, code, description } = FAKE_CODES[i];
            alasql(`INSERT INTO code VALUES (${id}, '${codeType}', '${code}', '${description}')`);
        }
        const result = alasql(`SELECT * FROM code`);
    }

    loadItems(): void {
        alasql(`CREATE TABLE item (
            id int,
            projectCode string,
            priorityCode string,
            sizeCode string,
            statusCode string,
            createdByUser string,
            createdTimeStamp Date,
            assignedToUser string,
            assignedTimeStamp Date,
            closedByUser string,
            closedTimeStamp Date,
            description string,
            comments string
        )`);
        for (let i = 0; i < FAKE_ITEMS.length; i++) {
            const {
                id,
                projectCode,
                priorityCode,
                sizeCode,
                statusCode,
                createdByUser,
                createdTimeStamp,
                assignedToUser,
                assignedTimeStamp,
                closedByUser,
                closedTimeStamp,
                description,
                comments,
            } = FAKE_ITEMS[i];
            alasql(`INSERT INTO item VALUES (
                ${id},
                '${projectCode}',
                '${priorityCode}',
                '${sizeCode}',
                '${statusCode}',
                '${createdByUser}',
                '${createdTimeStamp}',
                '${assignedToUser}',
                '${assignedTimeStamp}',
                '${closedByUser}',
                '${closedTimeStamp}',
                '${description}',
                '${comments}'
            )`);
        }
        const result = alasql(`SELECT * FROM item`);
    }
}
