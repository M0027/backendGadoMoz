import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const result = await authService.register(req.body);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}
