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

  const migrationPath = path.resolve('db/migrations/0007_password_resets.sql');
  if (!fs.existsSync(migrationPath)) {
    console.error("0007_password_resets.sql non trouvé !");
    process.exit(1);
  }

  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connecté à la base de données.");

    console.log("Exécution de la migration password_reset_tokens...");
    await client.query(migrationSql);
    console.log("Migration réussie !");

    const res = await client.query("SELECT COUNT(*) FROM password_reset_tokens");
    console.log(`- password_reset_tokens : ${res.rows[0].count} lignes`);
  } catch (error) {
    console.error("Erreur lors de l'exécution :", error);
  } finally {
    await client.end();
  }
}

run();
