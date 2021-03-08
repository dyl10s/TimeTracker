export interface ProjectDTO {
    id?: number;
    name: string;
    teacher: any;
    students: any[];
    clientName: string;
    description: string;
    archivedDate: Date;
    createdTime: Date;
    inviteCode: string;
    tags: any[];
}