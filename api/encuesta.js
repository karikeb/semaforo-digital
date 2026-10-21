import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const allowedResults = new Set(["Verde", "Amarillo", "Rojo"]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  try {
    const {
      horas_pantalla,
      trabajo_estudio,
      pausas,
      usa_lentes,
      alteracion_sueno,
      puntaje,
      resultado
    } = req.body || {};

    if (
      !horas_pantalla ||
      !trabajo_estudio ||
      !pausas ||
      !usa_lentes ||
      !alteracion_sueno ||
      !Number.isInteger(puntaje) ||
      !allowedResults.has(resultado)
    ) {
      return res.status(400).json({
        ok: false,
        error: "Datos de encuesta incompletos o inválidos"
      });
    }

    const rows = await sql`
      INSERT INTO encuestas (
        horas_pantalla,
        trabajo_estudio,
        pausas,
        usa_lentes,
        alteracion_sueno,
        puntaje,
        resultado
      )
      VALUES (
        ${horas_pantalla},
        ${trabajo_estudio},
        ${pausas},
        ${usa_lentes},
        ${alteracion_sueno},
        ${puntaje},
        ${resultado}
      )
      RETURNING id, fecha, resultado;
    `;

    return res.status(201).json({
      ok: true,
      encuesta: rows[0]
    });
  } catch (error) {
    console.error("Error guardando encuesta:", error);
    return res.status(500).json({
      ok: false,
      error: "No se pudo guardar la encuesta"
    });
  }
}
