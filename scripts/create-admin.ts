import bcrypt from "bcryptjs";
import { Client } from "pg";
import fs from "fs";
import path from "path";

/**
 * Custom helper to load environment variables from .env.local
 */
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split(/\r?\n/).forEach((line) => {
      // Ignore comments and empty lines
      if (!line || line.trim().startsWith("#")) return;
      
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join("=").trim();
        
        // Remove surrounding quotes if any
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

async function main() {
  loadEnv();

  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password>");
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Error: DATABASE_URL is not defined in .env.local");
    process.exit(1);
  }

  console.log(`Initialisation de la base de données et création de l'admin: ${email}...`);

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false, // Nécessaire pour Neon.tech
    },
  });

  try {
    await client.connect();

    // 1. Exécuter les migrations SQL
    const migrationSqlPath = path.resolve(process.cwd(), "db/migrations/0001_init.sql");
    if (fs.existsSync(migrationSqlPath)) {
      console.log("Exécution des migrations SQL depuis 0001_init.sql...");
      const migrationSql = fs.readFileSync(migrationSqlPath, "utf8");
      await client.query(migrationSql);
      console.log("Migrations exécutées avec succès.");
    } else {
      console.warn("Attention : Fichier de migration 0001_init.sql introuvable.");
    }

    // 2. Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Vérifier et insérer l'administrateur
    const checkUser = await client.query("SELECT id FROM admin_users WHERE email = $1", [email]);

    if (checkUser.rows.length > 0) {
      // Mettre à jour le mot de passe existant
      await client.query("UPDATE admin_users SET password_hash = $1 WHERE email = $2", [passwordHash, email]);
      console.log(`Succès : Le mot de passe de l'administrateur existant "${email}" a été mis à jour.`);
    } else {
      // Insérer un nouvel utilisateur
      await client.query("INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)", [email, passwordHash]);
      console.log(`Succès : Le compte administrateur "${email}" a été créé avec succès.`);
    }
  } catch (error: any) {
    console.error("Erreur lors de l'exécution du script :", error.message || error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
