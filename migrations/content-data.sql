-- Migration Script for Creating Content Table

CREATE TABLE IF NOT EXISTS content (
    content_id UUID PRIMARY KEY NOT NULL,
    artist_id UUID REFERENCES artists(artist_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('song', 'video', 'photo')) NOT NULL,
    url TEXT NOT NULL,
    is_free BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_content_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER set_content_timestamp
BEFORE UPDATE ON content
FOR EACH ROW
EXECUTE FUNCTION update_content_modified_column();
