

npm install


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


CREATE TABLE IF NOT EXISTS User (
  userId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  firstName VARCHAR(10),
  lastName VARCHAR(10),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);







CREATE TABLE IF NOT EXISTS Space (
  spaceId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
ownerid INT UNSIGNED NOT NULL,
  name VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);







CREATE TABLE IF NOT EXISTS Post (
  postId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  writerId INT UNSIGNED,
  spaceId INT UNSIGNED,
  title VARCHAR(50) NOT NULL,
  content VARCHAR(1000) NOT NULL,
  category ENUM('Notice', 'Question') NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP,
  FOREIGN KEY (writerId) REFERENCES User(userId) ON DELETE SET NULL,
  FOREIGN KEY (spaceId) REFERENCES Space(spaceId) ON DELETE SET NULL
);




