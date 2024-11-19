import { sql } from "@vercel/postgres";

// Handler para solicitudes POST
export async function POST(request: Request) {
    try {
        console.log("📥 Solicitud recibida en el endpoint /api/sensors");

        // Extraer los datos del cuerpo de la solicitud
        const { humidity_value, location } = await request.json();
        console.log(`Datos recibidos: Humedad=${humidity_value}, Ubicación=${location}`);

        // Validación básica
        if (!humidity_value || !location) {
            console.error("⚠️ Faltan campos requeridos");
            return new Response("Faltan campos requeridos", { status: 400 });
        }

        // Insertar los datos en la base de datos
        await sql`INSERT INTO humedad (humidity_value, location) VALUES (${humidity_value}, ${location})`;
        console.log("✅ Datos insertados correctamente en la base de datos");

        // Responder con éxito
        return new Response("Dato guardado con éxito", { status: 200 });
    } catch (error) {
        console.error("❌ Error al guardar los datos:", error);

        // Responder con un mensaje de error
        return new Response("Error al guardar los datos", { status: 500 });
    }
}

// Handler para solicitudes GET (opcional: listar los datos)
export async function GET() {
    try {
        console.log("📤 Solicitud GET recibida en el endpoint /api/sensors");

        // Consultar los datos en la tabla `humedad`
        const { rows } = await sql`SELECT * FROM humedad ORDER BY timestamp DESC`;
        console.log("✅ Datos obtenidos de la base de datos:", rows);

        // Devolver los datos en formato JSON
        return new Response(JSON.stringify(rows), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("❌ Error al obtener los datos:", error);

        // Responder con un mensaje de error
        return new Response("Error al obtener los datos", { status: 500 });
    }
}
