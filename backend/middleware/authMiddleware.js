import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer Token

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Attach user ID to request object
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};
