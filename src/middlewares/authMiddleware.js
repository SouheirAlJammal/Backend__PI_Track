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

const isAdmin = (req, res, next) => {
    if (req.userData && req.userData.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden!" });
    }
  };
  
  
  export {isAdmin, isAuthenticated};