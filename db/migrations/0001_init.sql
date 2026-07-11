-- Migration 0001_init: Schéma de base de données initial pour Bacversité

-- 1. Table: filieres (Filières d'études et débouchés)
CREATE TABLE IF NOT EXISTS filieres (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: ecoles (Établissements d'enseignement supérieur)
CREATE TABLE IF NOT EXISTS ecoles (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- Public, Privé
    ville VARCHAR(100),
    filieres TEXT, -- Liste ou description des filières disponibles
    frais VARCHAR(255), -- Frais de scolarité/inscription
    conditions_admission TEXT,
    contact VARCHAR(255),
    site_web VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: concours (Concours d'entrée aux grandes écoles)
CREATE TABLE IF NOT EXISTS concours (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    filieres TEXT, -- Filières cibles
    date_limite DATE, -- Date de clôture des inscriptions
    conditions TEXT, -- Critères de participation
    ecoles_liees TEXT, -- Écoles concernées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: bourses (Offres de bourses d'études nationales ou internationales)
CREATE TABLE IF NOT EXISTS bourses (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    pays VARCHAR(100),
    montant VARCHAR(255),
    date_limite DATE, -- Date limite de candidature
    conditions_eligibilite TEXT,
    lien_candidature VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table: etudes_etranger (Informations sur les études à l'étranger par destination)
CREATE TABLE IF NOT EXISTS etudes_etranger (
    id SERIAL PRIMARY KEY,
    pays VARCHAR(100) NOT NULL,
    procedures TEXT, -- Démarches administratives (Campus France, etc.)
    cout_vie_estime VARCHAR(255),
    partenaires TEXT, -- Universités/Organismes partenaires
    visa_info TEXT, -- Procédures de visa étudiant
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table: quiz_questions (Questions du quiz d'orientation)
CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Exemple: {"choices": ["Littéraire", "Scientifique"], "correctAnswer": "Scientifique"}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table: admin_users (Administrateurs de la plateforme)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
