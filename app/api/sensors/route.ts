import { sql } from "@vercel/postgres";

// Handler para solicitudes POST
export async function POST(request: Request) {
    try {
        const { humidity_value, location } = await request.json();

        if (!humidity_value || !location) {
            return new Response("Faltan campos requeridos", { status: 400 });
        }

        await sql`INSERT INTO humedad (humidity_value, location) VALUES (${humidity_value}, ${location})`;

        return new Response("Dato guardado con éxito", { status: 200 });
    } catch (error) {
        console.error("❌ Error al guardar los datos:", error);
        return new Response("Error al guardar los datos", { status: 500 });
    }
}

// Handler para solicitudes GET
export async function GET() {
    try {
        const { rows } = await sql`SELECT * FROM humedad ORDER BY timestamp DESC`;

        return new Response(JSON.stringify(rows), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
        return new Response("Error al obtener los datos", { status: 500 });
    }
}
