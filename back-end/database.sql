-- Connectez-vous à la base de données
\c area

-- Créez la table "user" avec une séquence (pour l'auto-incrément)
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    token_google VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Créez la table "scenarios" avec une séquence (pour l'auto-incrément)
CREATE TABLE IF NOT EXISTS "scenarios" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    scenario_name VARCHAR(255) NOT NULL,
    scenario_description TEXT,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

-- Créez la table "components" avec une séquence (pour l'auto-incrément)
CREATE TABLE IF NOT EXISTS "components" (
    id SERIAL PRIMARY KEY,
    scenario_id INT NOT NULL,
    component_name VARCHAR(255) NOT NULL,
    component_type VARCHAR(255) NOT NULL,
    link_to VARCHAR(255) NOT NULL,
    FOREIGN KEY (scenario_id) REFERENCES "scenarios"(id)
);

CREATE TABLE IF NOT EXISTS "userStats" (
    id SERIAL PRIMARY KEY,
    user_id INT,
    last_file VARCHAR(255),
    last_message VARCHAR(255),
    last_email VARCHAR(255),
    last_notebook VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);