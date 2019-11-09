DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Professors CASCADE;
DROP TABLE IF EXISTS Students CASCADE;
DROP TABLE IF EXISTS Courses CASCADE;
DROP TABLE IF EXISTS Enrolls CASCADE;
DROP TABLE IF EXISTS Requests CASCADE;
DROP TABLE IF EXISTS Teaches CASCADE;
DROP TABLE IF EXISTS Scores CASCADE;
DROP TABLE IF EXISTS Assessment CASCADE;
DROP TABLE IF EXISTS Announcements CASCADE;
DROP TABLE IF EXISTS Forums CASCADE;
DROP TABLE IF EXISTS Threads CASCADE;
DROP TABLE IF EXISTS Posts CASCADE;
DROP TABLE IF EXISTS Tutors CASCADE;
DROP TABLE IF EXISTS Passed CASCADE;

CREATE TABLE Users (
	username  varchar(50) PRIMARY KEY,
	password  varchar(256) NOT NULL,
	name      varchar(50) NOT NULL
);

CREATE TABLE Professors (
	username  varchar(50) PRIMARY KEY REFERENCES Users
);

CREATE TABLE Students (
	username            varchar(50) PRIMARY KEY REFERENCES Users,
	max_module_credits  integer DEFAULT 20
);

CREATE TABLE Courses (
	module_code  varchar(8) PRIMARY KEY,
	name         varchar(50) NOT NULL,
	credits      integer DEFAULT 4,
	quota        integer NOT NULL,
	is_active    boolean DEFAULT true
);

CREATE TABLE Requests (
	suname       varchar(50) REFERENCES Students ON DELETE CASCADE,
	module_code  varchar(8) REFERENCES Courses ON DELETE CASCADE,
	timestamp    timestamp NOT NULL,
	PRIMARY KEY (suname, module_code)
);

CREATE TABLE Enrolls (
	suname          varchar(50) REFERENCES Students ON DELETE CASCADE,
	module_code     varchar(8) REFERENCES Courses ON DELETE CASCADE,
	tutorial_group  integer, -- sectionals have no tutorials
	project_group   integer, -- not all mods have projects
	PRIMARY KEY (suname, module_code)
);

CREATE TABLE Teaches (
	puname       varchar(50) REFERENCES Professors,
	module_code  varchar(8) REFERENCES Courses ON DELETE CASCADE,
	PRIMARY KEY (puname, module_code)
);

CREATE TABLE Assessment (
	module_code  varchar(8) REFERENCES Courses ON DELETE CASCADE,
	title        varchar(50),
	max_mark     numeric NOT NULL,
	PRIMARY KEY (module_code, title)
);

CREATE TABLE Scores (
	suname       varchar(50) REFERENCES Students ON DELETE CASCADE,
	module_code  varchar(8),
	score        numeric,
	title        varchar(50),
	FOREIGN KEY (module_code, title) REFERENCES Assessment ON DELETE CASCADE,
	PRIMARY KEY (suname, module_code, title)
);

CREATE TABLE Announcements (
	module_code  varchar(8) REFERENCES Courses ON DELETE CASCADE,
	title        varchar(50),
	puname       varchar(50),
	content      text NOT NULL,
	timestamp    timestamp NOT NULL,
	PRIMARY KEY (module_code, title)
);

CREATE TABLE Forums (
	module_code  varchar(8) REFERENCES Courses ON DELETE CASCADE,
	category     varchar(50),
	PRIMARY KEY (module_code, category)
);

CREATE TABLE Threads (
	module_code   varchar(8),
	category      varchar(50),
	thread_title  varchar(50),
	uname         varchar(50) REFERENCES Users,
	timestamp     timestamp,
	PRIMARY KEY  (module_code, category, thread_title),
	FOREIGN KEY  (module_code, category) REFERENCES Forums ON DELETE CASCADE
);

CREATE TABLE Posts (
	module_code   varchar(8),
	category      varchar(50),
	thread_title  varchar(50),
	post_content  text NOT NULL,
	post_id	      integer,
	timestamp     timestamp NOT NULL,
	uname         varchar(50) REFERENCES Users,
	PRIMARY KEY (module_code, category, thread_title, post_id),
	FOREIGN KEY (module_code, category, thread_title) REFERENCES Threads ON DELETE CASCADE
);

