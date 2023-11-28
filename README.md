
실행 : npm start



------------------------

POST /users/sugnup 회원가입

POST /users/login 로그인

GET /users/:userId 유저별 조회

------------------------

POST /spaces 공간 생성

POST /spaces/join 공간 연결

GET  /spaces 공간 조회

------------------------

POST /posts 게시물 생성

------------------------

CREATE TABLE User (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName VARCHAR(10),
    lastName VARCHAR(10),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Space (
    spaceId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    ownerId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES User(userId) ON DELETE SET NULL
);


CREATE TABLE Post (
    postIdx INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    category ENUM('Notice', 'Question') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP,
    userId INT,
    spaceId INT,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE SET NULL,
    FOREIGN KEY (spaceId) REFERENCES Space(spaceId) ON DELETE SET NULL
);

CREATE TABLE user_space (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    spaceId INT,
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (spaceId) REFERENCES Space(spaceId)
);
