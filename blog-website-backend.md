### \* CREATE INDEX articles_content_idx ON articles USING GIN (to_tsvector('english', content));
