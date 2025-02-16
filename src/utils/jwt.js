import jwt from 'jsonwebtoken';

const secret = `${process.env.JWT_SECRET}`;

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username:user.username,
            email: user.email,
            role: user.role
        },
        secret, { expiresIn: '24h' }); 
};



export const verifyToken = (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid token');
    }
};