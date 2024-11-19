import { Pool } from "pg";

// Configuración de la conexión con PostgreSQL utilizando la variable de entorno DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Asegura la conexión SSL
    },
});

// Handler para solicitudes POST
export async function POST(request: Request): Promise<Response> {
    try {
        const { humidity_value, location }: { humidity_value: number; location: string } =
            await request.json();

        if (
            typeof humidity_value !== "number" ||
            typeof location !== "string" ||
            !location.trim()
        ) {
            return new Response("Datos inválidos: asegúrate de que todos los campos sean correctos", {
                status: 400,
            });
        }

        const query = "INSERT INTO humedad (humidity_value, location) VALUES ($1, $2)";
        const values = [humidity_value, location];
        await pool.query(query, values);

        return new Response("Dato guardado con éxito", { status: 200 });
    } catch (error) {
        console.error("❌ Error al guardar los datos:", (error as Error).message || error);
        return new Response(
            JSON.stringify({
                error: "Error al guardar los datos",
                details: (error as Error).message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// Handler para solicitudes GET
export async function GET(): Promise<Response> {
    try {
        const query = "SELECT * FROM humedad ORDER BY timestamp DESC";
        const result = await pool.query(query);

        return new Response(JSON.stringify(result.rows), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("❌ Error al obtener los datos:", (error as Error).message || error);
        return new Response(
            JSON.stringify({
                error: "Error al obtener los datos",
                details: (error as Error).message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
