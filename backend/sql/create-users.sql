CREATE TABLE vedis.users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255) DEFAULT "n/a",
    role VARCHAR(255) DEFAULT 'pending'
);
