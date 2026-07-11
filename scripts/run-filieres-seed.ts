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

  const seedPath = path.resolve('db/migrations/0003_filieres_seed.sql');
  if (!fs.existsSync(seedPath)) {
    console.error("0003_filieres_seed.sql non trouvé !");
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

    // Clean existing filieres first to avoid duplicates if run multiple times
    console.log("Nettoyage de la table filieres...");
    await client.query("TRUNCATE TABLE filieres RESTART IDENTITY CASCADE");

    console.log("Exécution du script de seed SQL pour les filières...");
    await client.query(seedSql);
    console.log("Seed SQL exécuté avec succès !");

    // Fetch counts
    const res = await client.query("SELECT COUNT(*) FROM filieres");
    console.log(`\nNombre total de lignes dans la table filieres : ${res.rows[0].count}`);

  } catch (error) {
    console.error("Erreur lors de l'exécution :", error);
  } finally {
    await client.end();
  }
}

run();
