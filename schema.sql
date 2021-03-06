DROP DATABASE IF EXISTS goalsquad;

CREATE DATABASE goalsquad;

USE goalsquad;

DROP TABLE IF EXISTS user_egg;
DROP TABLE IF EXISTS user_monster;
DROP TABLE IF EXISTS user_goal;
DROP TABLE IF EXISTS egg;
DROP TABLE IF EXISTS goal;
DROP TABLE IF EXISTS monster;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
  user_id int NOT NULL AUTO_INCREMENT,
  fitbit_id varchar(255),
  user_username varchar(255) NOT NULL,
  user_password varchar(255),
  user_accesstoken varchar(255),
  user_refreshtoken varchar(255),
  user_level int NOT NULL DEFAULT 1,
  user_current_xp int NOT NULL DEFAULT 0,
  user_total_points int NOT NULL DEFAULT 0,
  custom_goal_timer_1 varchar(255),
  custom_goal_timer_2 varchar(255),
  notified_of_push_notifications bool default 0,
  wants_push_notifications bool default 0,
  -- push_notification_token varchar(255),
  unsubscribed_from_notifications bool default 0,
  role varchar (30) default null,
  PRIMARY KEY (user_id)
);

CREATE TABLE goal (
  goal_id int NOT NULL AUTO_INCREMENT,
  goal_name varchar(255) NOT NULL,
  goal_activity varchar(50) NOT NULL,
  goal_amount int NOT NULL,
  goal_difficulty varchar(50) NOT NULL,
  goal_class varchar(50) NOT NULL,
  goal_points varchar(50) NOT NULL,
  goal_timedivisor int NOT NULL,
  PRIMARY KEY (goal_id)
);

CREATE TABLE egg (
  egg_id int NOT NULL AUTO_INCREMENT,
  egg_name varchar(255) NOT NULL,
  PRIMARY KEY (egg_id)
);

CREATE TABLE monster (
  monster_id int NOT NULL AUTO_INCREMENT,
  monster_name varchar(255) NOT NULL,
  monster_pic varchar(255),
  monster_icon varchar(255),
  monster_description varchar(255),
  monster_sound varchar(255),

  PRIMARY KEY (monster_id)
);

CREATE TABLE user_egg (
  user_egg_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  egg_id int NOT NULL,
  egg_xp int NOT NULL DEFAULT 0,
  egg_hatched bool NOT NULL DEFAULT 0,
  PRIMARY KEY (user_egg_id),
  FOREIGN KEY (user_id) REFERENCES user (user_id),
  FOREIGN KEY (egg_id) REFERENCES egg (egg_id)
);

CREATE TABLE user_monster (
  user_monster_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  monster_id int NOT NULL,
  user_monster_level int NOT NULL DEFAULT 1,
  user_monster_new_name varchar(255),
  user_monster_hp int DEFAULT 10,
  user_monster_attack int DEFAULT 1,
  user_monster_defense int DEFAULT 1,
  user_monster_current_xp int DEFAULT 0,
  user_monster_yard bool default 0,
  user_monster_xcoord int,
  user_monster_ycoord int,
  user_monster_creation DATETIME,
  PRIMARY KEY (user_monster_id),
  FOREIGN KEY (user_id) REFERENCES user (user_id),
  FOREIGN KEY (monster_id) REFERENCES monster (monster_id)
);

CREATE TABLE user_goal (
  user_goal_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  goal_id int NOT NULL,
  user_goal_start_value int,
  user_goal_current int,
  user_goal_target int,
  user_goal_start_date datetime DEFAULT CURRENT_TIMESTAMP,
  user_goal_end_date datetime,
  user_goal_finalized bool default 0,
  user_goal_success bool default 0,
  user_goal_concluded bool default 0,
  user_goal_points int,
  PRIMARY KEY (user_goal_id),
  FOREIGN KEY (user_id) REFERENCES user (user_id),
  FOREIGN KEY (goal_id) REFERENCES goal (goal_id)
);

insert into user
  (user_username, fitbit_id)
VALUES
  ('mickey', '3XP8GJ');

insert into monster
  (monster_name, monster_pic, monster_icon, monster_description)
