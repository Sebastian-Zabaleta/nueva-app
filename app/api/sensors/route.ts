import { sql } from "@vercel/postgres";

// Handler para solicitudes POST
export async function POST(request: Request) {
    try {
        // Parsear el cuerpo de la solicitud
        const { humidity_value, location } = await request.json();

        // Verificar que los datos requeridos estén presentes
        if (!humidity_value || !location) {
            console.error("❌ Faltan campos requeridos:", { humidity_value, location });
            return new Response("Faltan campos requeridos", { status: 400 });
        }

        console.log("📩 Datos recibidos en POST:", { humidity_value, location });

        // Insertar los datos en la tabla 'humedad'
        await sql`
            INSERT INTO humedad (humidity_value, location)
            VALUES (${humidity_value}, ${location})
        `;

        console.log("✅ Dato guardado con éxito en la base de datos.");
        return new Response("Dato guardado con éxito", { status: 200 });
    } catch (error) {
        console.error("❌ Error al guardar los datos:", error);
        return new Response("Error al guardar los datos", { status: 500 });
    }
}

// Handler para solicitudes GET
export async function GET() {
    try {
        // Obtener los últimos 5 registros de la tabla 'humedad', ordenados por timestamp
        const { rows } = await sql`
            SELECT * FROM humedad
            ORDER BY timestamp DESC
            LIMIT 5
        `;

        console.log("✅ Datos obtenidos de la base de datos:", rows);

        // Devolver los datos en formato JSON
        return new Response(JSON.stringify(rows), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
        return new Response("Error al obtener los datos", { status: 500 });
    }
}
