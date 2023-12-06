ALTER TABLE content
DROP CONSTRAINT IF EXISTS content_type_check; -- Drop the existing constraint if it exists

ALTER TABLE content
ADD CONSTRAINT content_type_check CHECK (type IN ('song', 'video', 'photo'));