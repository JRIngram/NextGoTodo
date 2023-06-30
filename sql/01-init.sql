CREATE DATABASE todoApp;
USE todoApp;
CREATE TABLE tasks(
  task_id int NOT NULL AUTO_INCREMENT,
  task_text VARCHAR(256) NOT NULL,
  completed BOOLEAN NOT NULL,
  PRIMARY KEY (task_id)
);
