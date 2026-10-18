CREATE TABLE IF NOT EXISTS cms_content (id integer PRIMARY KEY CHECK(id=1), published jsonb NOT NULL, draft jsonb NOT NULL, revision integer NOT NULL DEFAULT 1, updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS cms_history (revision integer PRIMARY KEY, content jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS cms_media (id uuid PRIMARY KEY, mime text NOT NULL, data text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
