import { pool } from "../db/mysql";

export async function criar(userId: number, dados: any) {
  if (isNaN(userId)) {
    throw new Error("ID do usuário inválido.");
  }
  const { titulo, localizacao, descricao, preco,  categoria , imagem} = dados;

  await pool.query(
    "INSERT INTO anuncios (user_id, titulo,localizacao, descricao, preco, categoria, imagem) VALUES (?,?,?,?,?,?)",
    [userId, titulo, localizacao, descricao, preco, categoria, imagem]
  );

  return { message: "Anúncio criado" };
}

export async function listar() {
  const [rows] = await pool.query(
    "SELECT id, titulo, preco, categoria, imagem, likes, visualizacoes, created_at FROM anuncios ORDER BY id DESC"
  );
  return rows;
}

export async function searchByTitle(title: string) {

  console.log('anucio service: title',title)
  // Divide o title em palavras e procura anúncios cujo título tenha pelo menos uma palavra igual
  const words = title
    .split(/\s+/)
    .map(word => word.trim())
    .filter(word => word.length > 0);

  if (words.length === 0) {
    return [];
  }

  const conditions = words.map(() => "titulo REGEXP ?").join(" OR ");
  // REGEXP para buscar palavra exata (case-insensitive)
  const regexWords = words.map(w => `(^|[^a-zA-Z0-9])${w}([^a-zA-Z0-9]|$)`);
  const query = `
    SELECT id, titulo, preco, categoria, imagem, likes, visualizacoes, created_at 
    FROM anuncios 
    WHERE ${conditions}
    ORDER BY id DESC
  `;
  const [rows]: any = await pool.query(query, regexWords);
  return rows;
}



export async function visualizar(id: number) {
  if (isNaN(id)) {
    throw new Error("ID do anúncio inválido.");
  }
  await pool.query(
    "UPDATE anuncios SET visualizacoes = visualizacoes + 1 WHERE id = ?",
    [id]
  );

  const [rows]: any = await pool.query(
    "SELECT * FROM anuncios WHERE id = ?",
    [id]
  );

  return rows[0];
}

export async function like(anuncioId: number, usuarioId: number) {
  if (isNaN(anuncioId) || isNaN(usuarioId)) {
    throw new Error("ID do anúncio ou usuário inválido.");
  
  // Verifica se o usuário já deu like neste anúncio
  const [existingLikes]: any = await pool.query(
    "SELECT id FROM likes WHERE usuario_id = ? AND anuncio_id = ?",
    [usuarioId, anuncioId]
  );

  if (existingLikes.length > 0) {
    await pool.query(
      "UPDATE anuncios SET likes = likes - 1 WHERE id = ?",
      [anuncioId]
    );

    await pool.query(
      "DELETE FROM likes WHERE usuario_id = ? AND anuncio_id = ?",
      [usuarioId, anuncioId]
    );

    // Usuário já deu like
    return { alreadyLiked: true, message: "Usuário já curtiu este anúncio." };
  }

  // Registra o like
  await pool.query(
    "INSERT INTO likes (usuario_id, anuncio_id, created_at) VALUES (?, ?, NOW())",
    [usuarioId, anuncioId]
  );
  // Atualiza o contador de likes no anúncio
  await pool.query(
    "UPDATE anuncios SET likes = likes + 1 WHERE id = ?",
    [anuncioId]
  );

  return { alreadyLiked: false, message: "Like registrado" };
}
}

