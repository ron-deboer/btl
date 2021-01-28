export enum ECodeType {
    Priority = 'priority',
    Size = 'size',
    Status = 'status',
    Stage = 'stage',
    Column = 'column',
    Tag = 'tag',
    Team = 'team',
}

export interface ICode {
    id: number;
    codeType: ECodeType;
    code: string;
    description: string;
}