VALUES
  ('Scuttlebutt', './assets/squaddies/scuttlebutt.png', './assets/squaddies/scuttlebutt-icon.png', "Likes neither pina coladas nor getting caught in the rain."),
  ('Pruny', './assets/squaddies/pruny.png', './assets/squaddies/pruny-icon.png', 'Once held Guiness Book of World Record for longest clarinet solo.'),
  ('Bard', './assets/squaddies/bard.png', './assets/squaddies/bard-icon.png', "Banned from New Hampshire since 2006, case files for the crime have since been sealed."),
  ('Squaggle', './assets/squaddies/squaggle.png', './assets/squaddies/squaggle-icon.png', 'Nephew of that sea monster in the Indian Ocean you see on old maps.'),
  ('Kow', './assets/squaddies/kow.png', './assets/squaddies/kow-icon.png', 'Fluent in 14 languages.  Literate in none.'),
  ('Ploppo', './assets/squaddies/ploppo.png', './assets/squaddies/ploppo-icon.png', 'Mayor of Chernobyl, planning US Presidential campaign for 2028.'),
  ('Geldica', './assets/squaddies/geldica.png', './assets/squaddies/geldica-icon.png', "Pros: hasn't murdered anyone recently\nCons: relapse is imminent"),
  ('Harry', './assets/squaddies/hairy.png', './assets/squaddies/hairy-icon.png', "Please donate to the NAAF to support Harry's fight with alopecia"),
  ('Broccolli', './assets/squaddies/broccolli.png', './assets/squaddies/broccolli-icon.png', "Knows that he looks more like a bean. It's a sensitive subject. Please don't bring it up."),
  ('Grumpkin', './assets/squaddies/grumpkin.png', './assets/squaddies/grumpkin-icon.png', 'Wears the skull of his deceased mother. His cries echo inside the skull and come out as a sad melody.'),
  ('Kale', './assets/squaddies/kale.png', './assets/squaddies/kale-icon.png', 'Recently escapted from a CDC lab studying potential carcinogens, handle with care.'),
  ('Mothra', './assets/squaddies/mothra.png', './assets/squaddies/mothra-icon.png', "2015 Champion of Seattle's Regional Bar Trivia Tournament"),
  ('Pattycakes', './assets/squaddies/pattycakes.png', './assets/squaddies/pattycakes-icon.png', 'Founder of People for the Ethical Taping of Arguments. Is not a person.'),
  ('Slenderbush', './assets/squaddies/slenderbush.png', './assets/squaddies/slenderbush-icon.png', "Has been talking about her mixtape thats about to drop for the last 5 years."),
  ('Supahfly', './assets/squaddies/supahfly.png', './assets/squaddies/supahfly-icon.png', "Knows what really happened to Biggie and Tupac, but isn't talking.");

insert into egg
  (egg_name)
VALUES
  ('scuttlebutt_egg'),
  ('pruny_egg'),
  ('bard_egg'),
  ('squaggle_egg'),
  ('kow_egg'),
  ('ploppo_egg'),
  ('geldica_egg'),
  ('broccolli_egg'),
  ('grumpkin_egg'),
  ('harry_egg'),
  ('kale_egg'),
  ('mothra_egg'),
  ('pattycakes_egg'),
  ('slenderbush_egg'),
  ('supahfly_egg');

insert into goal 
  (goal_name, goal_activity, goal_amount, goal_difficulty, goal_class, goal_points, goal_timedivisor)
VALUES
  ('Run 1 mile', 'distance', 1, 'easy', 'short', 5, 2),
  ('Run 2 miles','distance', 2, 'med', 'short', 10, 2),
  ('Run 5 miles','distance', 5, 'hard', 'short', 20, 2),
  ('Run 10 miles','distance', 10, 'easy', 'long', 50, 24),
  ('Run 25 miles','distance', 25, 'med', 'long', 75, 24),
  ('Run 50 miles','distance', 50, 'hard', 'long', 100, 24),
  ('Walk 2,000 steps', 'steps', 2000, 'easy', 'short', 5, 2),
  ('Walk 4,000 steps', 'steps', 4000, 'med', 'short', 10, 2),
  ('Walk 10,000 steps', 'steps', 10000, 'hard', 'short', 20, 2),
  ('Walk 20,000 steps', 'steps', 20000, 'easy', 'long', 50, 24),
  ('Walk 50,000 steps', 'steps', 50000, 'med', 'long', 75, 24),
  ('Walk 100,000 steps', 'steps', 100000, 'hard', 'long', 100, 24),
  ('Climb 3 stairs', 'floors', 3, 'easy', 'short', 5, 2),
  ('Climb 5 stairs', 'floors', 5, 'med', 'short', 10, 2),
  ('Climb 20 stairs', 'floors', 20, 'hard', 'short', 20, 2),
  ('Climb 40 stairs', 'floors', 40, 'easy', 'long', 50, 24),
  ('Climb 100 stairs', 'floors', 100, 'med', 'long', 75, 24),
  ('Climb 200 stairs', 'floors', 200, 'hard', 'long', 100, 24);

insert into user_egg
  (user_id, egg_id)
VALUES
  (1, 2);

insert into user_monster
  (user_id, monster_id)
VALUES
  (1, 2);

insert into user_goal
  (user_id, goal_id, user_goal_target, user_goal_end_date, user_goal_points)
VALUES
  (1, 2, 20, '2018-03-20', 20),
  (1, 14, 6000, '2018-03-21', 25),
  (1, 9, 30000, '2018-03-22', 30),
  (1, 3, 2000, '2018-03-23', 5),
  (1, 5, 5000, '2018-03-24', 40),
  (1, 12, 376800, '2018-03-25', 60);


/*  Execute this file from the command line by typing:
 *    mysql -u root < schema.sql
 *  to create the database and the tables.*/
