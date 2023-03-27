use Tentabank;
drop table if exists pending;
drop table if exists accepted;
drop table if exists denied;
drop table if exists comments;
drop table if exists usertable;

create table usertable(
user_id int NOT NULL auto_increment,
username varchar(50),
email varchar(50),
password varchar(250),
role varchar(50) default "Student",
uploads int default 0,
primary key (user_id));

select * from usertable;

Create Table pending(
id Int AUTO_INCREMENT Not Null Primary Key, 
file_name Varchar(255), 
cource_code varchar(10) not null,
grade varchar(1) not null,
exam_date date not null,
file_data varchar(300) Not Null, 
user_id int Not Null, 
created_on Date Not Null,
rating int default 0,
FOREIGN KEY (user_id) REFERENCES usertable(user_id),
accepted Varchar(255) default "pending",
exam_id varchar(255) Not Null
);

Create Table accepted(
id Int AUTO_INCREMENT Not Null Primary Key, 
file_name Varchar(255), 
cource_code varchar(10) not null,
grade varchar(1) not null,
exam_date date not null,
file_data varchar(300) Not Null, 
user_id int Not Null, 
created_on Date Not Null,
rating int default 0,
FOREIGN KEY (user_id) REFERENCES usertable(user_id),
accepted Varchar(255) default "acccepted",
exam_id varchar(255) Not Null
);

Create Table denied(
id Int AUTO_INCREMENT Not Null Primary Key, 
file_name Varchar(255), 
cource_code varchar(10) not null,
grade varchar(1) not null,
exam_date date not null,
file_data varchar(300) Not Null, 
user_id int Not Null, 
created_on Date Not Null,
rating int default 0,
FOREIGN KEY (user_id) REFERENCES usertable(user_id),
accepted Varchar(255) default "denied",
exam_id varchar(255) Not Null
);

create table comments(
comment_id int not null auto_increment primary key,
file_id int,
user_id int,
comment varchar(255),
created_on dateTIME);


drop trigger if exists accepted_review;
DELIMITER //
CREATE TRIGGER accepted_review 
AFTER UPDATE ON pending
FOR EACH ROW
BEGIN
	IF NEW.accepted="accepted" THEN
		INSERT INTO accepted (id, file_name, cource_code, grade, exam_date, file_data, user_id, created_on, rating, accepted, exam_id)
		SELECT id, file_name, cource_code, grade, exam_date, file_data, user_id, created_on, rating, accepted, exam_id 
		FROM pending
		WHERE pending.accepted = NEW.accepted;
	ELSEIF NEW.accepted="denied" THEN
		INSERT INTO denied (id, file_name, cource_code, grade, exam_date, file_data, user_id, created_on, rating, accepted, exam_id)
		SELECT id, file_name, cource_code, grade, exam_date, file_data, user_id, created_on, rating, accepted, exam_id
		FROM pending
		WHERE pending.accepted = NEW.accepted;
	END IF;
END//
DELIMITER ;

drop trigger if exists increase_uploads;
DELIMITER //
CREATE TRIGGER increase_uploads
AFTER INSERT ON accepted
FOR EACH ROW
BEGIN
UPDATE usertable
SET usertable.uploads = usertable.uploads + 1
WHERE usertable.user_id = NEW.user_id;
END//
DELIMITER ; 

drop trigger if exists decrease_uploads;
DELIMITER //
CREATE TRIGGER decrease_uploads
AFTER DELETE ON accepted
FOR EACH ROW
BEGIN
UPDATE usertable
SET usertable.uploads = usertable.uploads - 1
WHERE usertable.user_id = OLD.user_id;
END//
DELIMITER ;

drop view if exists course_code_view;    
CREATE VIEW course_code_view AS
SELECT DISTINCT
    CASE SUBSTRING(cource_code, 1, 2)
        WHEN 'MA' THEN 'Matematik kurser'
        WHEN 'IY' THEN 'Ekonomi Kurser'
        WHEN 'PA' THEN 'Programerings Kurser'
        ELSE SUBSTRING(cource_code, 1, 2)
    END AS code_group_name,
    cource_code
FROM
    accepted;

SELECT * FROM pending;
SELECT * FROM accepted;
SELECT * FROM denied;
SELECT * FROM usertable;
select * from comments;
select denied.created_on from denied join comments on denied.id=comments.file_id where denied.user_id = 2;
INSERT INTO usertable (username, email, password, role) values ("Eggovich","e", "f", "Reviewer");
INSERT INTO usertable (username, email, password) values ("Hanna", "h", "i");
UPDATE pending SET accepted = "accepted" WHERE id = 2;
INSERT INTO pending values (7, "hej.pdf", "MA1432", "A", "2022-01-06 00:00:00", "fff", 2, "2023-02-28 00:00:00", 0, "accepted")