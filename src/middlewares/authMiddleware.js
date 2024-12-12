import { verifyToken } from "../utils/jwt.js";


const isAuthenticated = (request, response, next) => {
    try {
      const token = request.cookies?.access_token;
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




  // export function authenticate(req, res, next) {
  //   const token = req.cookies?.access_token;
  //   if (token) {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     req.user = decoded;
  //     return next();
  //   } else {
  //     res.status(400).json({ errot: "No token found" });
  //   }
  // }
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