import jwt from 'jsonwebtoken';

const secret = `${process.env.JWT_SECRET}`;

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            userName:user.userName,
            email: user.email,
            role: user.role
        },
        secret, { expiresIn: '24h' }); 
};



export const verifyToken = (token) => {
    return jwt.verify(token, secret);
};