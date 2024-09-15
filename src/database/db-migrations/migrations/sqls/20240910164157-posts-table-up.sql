/* Replace with your SQL commands */
CREATE TABLE Posts (
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    user_id UUID REFERENCES Users(user_id) ON DELETE CASCADE NOT NULL, 
    post_name VARCHAR(100) NOT NULL, 
    post_desc VARCHAR(1000) NOT NULL, 
    post_article TEXT, 
    post_public BOOLEAN DEFAULT false, 
    post_archive BOOLEAN DEFAULT false, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
