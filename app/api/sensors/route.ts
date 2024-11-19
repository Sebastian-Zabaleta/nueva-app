import { sql } from "@vercel/postgres";

// Handler para solicitudes POST
export async function POST(request: Request) {
    try {
        // Parsear los datos del cuerpo de la solicitud
        const { humidity_value, location } = await request.json();

        // Validar los datos recibidos
        if (!humidity_value || !location) {
            return new Response("Faltan campos requeridos", { status: 400 });
        }

        // Insertar en la base de datos
        await sql`
            INSERT INTO humedad (humidity_value, location)
            VALUES (${humidity_value}, ${location})
        `;

        return new Response("Dato guardado con éxito", { status: 200 });
    } catch (error) {
        console.error("❌ Error al guardar los datos:", error);
        return new Response("Error al guardar los datos", { status: 500 });
    }
}
