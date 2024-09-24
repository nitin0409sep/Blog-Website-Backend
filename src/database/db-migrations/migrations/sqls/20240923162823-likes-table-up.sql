/* Replace with your SQL commands */

CREATE TABLE PostLikes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES Users(user_id) ON DELETE CASCADE NOT NULL, 
    post_id UUID REFERENCES Posts(post_id) ON DELETE CASCADE NOT NULL, 
    liked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

