# Create Table users
USE TowerDefenseOnline;
CREATE TABLE TowerDefenseOnline.users
(
  id              INT PRIMARY KEY AUTO_INCREMENT,
  pseudo          VARCHAR(10) NOT NULL,
  password        VARCHAR(10) NOT NULL,
  nb_game         INT             DEFAULT 0,
  round_max       INT             DEFAULT 0,
  date_created    TIMESTAMP       DEFAULT current_timestamp,
  last_connection TIMESTAMP       DEFAULT current_timestamp
);
CREATE UNIQUE INDEX user_pseudo_uindex ON towerdefenseonline.users (pseudo);

# Create Table games
USE TowerDefenseOnline;
CREATE TABLE TowerDefenseOnline.games
(
  id   INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(15) NOT NULL,
  date TIMESTAMP       DEFAULT current_timestamp
);