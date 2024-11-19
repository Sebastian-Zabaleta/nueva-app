import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
    try {
        // Obtener y registrar los datos recibidos
        const data = await request.json();
        console.log("Datos recibidos:", data); // Log para verificar qué datos están llegando

        const { humidity_value, location } = data;

        // Validar que los datos requeridos estén presentes
        if (!humidity_value || !location) {
            console.error("❌ Faltan campos requeridos:", { humidity_value, location });
            return new Response("Faltan campos requeridos", { status: 400 });
        }

        // Insertar los datos en la base de datos
        await sql`
            INSERT INTO humedad (humidity_value, location)
            VALUES (${humidity_value}, ${location})
        `;

        console.log("✅ Dato guardado con éxito en la base de datos.");
        return new Response("Dato guardado con éxito", { status: 200 });
    } catch (error) {
        // Registrar cualquier error ocurrido durante el proceso
        console.error("❌ Error al guardar los datos:", error);
        return new Response("Error al guardar los datos", { status: 500 });
    }
}
