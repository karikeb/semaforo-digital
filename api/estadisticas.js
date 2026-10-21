import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  try {
    const rows = await sql`
      SELECT resultado, COUNT(*)::int AS cantidad
      FROM encuestas
      GROUP BY resultado;
    `;

    const stats = {
      Verde: 0,
      Amarillo: 0,
      Rojo: 0,
      total: 0
    };

    for (const row of rows) {
      if (Object.prototype.hasOwnProperty.call(stats, row.resultado)) {
        stats[row.resultado] = Number(row.cantidad);
      }
    }

    stats.total = stats.Verde + stats.Amarillo + stats.Rojo;

    return res.status(200).json({
      ok: true,
      estadisticas: stats
    });
  } catch (error) {
    console.error("Error leyendo estadísticas:", error);
    return res.status(500).json({
      ok: false,
      error: "No se pudieron obtener las estadísticas"
    });
  }
}
