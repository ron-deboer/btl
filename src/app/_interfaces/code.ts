export enum ECodeType {
    Board = 'BOARD',
    Project = 'PROJECT',
    Priority = 'PRIORITY',
    Size = 'SIZE',
    Status = 'STATUS',
    Stage = 'STAGE',
    Column = 'COLUMN',
    Tag = 'TAG',
    Team = 'TEAM',
}

export interface ICode {
    id: number;
    codetype: ECodeType;
    code: string;
    description: string;
}
