import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split(/\r?\n/).forEach((line) => {
      if (!line || line.trim().startsWith("#")) return;
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join("=").trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
}

async function run() {
  loadEnv();
  
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL non définie dans .env.local !");
    process.exit(1);
  }

  const seedPath = path.resolve('db/migrations/0004_more_content.sql');
  if (!fs.existsSync(seedPath)) {
    console.error("0004_more_content.sql non trouvé !");
    process.exit(1);
  }

  const seedSql = fs.readFileSync(seedPath, 'utf8');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connecté à la base de données.");

    console.log("Exécution du script SQL complémentaire...");
    await client.query(seedSql);
    console.log("Importation réussie !");

    // Fetch counts
    const tables = ['ecoles', 'concours', 'bourses'];
    console.log("\nNombre total de lignes par table après l'import :");
    for (const table of tables) {
      const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`- ${table} : ${res.rows[0].count} lignes`);
    }

  } catch (error) {
    console.error("Erreur lors de l'exécution :", error);
  } finally {
    await client.end();
  }
}

run();
