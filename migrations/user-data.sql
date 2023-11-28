-- Migration Script for Creating Users Table

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY NOT NULL, 
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    profile_picture TEXT,
    banner TEXT,
    bio TEXT,
    updated_at TIMESTAMP DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
