import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
 
const app = express();
 
// Secret key for signing the JWT (in a real app, store this securely)
const secretKey = process.env.SECRET_KEY ;
if (!secretKey) {
    throw new Error("SECRET_KEY is not defined. Please set it in your environment variables.");
  }
// Define a custom type for the request that includes the user property
interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}
 
// Middleware to verify JWT
function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void {
  const token = req.headers["authorization"];
 
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
 
  // Remove "Bearer " if the token is provided in "Bearer <token>" format
  const tokenWithoutBearer = token.replace("Bearer ", "");
  jwt.verify(tokenWithoutBearer, secretKey as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
}
 
// Example protected route
app.get(
  "/protected",
  verifyToken,
  (req: AuthenticatedRequest, res: Response) => {
    // If JWT is valid, return the protected content
    res
      .status(200)
      .json({ message: "Welcome to the protected page!", user: req.user });
  }
);
 
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});