CREATE TABLE Tutors (
	suname          varchar(50) REFERENCES Students ON DELETE CASCADE,
	module_code     varchar(8) REFERENCES Courses ON DELETE CASCADE,
	tutorial_group  integer NOT NULL,
	PRIMARY KEY (suname, module_code)
);

CREATE TABLE Passed (
	suname 	       varchar(50) REFERENCES Students ON DELETE CASCADE,
	-- delete not cascaded to retain list of courses students have passed
	module_code    varchar(8) REFERENCES Courses,
	academic_year  varchar(7) NOT NULL,
	semester       integer NOT NULL,
	grade          numeric NOT NULL,
	PRIMARY KEY (suname, module_code)
);

DROP FUNCTION IF EXISTS validate_course_enrollment CASCADE;
DROP FUNCTION IF EXISTS validate_passed_students CASCADE;
DROP FUNCTION IF EXISTS validate_course_requests CASCADE;
DROP FUNCTION IF EXISTS validate_tutors CASCADE;
DROP FUNCTION IF EXISTS validate_thread_and_post_starters CASCADE;
DROP FUNCTION IF EXISTS cascade_weak_entities_when_modules_inactive CASCADE;
DROP FUNCTION IF EXISTS set_professor_courses_to_inactive_professors_delete CASCADE;
DROP FUNCTION IF EXISTS set_professor_courses_to_inactive_teaches_delete CASCADE;
DROP FUNCTION IF EXISTS check_obsolete_courses_and_cleanup CASCADE;
DROP FUNCTION IF EXISTS validate_scores_marks_within_max_marks CASCADE;

CREATE FUNCTION validate_course_enrollment()
RETURNS TRIGGER AS
$$
BEGIN
	IF 
		-- checks if student has passed course before
		NOT EXISTS (
			SELECT 1 FROM Passed P 
			WHERE P.suname = NEW.suname 
			AND P.module_code = NEW.module_code
			)
		AND 
		-- checks whether course quota is sufficient and 
		EXISTS (
			SELECT 1 
			FROM Enrolls E 
			WHERE E.module_code = NEW.module_code 
			HAVING COUNT(*) < (
				SELECT quota 
				FROM Courses C 
				WHERE C.module_code = NEW.module_code
				AND C.is_active
				)
			)
		AND
		-- checks whether student exceeds max modular credits and course is active
		EXISTS (
			SELECT 1 FROM Students S 
			WHERE S.username = NEW.suname AND (
				(SELECT COALESCE(
					(SELECT SUM(C.credits) 
					FROM Courses C 
					NATURAL JOIN Enrolls E
					WHERE E.suname = NEW.suname
					AND C.is_active
					), 0)
				) + (
					SELECT credits 
					FROM Courses C 
					WHERE C.module_code = NEW.module_code
					AND C.is_active
					) 
				<= S.max_module_credits
				)
			)
	THEN
		-- removes from request if student requested for it and put to enrolls table
		DELETE FROM Requests R 
		WHERE R.suname = NEW.suname 
		AND R.module_code = NEW.module_code;
		RETURN NEW;
	ELSE
		RETURN NULL;
	END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER validate_course_enrollment
BEFORE INSERT
ON Enrolls
FOR EACH ROW
EXECUTE PROCEDURE validate_course_enrollment();

CREATE FUNCTION validate_passed_students()
RETURNS TRIGGER AS
$$
BEGIN
	IF 
		-- checks whether they are enrolled in the course
		EXISTS (
			SELECT 1 FROM Enrolls E 
			WHERE E.suname = NEW.suname 
			AND E.module_code = NEW.module_code
			)
	THEN
		-- removes from enrolls table if passed
		DELETE FROM Enrolls E WHERE E.suname = NEW.suname AND E.module_code = NEW.module_code;
		RETURN NEW;
	ELSE
		RETURN NULL;
	END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER validate_passed_students
BEFORE INSERT OR UPDATE
ON Passed
FOR EACH ROW
EXECUTE PROCEDURE validate_passed_students();

