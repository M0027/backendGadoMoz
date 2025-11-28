import { pool } from "../db/mysql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register({ nome, telefone, senha }: any) {
  const hash = await bcrypt.hash(senha, 10);

  const [exists]: any = await pool.query(
    "SELECT id FROM usuarios WHERE telefone = ?",
    [telefone]
  );

  if (exists.length > 0) throw new Error("Telefone já cadastrado");

  await pool.query(
    "INSERT INTO usuarios (nome, telefone, senha) VALUES (?, ?, ?)",
    [nome, telefone, hash]
  );

  return { message: "Usuário registrado com sucesso" };
}

export async function login({ telefone, senha }: any) {
  const [rows]: any = await pool.query(
    "SELECT * FROM usuarios WHERE telefone = ?",
    [telefone]
  );

  if (rows.length === 0) throw new Error("Usuário não encontrado");

  const user = rows[0];

  const match = await bcrypt.compare(senha, user.senha);
  if (!match) throw new Error("Senha incorreta");

  const token = jwt.sign(
    { id: user.id, telefone: user.telefone },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { token, user: { id: user.id, nome: user.nome } };
}
