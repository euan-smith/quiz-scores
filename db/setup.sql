DROP DATABASE IF EXISTS quiz_scores;
CREATE DATABASE quiz_scores;

\c quiz_scores;

CREATE TYPE Score_state as ENUM ('future', 'staged', 'applied', 'past');

CREATE TABLE Quizzes (
	quiz_id SERIAL NOT NULL,
	quiz_title VARCHAR(100) NOT NULL,
	quiz_date DATE,
	quiz_description VARCHAR,

	CONSTRAINT Quizzes_PK
  PRIMARY KEY (quiz_id)
);

CREATE TABLE Teams (
	team_id SERIAL NOT NULL,
	team_name VARCHAR(100) NOT NULL,
	quiz_id INTEGER NOT NULL,

	CONSTRAINT Teams_PK
	PRIMARY KEY (team_id),

	CONSTRAINT T_Quiz_FK
	FOREIGN KEY (quiz_id)
	REFERENCES Quizzes (quiz_id),

	CONSTRAINT T_Team_Name_UNQ
	UNIQUE (team_name, quiz_id)
);

CREATE TABLE Rounds (
	round_id SERIAL NOT NULL,
	round_title VARCHAR(100),
	quiz_id INTEGER NOT NULL,
	can_play_joker BOOLEAN,

	CONSTRAINT Round_PK
	PRIMARY KEY (round_id),

	CONSTRAINT R_Quiz_FK
	FOREIGN KEY (quiz_id)
	REFERENCES Quizzes (quiz_id)
);

CREATE TABLE Scores (
  team_id INTEGER NOT NULL,
  round_id INTEGER NOT NULL,
  quiz_id INTEGER NOT NULL,
	score INTEGER NOT NULL,
	joker BOOLEAN,
	state Score_state,

	CONSTRAINT Scores_PK
	PRIMARY KEY
	(team_id, round_id, quiz_id),

	CONSTRAINT S_Team_FK
	FOREIGN KEY (team_id)
	REFERENCES Teams (team_id),

	CONSTRAINT S_Round_FK
	FOREIGN KEY (round_id)
	REFERENCES Rounds (round_id),

	CONSTRAINT S_Quiz_FK
	FOREIGN KEY (quiz_id)
	REFERENCES Quizzes (quiz_id)
);

GRANT ALL PRIVILEGES ON TABLE quizzes TO euans;
GRANT ALL PRIVILEGES ON TABLE teams TO euans;
GRANT ALL PRIVILEGES ON TABLE rounds TO euans;
GRANT ALL PRIVILEGES ON TABLE scores TO euans;
GRANT USAGE, SELECT ON SEQUENCE quizzes_quiz_id_seq TO euans;
GRANT USAGE, SELECT ON SEQUENCE teams_team_id_seq TO euans;
GRANT USAGE, SELECT ON SEQUENCE rounds_round_id_seq TO euans;