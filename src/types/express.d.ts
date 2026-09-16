import { User } from "../entities/User";

// src/types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: {
        id : string,
        role : string
      }; // Appends 'user' as an optional property to Request
    }
  }
}
