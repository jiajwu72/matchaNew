CREATE DATABASE IF NOT EXISTS matcha;
use matcha;
DROP TABLE IF EXISTS notified;
DROP TABLE IF EXISTS blocked;
DROP TABLE IF EXISTS consulted;
DROP TABLE IF EXISTS liked;
DROP TABLE IF EXISTS blocked;
DROP TABLE IF EXISTS reported;
DROP TABLE IF EXISTS matched;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS tagged;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS message;

CREATE TABLE IF NOT EXISTS user
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    identif VARCHAR(100) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    sex int,
    birthdate DATE,
    age int(2) DEFAULT 18,
    locality VARCHAR(100),
    code_postal VARCHAR(5),
    latitude VARCHAR(100),
    longitude VARCHAR(100),
    pop_score INT DEFAULT 0,
    pop_score_base INT DEFAULT 0,
    pop_score_optional INT DEFAULT 0,
    online INT DEFAULT 0,
    img1 varchar(100) DEFAULT NULL,
    img2 varchar(100) DEFAULT NULL,
    img3 varchar(100) DEFAULT NULL,
    img4 varchar(100) DEFAULT NULL,
    img5 varchar(100) DEFAULT NULL,
    selectImg varchar(100) DEFAULT NULL,
    orientation tinyint(1) DEFAULT 1,
    biographe text,
    last_connection datetime DEFAULT NULL,
    reset_token varchar(255) DEFAULT NULL,
    reset_at datetime DEFAULT NULL,
    access_token VARCHAR(255),
    confirmed_email INT DEFAULT 0,
    confirmed_token VARCHAR(255),
    socket_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS tag
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL unique,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tagged
(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    tag_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (tag_id) REFERENCES tag(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS room
(
    id INT NOT NULL AUTO_INCREMENT,
    user_a INT,
    user_b INT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_a) REFERENCES user(id),
    FOREIGN KEY (user_b) REFERENCES user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    content TEXT,
    from_user INT,
    from_user_profil VARCHAR(100),
    to_user INT,
    readed INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS message
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    content TEXT,
    from_user INT,
    type VARCHAR(100),
    to_user INT,
    readed INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS liked
(
    id INT NOT NULL AUTO_INCREMENT,
    from_user INT,
    to_user INT,
    PRIMARY KEY (id),
    FOREIGN KEY (from_user) REFERENCES user(id),
    FOREIGN KEY (to_user) REFERENCES user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blocked
(
    id INT NOT NULL AUTO_INCREMENT,
    from_user INT,
    to_user INT,
    PRIMARY KEY (id),
    FOREIGN KEY (from_user) REFERENCES user(id),
    FOREIGN KEY (to_user) REFERENCES user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reported
(
    id INT NOT NULL AUTO_INCREMENT,
    from_user INT,
    to_user INT,
    PRIMARY KEY (id),
    FOREIGN KEY (from_user) REFERENCES user(id),
    FOREIGN KEY (to_user) REFERENCES user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matched
(
    id INT NOT NULL AUTO_INCREMENT,
    from_user INT,
    to_user INT,
    PRIMARY KEY (id),
    FOREIGN KEY (from_user) REFERENCES user(id),
    FOREIGN KEY (to_user) REFERENCES user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consulted
(
    id INT NOT NULL AUTO_INCREMENT,
    from_user INT,
    to_user INT,
    PRIMARY KEY (id),
    FOREIGN KEY (from_user) REFERENCES user(id),
    FOREIGN KEY (to_user) REFERENCES user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blocked
(
    id INT NOT NULL AUTO_INCREMENT,
    from_user INT,
    to_user INT,
    PRIMARY KEY (id),
    FOREIGN KEY (from_user) REFERENCES user(id),
    FOREIGN KEY (to_user) REFERENCES user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notified
(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    msg text,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tagged
ADD CONSTRAINT user_tag_unique UNIQUE(user_id, tag_id);
