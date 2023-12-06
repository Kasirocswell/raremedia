CREATE TABLE tiers (
    id SERIAL PRIMARY KEY,
    artist_id UUID REFERENCES artists(artist_id), -- Assuming you have an artists table
    name VARCHAR(255) NOT NULL,
    price NUMERIC NOT NULL
);