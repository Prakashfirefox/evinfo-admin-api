// src/api/middlewares/auth.ts
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { decrypt } from "../utils/crypto.util"; // 🔹 Make sure you have a decrypt function
import authService from "../services/auth.service";
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret_key";

const authenticateJWT = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      //Decrypt payload
      const decryptedData = decrypt(decoded.data); // returns JSON string
      const userPayload = JSON.parse(decryptedData);
      console.log("JWT token Payload :",userPayload);
      // Now you can access user_id and email
      const { user_id } = userPayload;
      //Fetch user details
      const usersDetails: any = await authService.getUserById(user_id);
      console.log("Authenticated User Details :",usersDetails);
      if (usersDetails && usersDetails.id) {
        req.authUsersDetails = usersDetails;
        next();
      } else {
        return res.status(401).json({ message: "User not found" });
      }
    } catch (error: any) {
      console.error("Error decrypting token:", error.message);
      return res.status(400).json({ message: "Invalid token payload" });
    }
  });
};

export default authenticateJWT;
