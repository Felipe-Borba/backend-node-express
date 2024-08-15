import { User } from "@prisma/client";
import { Request as _Request } from "express";

export type RequestAuthenticated = _Request<{ user?: User; iat?: number; exp?: number }>;