CREATE FUNCTION validate_course_requests()
RETURNS TRIGGER AS
$$
BEGIN
	IF 
		-- checks if student has passed course before
		EXISTS (
			SELECT 1 FROM Passed P 
			WHERE P.suname = NEW.suname 
			AND P.module_code = NEW.module_code
			) 
		OR 
		-- checks if student is currently already enrolled in the course
		EXISTS (
			SELECT 1 FROM Enrolls E
			WHERE E.suname = NEW.suname
			AND E.module_code = NEW.module_code
		)
		OR
		-- checks whether student exceeds max modular credits and course is active
		NOT EXISTS (
			SELECT 1 FROM Students S 
			WHERE S.username = NEW.suname AND (
				(SELECT COALESCE(
					(SELECT SUM(C.credits) 
					FROM Courses C 
					NATURAL JOIN Enrolls E
					WHERE E.suname = NEW.suname
					AND C.is_active
					), 0)
				) + (
					SELECT credits 
					FROM Courses C 
					WHERE C.module_code = NEW.module_code
					AND C.is_active
					) 
				<= S.max_module_credits
				)
			)
	THEN
		RETURN NULL;
	ELSE
		RETURN NEW;
	END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER validate_course_requests
BEFORE INSERT OR UPDATE
ON Requests
FOR EACH ROW
EXECUTE PROCEDURE validate_course_requests();

CREATE FUNCTION validate_tutors()
RETURNS TRIGGER AS
$$
BEGIN
	IF 
		-- checks if tutor has passed course before and obtained >= 4.5
		EXISTS (
			SELECT 1 FROM Passed P 
			WHERE P.suname = NEW.suname 
			AND P.module_code = NEW.module_code
			AND P.grade >= 4.5
			) 
	THEN
		RETURN NEW;
	ELSE
		RETURN NULL;
	END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER validate_tutors
BEFORE INSERT OR UPDATE
ON Tutors
FOR EACH ROW
EXECUTE PROCEDURE validate_tutors();

CREATE FUNCTION validate_thread_and_post_starters()
RETURNS TRIGGER AS
$$
BEGIN
	IF 
		-- checks if thread/post starter is as student of the course
		EXISTS (
			SELECT 1 FROM Enrolls E 	
			WHERE E.suname = NEW.uname 
			AND E.module_code = NEW.module_code
			) 
		OR 
		-- checks if thread/post starter is a tutor of the course
		EXISTS (
			SELECT 1 FROM Tutors T 	
			WHERE T.suname = NEW.uname 
			AND T.module_code = NEW.module_code
			) 
		OR 
		-- checks if thread/post starter is the professor of this course
		EXISTS (
			SELECT 1 FROM Teaches T 
			WHERE T.puname = NEW.uname 
			AND T.module_code = NEW.module_code
			)
	THEN
		RETURN NEW;
	ELSE
		RETURN NULL;
	END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER validate_thread_starters
BEFORE INSERT OR UPDATE
ON Threads
FOR EACH ROW
EXECUTE PROCEDURE validate_thread_and_post_starters();

CREATE TRIGGER validate_post_starters
BEFORE INSERT OR UPDATE
ON Posts
FOR EACH ROW
EXECUTE PROCEDURE validate_thread_and_post_starters();

CREATE FUNCTION validate_scores_marks_within_max_marks()
RETURNS TRIGGER AS
$$
BEGIN
	IF 
		-- checks if new entry score is within assessment max marks
		NEW.score <= (
			SELECT A.max_mark 
			FROM Assessment A 
			WHERE A.module_code = NEW.module_code
			AND A.title = NEW.title
			)
	THEN
		RETURN NEW;
	ELSE
		-- updates to max marks should the new entry score exceeds max marks
		UPDATE Scores S SET score = (
			SELECT A.max_mark 
			FROM Assessment A 
			WHERE A.module_code = NEW.module_code
			AND A.title = NEW.title
			)
		WHERE NEW.suname = S.suname
		AND NEW.module_code = S.module_code;
		RETURN NULL;
	END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER validate_scores_marks_within_max_marks
BEFORE INSERT OR UPDATE
ON Scores
FOR EACH ROW
EXECUTE PROCEDURE validate_scores_marks_within_max_marks();

