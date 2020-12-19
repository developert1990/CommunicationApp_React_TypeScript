import { Document } from 'mongoose';
import { Request } from 'express';
import { Session } from 'inspector';

export interface userDataType {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    profilePic: string;
    password: string;
}

export interface userFromDBType extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    profilePic: string;
    password: string;
    likes: string[];
    token: () => string;
}

export interface CustomSessionType extends Session {
    user: userFromDBType;
}

export interface CustomRequest extends Request {
    session: CustomSessionType & Session & Partial<SessionData>;
    userId?: string;
    name?: string;
}

