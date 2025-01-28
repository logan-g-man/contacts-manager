-- Rebuild Script for COP4331 Database
DROP DATABASE IF EXISTS COP4331;


CREATE DATABASE COP4331;








USE COP4331;
CREATE TABLE Users (
    ID INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    Login VARCHAR(50) NOT NULL DEFAULT '',
    Password VARCHAR(50) NOT NULL DEFAULT '',
    PRIMARY KEY (ID)
) ENGINE=InnoDB;

CREATE TABLE Colors (
    ID INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL DEFAULT '',
    UserID INT NOT NULL DEFAULT '0',
    PRIMARY KEY (ID)
) ENGINE=InnoDB;

CREATE TABLE Contacts (
    ID INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    Phone VARCHAR(50) NOT NULL DEFAULT '',
    Email VARCHAR(50) NOT NULL DEFAULT '',
    UserID INT NOT NULL DEFAULT '0',
    PRIMARY KEY (ID)
) ENGINE=InnoDB;






INSERT INTO Users (FirstName, LastName, Login, Password) VALUES 
('Rick', 'Leinecker', 'RickL', 'COP4331'),
('Sam', 'Hill', 'SamH', 'Test'),
('Rick', 'Leinecker', 'RickL', '5832a71366768098cceb7095efb774f2'),
('Sam', 'Hill', 'SamH', '0cbc6611f5540bd0809a388dc95a615b');





-- Insert data into Colors table for UserID=1
INSERT INTO Colors (Name, UserID) VALUES 
('Blue', 1), ('White', 1), ('Black', 1), ('gray', 1), ('Magenta', 1), 
('Yellow', 1), ('Cyan', 1), ('Salmon', 1), ('Chartreuse', 1), ('Lime', 1), 
('Light Blue', 1), ('Light Gray', 1), ('Light Red', 1), ('Light Green', 1), 
('Chiffon', 1), ('Fuscia', 1), ('Brown', 1), ('Beige', 1);





-- Insert data into Colors table for UserID=3
INSERT INTO Colors (Name, UserID) VALUES 
('Blue', 3), ('White', 3), ('Black', 3), ('gray', 3), ('Magenta', 3), 
('Yellow', 3), ('Cyan', 3), ('Salmon', 3), ('Chartreuse', 3), ('Lime', 3), 
('Light Blue', 3), ('Light Gray', 3), ('Light Red', 3), ('Light Green', 3), 
('Chiffon', 3), ('Fuscia', 3), ('Brown', 3), ('Beige', 3);




CREATE USER 'TheBeast' IDENTIFIED BY 'WeLoveCOP4331';
GRANT ALL PRIVILEGES ON COP4331.* TO 'TheBeast'@'%';


-- TESTING
-- SELECT * FROM Users;
-- SELECT * FROM Colors;
-- SELECT * FROM Colors WHERE UserID = 1;
-- SELECT * FROM Colors WHERE UserID = 3;
