.read data.sql

CREATE TABLE bluedog AS
  SELECT color, pet 
  FROM students 
  WHERE color = "blue" AND pet = "dog";

CREATE TABLE bluedog_songs AS
  SELECT color, pet, song 
  FROM students 
  WHERE color = "blue" AND pet = "dog";


CREATE TABLE smallest_int AS
  SELECT time, smallest 
  From students 
  WHERE smallest>2 ORDER BY smallest LIMIT 20;


CREATE TABLE matchmaker AS
  SELECT a1.pet, a1.song, a1.color, a2.color
  FROM students AS a1, students AS a2
  WHERE a1.time < a2.time AND a1.pet = a2.pet AND a1.song = a2.song;


CREATE TABLE sevens AS
  SELECT seven
  FROM students AS a, numbers AS n
  WHERE a.number = 7 AND n."7" = "True" AND a.time = n.time;

