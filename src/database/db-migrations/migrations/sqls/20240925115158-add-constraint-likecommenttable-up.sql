/* Replace with your SQL commands */
ALTER TABLE LIKECOMMENT
ADD CONSTRAINT unique_user_comment_like UNIQUE (user_id, comment_id);