CREATE FUNCTION cascade_weak_entities_when_modules_inactive()
RETURNS TRIGGER AS
$$
BEGIN
	IF 
		-- if course is updated to inactive
		NEW.is_active = false
	THEN
		-- cascade delete, want to retain course info for passed table
		DELETE FROM Forums F 
		WHERE F.module_code = NEW.module_code;
		DELETE FROM Assessment A
		WHERE A.module_code = NEW.module_code;
		DELETE FROM Announcements A
		WHERE A.module_code = NEW.module_code;
		DELETE FROM Tutors T
		WHERE T.module_code = NEW.module_code;
		DELETE FROM Teaches T
		WHERE T.module_code = NEW.module_code;
		DELETE FROM Enrolls E
		WHERE E.module_code = NEW.module_code;
		DELETE FROM Requests R
		WHERE R.module_code = NEW.module_code;
		RETURN NEW;
	ELSE
		RETURN NULL;
	END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER cascade_weak_entities_when_modules_inactive
AFTER INSERT OR UPDATE
ON Courses
FOR EACH ROW
EXECUTE PROCEDURE cascade_weak_entities_when_modules_inactive();

CREATE FUNCTION set_professor_courses_to_inactive_professors_delete()
RETURNS TRIGGER AS
$$
BEGIN
	IF 
		-- if professor is the only teacher for his courses
		EXISTS (
			SELECT 1 
			FROM Teaches T 
			WHERE T.puname = OLD.username
			GROUP BY T.module_code
			HAVING COUNT(T.module_code) =
			(SELECT COUNT(*)
				FROM Teaches 
				WHERE module_code = T.module_code)
			)
	THEN
		-- set to inactive and delete weak entities of the courses
		UPDATE Courses C SET is_active = false
		WHERE C.module_code IN (
			SELECT T.module_code
			FROM Teaches T 
			WHERE T.puname = OLD.username
			GROUP BY T.module_code
			HAVING COUNT(T.module_code) =
			(SELECT COUNT(*)
				FROM Teaches 
				WHERE module_code = T.module_code)
			);
		DELETE FROM Teaches T
		WHERE T.puname = OLD.username;
		RETURN OLD;
	ELSE
		-- otherwise delete as per normal
		DELETE FROM Teaches T
		WHERE T.puname = OLD.username;
		RETURN OLD;
	END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER set_professor_courses_to_inactive_professors_delete
BEFORE DELETE
ON Professors
FOR EACH ROW
EXECUTE PROCEDURE set_professor_courses_to_inactive_professors_delete();

CREATE FUNCTION set_professor_courses_to_inactive_teaches_delete()
RETURNS TRIGGER AS
$$
BEGIN
	IF 
		-- if professor is the only teacher for his courses
		NOT EXISTS (
			SELECT 1 
			FROM Teaches T 
			WHERE T.module_code = OLD.module_code
			)
	THEN
		-- set to inactive and delete weak entities of the courses
		UPDATE Courses C SET is_active = false
		WHERE C.module_code = OLD.module_code;
		RETURN OLD;
	ELSE
		RETURN OLD;
	END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER set_professor_courses_to_inactive_teaches_delete
AFTER DELETE
ON Teaches
FOR EACH ROW
EXECUTE PROCEDURE set_professor_courses_to_inactive_teaches_delete();

CREATE FUNCTION check_obsolete_courses_and_cleanup()
RETURNS TRIGGER AS
$$
BEGIN
	IF 
		-- check if deleted student module no longer in passed, no more foreign key dependency
		NOT EXISTS (
			SELECT 1 
			FROM Passed P 
			WHERE P.module_code = OLD.module_code
			)
		AND 
		-- and check if deleted student module has no other students enrolled in it
		NOT EXISTS (
			SELECT 1 
			FROM Enrolls E
			WHERE E.module_code = OLD.module_code
			)
	THEN
		-- perform safe delete of the obsolete course
		DELETE FROM Courses C
		WHERE C.module_code = OLD.module_code;
		RETURN OLD;
	ELSE
		RETURN OLD;
	END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER check_obsolete_courses_and_cleanup
AFTER DELETE
ON Passed
FOR EACH ROW
EXECUTE PROCEDURE check_obsolete_courses_and_cleanup();
