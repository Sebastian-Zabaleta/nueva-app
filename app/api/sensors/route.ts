import { sql } from "@vercel/postgres";

export async function GET() {
    try {
        // Obtener todos los datos de la tabla humedad
        const { rows } = await sql`
            SELECT * FROM humedad
            ORDER BY timestamp DESC
        `;

        console.log("✅ Datos obtenidos de la base de datos:", rows);

        // Devolver los datos en formato JSON
        return new Response(JSON.stringify(rows), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        // Registrar cualquier error ocurrido durante el proceso
        console.error("❌ Error al obtener los datos:", error);
        return new Response("Error al obtener los datos", { status: 500 });
    }
}
