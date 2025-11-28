import { Request, Response } from "express";
import * as service from "../services/anuncios.service";

export async function criar(req: Request, res: Response) {
  try {
    const result = await service.criar(req.user.id, req.body);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export async function search(req: Request, res: Response) {
  try {
    const { termoBusca } = req.params;
    // console.log(termoBusca)
    if (!termoBusca || typeof termoBusca !== "string") {
      return res.status(400).json({ error: "Parâmetro 'termoBusca' é obrigatório." });
    }
    const result = await service.searchByTitle(termoBusca);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}


export async function listar(req: Request, res: Response) {
  const result = await service.listar();
  res.json(result);
}

export async function visualizar(req: Request, res: Response) {
  const result = await service.visualizar(Number(req.params.id));
  res.json(result);
}

export async function like(req: Request, res: Response) {
  const result = await service.like(Number(req.params.id), req.user.id);
  res.json(result);
}
