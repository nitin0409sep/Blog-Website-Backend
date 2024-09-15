/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS roles (
    _id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id INTEGER NOT NULL,
    role_name VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS USERS(
   user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name VARCHAR(200) NOT NULL,
    user_email VARCHAR(200) NOT NULL,
    user_password VARCHAR(200) NOT NULL,
    role_id INTEGER NOT NULL, 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);