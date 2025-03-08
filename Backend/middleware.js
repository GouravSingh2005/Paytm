const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

  

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];
  

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        

        if (decoded.user_id) { 
            req.user_id = decoded.user_id; 
            next();
        } else {
            return res.status(403).json({ message: "Invalid token" });
        }
    } catch (error) {
        
        return res.status(403).json({ message: "Token verification failed" });
    }
};

module.exports = { authMiddleware };
