import { sql } from "@vercel/postgres";

// Handler para solicitudes POST
export async function POST(request: Request) {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const { humidity_value, location } = await request.json();

        // Validación básica de los datos
        if (!humidity_value || !location) {
            return new Response("Faltan campos requeridos", { status: 400 });
        }

        // Insertar los datos en la tabla "humedad"
        await sql`INSERT INTO humedad (humidity_value, location) VALUES (${humidity_value}, ${location})`;

        // Responder con éxito
        return new Response("Dato guardado con éxito", { status: 200 });
    } catch (error) {
        console.error("❌ Error al procesar la solicitud POST:", error);

        // Responder con un mensaje de error
        return new Response("Error al guardar los datos en la base de datos", { status: 500 });
    }
}

// Handler para solicitudes GET (opcional: listar los datos)
export async function GET() {
    try {
        // Consultar los datos en la tabla "humedad" y ordenar por la marca de tiempo
        const { rows } = await sql`SELECT * FROM humedad ORDER BY timestamp DESC`;

        // Responder con los datos en formato JSON
        return new Response(JSON.stringify(rows), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("❌ Error al procesar la solicitud GET:", error);

        // Responder con un mensaje de error
        return new Response("Error al obtener los datos de la base de datos", { status: 500 });
    }
}
