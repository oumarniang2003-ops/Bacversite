-- Migration 0007_password_resets: Jetons de réinitialisation de mot de passe étudiant

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL, -- sha256 hex du jeton, jamais le jeton en clair
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_hash ON password_reset_tokens(token_hash);
