import { ICode, ECodeType } from '../_interfaces/code';
export interface IItem {
    id: number;
    projectCode: string;
    priorityCode: string;
    sizeCode: string;
    statusCode: string;
    createdByUser: string;
    createdTimeStamp: Date;
    assignedToUser: string;
    assignedTimeStamp: Date;
    closedByUser: string;
    closedTimeStamp: Date;
    description: string;
    comments: string;
}
