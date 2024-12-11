import { verifyToken } from "../utils/jwt.js";


const isAuthenticated = (request, response, next) => {
    try {
      const token = request.cookies.accessToken;
      if (!token) throw new Error('Token not provided');
  
      const decoded = verifyToken(token);
      request.userData = decoded;
      next();
    } catch (error) {
      return response.status(401).json({
        message: 'Authentication failed',
      });
    }
  };

  const isAuthorizedUser = (roles) => {
    return (request, response, next) => {
      const userRole = request.userData.role;
      console.log(userRole)
      if (!roles.includes(userRole)) {
        return response.status(403).json({ error: 'Forbidden' });
      }

      next();
    };
  };
  
  export {isAuthorizedUser, isAuthenticated};