import { Document } from 'mongoose';
import { Request } from 'express';
import { Session } from 'inspector';



export interface userDataType {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    profilePic: string;
    coverPic: string;
    password: string;
    following: string[];
    followers: string[];
}

export interface userFromDBType extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    profilePic: string;
    coverPic: string;
    password: string;
    likes: string[];
    following: string[];
    followers: string[];
    token: () => string;
}


declare global {
    namespace Express {
        interface Request {
            user: userFromDBType
        }
    }
}

export interface CustomSessionType extends Session {
    user: userFromDBType;
}

export interface CustomRequest extends Request {
    session: CustomSessionType & Session & Partial<SessionData>;
    userId?: string;
    name?: string;
}



// declare module 'express-session' {
//     interface SessionData extends Session {
//         user: userFromDBType;
//     }
// }