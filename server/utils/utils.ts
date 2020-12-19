import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest, userFromDBType } from '../types';
import { Response } from 'express';

export const generateToken = (user: userFromDBType) => {
    // console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
    return jwt.sign({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,

    }, process.env.JWT_SECRET as string, {
        expiresIn: '24h'
    });
}

export interface decodeType {
    _id: string;
    name: string;
}

// 계정으로 접속 햇을 때 API를 사용하기 위해 verify 하는 middleware.
export const isAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    // console.log('어또라이제이션: ', authorization);
    if (authorization) {
        const token = authorization.slice(5, authorization.length); // Hong XXXXXXX  : Hong하고 띄워쓰기 까지 포함한 5개 글자 이후가 token이라서 이렇게 해줌
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            } else {
                // console.log('decode:  ', decode)
                const { _id, name } = decode as decodeType;
                req.userId = _id;
                req.name = name;
                next();
            }
        });
    } else {
        res.status(401).send({ message: 'No Token' });
    }

}
