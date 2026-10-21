import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  try {
    const rows = await sql`
      DELETE FROM encuestas
      RETURNING id;
    `;

    return res.status(200).json({
      ok: true,
      eliminados: rows.length
    });
  } catch (error) {
    console.error("Error borrando resultados:", error);
    return res.status(500).json({
      ok: false,
      error: "No se pudieron borrar los resultados"
    });
  }
}
