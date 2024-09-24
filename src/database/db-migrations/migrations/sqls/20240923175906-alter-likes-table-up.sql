/* Replace with your SQL commands */
ALTER TABLE PostLikes
ADD CONSTRAINT unique_user_post UNIQUE (user_id, post_id);
