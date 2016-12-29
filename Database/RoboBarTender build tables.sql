use RoboBarTender;

-- tables
-- Table: Drink

SELECT 'Tables' as 'BUILDING TABLES, VIEWS AND FUNCTIONS';

CREATE TABLE Users (
    User_id int NOT NULL AUTO_INCREMENT,
    Name varchar(500) NOT NULL,
    Image varchar(500),
    StartDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    EndDate datetime NULL,
    CONSTRAINT PK_User_id PRIMARY KEY (User_id)
);

CREATE TABLE Drink (
    Drink_id int NOT NULL AUTO_INCREMENT,
    Name varchar(500) NOT NULL,
    User_id int,
    Description varchar(2000),
    Image varchar(500),
    StartDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    EndDate datetime NULL,
    CONSTRAINT PK_Drink_id PRIMARY KEY (Drink_id)
);

-- Table: Ingredients
CREATE TABLE Ingredients (
    Ingredient_id int NOT NULL AUTO_INCREMENT,
    Name varchar(500) NOT NULL, 
    Drink_id int NOT NULL,
    Volume int NOT NULL,
    CONSTRAINT PK_Ingredient_id PRIMARY KEY (Ingredient_id)
);

-- Table: Pump
CREATE TABLE Pump (
    Pump_id int NOT NULL AUTO_INCREMENT,
    PumpNumber int NOT NULL,
    Name varchar(500) NOT NULL, 
    DisplayName varchar(1000),
    Percentage int NOT NULL DEFAULT 0,
    StartDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    EndDate datetime NULL,
    CONSTRAINT PK_Pump_id PRIMARY KEY (Pump_id)
);

-- Table: GPIOPump
CREATE TABLE GPIOPump (
    GPIOPump_id int NOT NULL AUTO_INCREMENT,
    PumpNumber int NOT NULL, 
    GPIOPinNumber int NOT NULL,
    PumpType_id int NOT NULL, 
    StartDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    EndDate datetime NULL,
    CONSTRAINT PK_GPIOPump_id PRIMARY KEY (GPIOPump_id)
);

-- Table: PumpType
CREATE TABLE PumpType (
    PumpType_id int NOT NULL AUTO_INCREMENT,
    PumpType varchar(500) NOT NULL, 
    FlowRate int NOT NULL, 
    StartDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    EndDate datetime NULL,
    CONSTRAINT PK_PumpType_id PRIMARY KEY (PumpType_id)
);


SELECT 'Views' as 'BUILDING TABLES, VIEWS AND FUNCTIONS';

-- views
CREATE VIEW vw_Ingredient AS
SELECT ING.Drink_id, 
        ING.Name, 
        ING.Volume, 
        P.PumpNumber,
        P.Percentage,
        GP.GPIOPinNumber,
        PT.FlowRate
FROM Ingredients ING 
LEFT JOIN Pump P on ING.Name = P.Name AND P.EndDate IS NULL
LEFT JOIN GPIOPump GP on GP.PumpNumber = P.PumpNumber AND GP.EndDate IS NULL
LEFT JOIN PumpType PT on PT.PumpType_id = GP.PumpType_id AND PT.EndDate IS NULL;


CREATE VIEW vw_Drink AS
SELECT D.Drink_id,
        D.Name AS DrinkName,
        U.User_id,
        U.Name AS AddedBy, 
        D.Description as DrinkDescription, 
        D.Image as DrinkImage,
        D.StartDate as DrinkStartDate,
        D.EndDate as DrinkEndDate,
        ING.Name as IngredientName,
        ING.Volume,
        ING.Percentage,
        ING.PumpNumber,
        ING.GPIOPinNumber,
        ING.FlowRate
FROM Drink D 
INNER JOIN vw_Ingredient ING on D.Drink_id = ING.Drink_id
LEFT JOIN Users U on U.User_id = D.User_id;


SELECT 'Foreign keys' as 'BUILDING TABLES, VIEWS AND FUNCTIONS';
-- foreign keys
-- Reference: FK_Ingredients_Drink (table: Ingredients)
ALTER TABLE Ingredients ADD CONSTRAINT FK_Ingredients_Drink FOREIGN KEY FK_Ingredients_Drink (Drink_id)
    REFERENCES Drink (Drink_id);

-- Reference: FK_GPIOPump_PumpType (table: GPIOPump)
ALTER TABLE GPIOPump ADD CONSTRAINT FK_GPIOPump_PumpType FOREIGN KEY FK_GPIOPump_PumpType (PumpType_id)
    REFERENCES PumpType (PumpType_id);



SELECT 'Populate Data' as 'BUILDING TABLES, VIEWS AND FUNCTIONS';

insert into PumpType(PumpType, FlowRate)
values('Standard', 100);

insert into GPIOPump(PumpNumber, GPIOPinNumber, PumpType_id)
values (1, 7, 1),
        (2, 8, 1);

insert into Pump(PumpNumber, Name, DisplayName, Percentage)
values(1, 'Rum', 'Capitan Morgans Rum', 40),
      (2, 'Coke', 'Coke', 0);

insert into Users(Name, Image)
values ('Henry', 'henry.jpg');

insert into Drink(Name, User_id, Description, Image)
values('Natwest', 1, 'A simple yet refreshing beverage', 'Rum_and_coke.jpg');

insert into Ingredients(Name, Drink_id, Volume)
values ('Rum', 1, 20),
        ('Coke', 1, 80);



-- End of file.
