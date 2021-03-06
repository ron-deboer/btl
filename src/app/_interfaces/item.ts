﻿import { ICode, ECodeType } from '../_interfaces/code';
export interface IItem {
    id: number;
    title: string;
    disporder: number;
    boardcode: ECodeType.Board;
    projectcode: ECodeType.Project;
    prioritycode: ECodeType.Priority;
    sizecode: ECodeType.Size;
    statuscode: ECodeType.Status;
    createdbyuser: string;
    createdtimestamp: string;
    assignedtouser: string;
    assignedtimestamp: string;
    closedbyuser: string;
    closedtimestamp: string;
    duedate: string;
    description: string;
    comments: string;
}
