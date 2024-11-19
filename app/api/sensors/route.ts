import { sql } from "@vercel/postgres";

// Log inicial para verificar que el archivo está cargado
console.log("🚀 route.ts cargado correctamente");

export async function POST(request: Request) {
    console.log("📥 Solicitud POST recibida");

    try {
        // Intentar extraer los datos del cuerpo de la solicitud
        const { humidity_value, location } = await request.json();
        console.log("Datos recibidos:", { humidity_value, location });

        // Validar campos requeridos
        if (!humidity_value || !location) {
            console.error("⚠️ Faltan datos requeridos");
            return new Response("Faltan campos requeridos", { status: 400 });
        }

        // Intentar insertar datos en la base de datos
        await sql`INSERT INTO humedad (humidity_value, location) VALUES (${humidity_value}, ${location})`;
        console.log("✅ Datos guardados con éxito");

        // Responder con éxito
        return new Response("Dato guardado con éxito", { status: 200 });
    } catch (error) {
        // Captura de errores en la inserción de datos o lectura del cuerpo
        console.error("❌ Error al procesar el POST:", error);

        // Respuesta de error con información detallada
        if (error instanceof SyntaxError) {
            console.error("⚠️ Error de formato JSON:", error.message);
            return new Response("Error en el formato de la solicitud", { status: 400 });
        }

        return new Response("Error al procesar la solicitud", { status: 500 });
    }
}

export async function GET() {
    console.log("📤 Solicitud GET recibida");

    try {
        // Consultar la base de datos
        const { rows } = await sql`SELECT * FROM humedad ORDER BY timestamp DESC`;
        console.log("✅ Datos obtenidos:", rows);

        // Responder con los datos en formato JSON
        return new Response(JSON.stringify(rows), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("❌ Error al procesar el GET:", error);
        return new Response("Error al obtener los datos", { status: 500 });
    }
}
