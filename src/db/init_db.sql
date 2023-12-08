-- Create the university database if it doesn't exist
-- npm install express mysql
-- run source path_to/init_db.sql; after installing mysql. Login to mysql command line or use mysql -u USERNAME -p
-- Once you see "mysql>" waiting for your command then run "source path_to/init_db.sql"

-- Create the MSUdb database if it doesn't exist
CREATE DATABASE IF NOT EXISTS university;
USE university;

-- Departments table with an assigned id : Ex.) CSE, EE, MA, etc.
CREATE TABLE IF NOT EXISTS Departments (
    department_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(10) NOT NULL
);

-- This table holds the different types of requirements a course could be Ex.) Math, science, free, technical, etc. electives
-- These requirement types are assigned an id which will be referenced in the ProgramRequirements table and courses table
CREATE TABLE IF NOT EXISTS RequirementType (
    requirement_type_id INT PRIMARY KEY,
    requirement VARCHAR(255)
);

-- Courses table contains the course code, name, department id, credits and assigns a course id:Ex.) CSE 2383, data struct, depid, 3
CREATE TABLE IF NOT EXISTS Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    credits INT NOT NULL,
    requirement_type_id INT,
    FOREIGN KEY(requirement_type_id) REFERENCES RequirementType(requirement_type_id),
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);



-- This table holds the courses that are avalaible or required to take by a department
-- It also contains the amount of credits of specified requirement the department requires
-- For example CSE requires 18 credits of technical electives, but also has mandatory courses such as MA 1713 Calculus I which
-- would hold the requirement type 'Individual'.
-- To summarize there will be entries of single courses with the type of requirement, but there will also be entries which
-- Serve as the departments requirements for each category like needing 18 tech elec credits.
CREATE TABLE IF NOT EXISTS ProgramRequirements (
    requirement_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    course_id INT,  -- Can be NULL if a group of courses fulfills the requirement
    requirement_type_id INT NOT NULL,
    required_credits INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    FOREIGN KEY (requirement_type_id) REFERENCES RequirementType(requirement_type_id)
);

-- Course prerequisites table which simply contains the course id of the course and its prerequisites
--did not get around to this
-- CREATE TABLE IF NOT EXISTS CoursePrerequisites (
--     course_id INT NOT NULL,
--     prerequisite_course_id INT NOT NULL,
--     FOREIGN KEY (course_id) REFERENCES Courses(course_id),
--     FOREIGN KEY (prerequisite_course_id) REFERENCES Courses(course_id)
-- );




-- General education requirements table which holds the university's requirements to graduate like needing Natural Science credits.
CREATE TABLE IF NOT EXISTS GeneralEducationRequirements (
    requirement_id INT AUTO_INCREMENT PRIMARY KEY,
    requirement_type_id INT NOT NULL,
    required_credits INT NOT NULL,
    FOREIGN KEY (requirement_type_id) REFERENCES RequirementType(requirement_type_id)
);


-- This table will hold the course id and department id for the recommended course and will also hold the recommended semester.
CREATE TABLE IF NOT EXISTS SemesterRecommendations (
    recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    course_id INT,
    requirement_type_id INT,
    recommended_semester INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    FOREIGN KEY (requirement_type_id) REFERENCES RequirementType(requirement_type_id)
);

-- The two commented tables below are to be used for substitutions, but I don't have enough time currently

-- CREATE TABLE IF NOT EXISTS CourseGroup (
--     group_id INT AUTO_INCREMENT PRIMARY KEY,
--     group_type ENUM('paired', 'choice', 'range', 'other') NOT NULL,
--     description VARCHAR(255)
-- );

-- CREATE TABLE IF NOT EXISTS CourseGroupDetails (
--     detail_id INT AUTO_INCREMENT PRIMARY KEY,
--     group_id INT,
--     course_id INT,
--     pair_id INT,
--     FOREIGN KEY (group_id) REFERENCES CourseGroup(group_id),
--     FOREIGN KEY (course_id) REFERENCES Courses(course_id)
-- );

