CREATE TABLE vedis.users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) unique NOT NULL,
    password VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(255) unique NOT NULL,
    role VARCHAR(255) DEFAULT 'pending'
);
