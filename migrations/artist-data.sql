-- Migration Script for Creating Artists Table

CREATE TABLE IF NOT EXISTS artists (
    artist_id UUID PRIMARY KEY NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artist_name TEXT NOT NULL,
    profile_picture TEXT,
    banner TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_artist_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER set_artist_timestamp
BEFORE UPDATE ON artists
FOR EACH ROW
EXECUTE FUNCTION update_artist_modified_column();
