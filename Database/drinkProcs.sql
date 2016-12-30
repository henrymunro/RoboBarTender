use RoboBarTender; 


/* #################### View ################## */



DROP PROCEDURE IF EXISTS sp_GetDrinkIngredients;
DELIMITER //
CREATE PROCEDURE sp_GetDrinkIngredients( 
	in drink_id_in int
)
BEGIN


	/* Get Drink Info */ 
	SELECT Drink_id,
			DrinkName,
			TotalVolume * 1.0 / 100 as IngredientsVolumeRatio,
			@TotalVolume:= TotalVolume,
			CASE WHEN CanMake = 0 THEN 1 ELSE 0 END as CanMake
	FROM (
		SELECT D.Drink_id, 
			D.DrinkName, 			
	        SUM( CASE WHEN D.GPIOPinNumber IS NULL THEN 1 ELSE 0 END ) as CanMake,
	        SUM( D.Volume ) as TotalVolume
		FROM vw_Drink D 
		WHERE D.DrinkEndDate IS NULL 
			AND D.Drink_id = drink_id_in
		GROUP BY D.Drink_id, 
			D.DrinkName
	    ) subquery;

	/* Get Ingredient Info */ 
	SELECT ING.Drink_id,
			ING.Name, 
	        ING.Volume, 
	        ING.PumpNumber,
	        ING.Percentage,
	        ING.GPIOPinNumber,
	        ING.FlowRate,
	        ING.Volume * 1.0 / (ING.FlowRate * @TotalVolume) as PumpTime
	FROM vw_Ingredient ING 
	WHERE ING.Drink_id = drink_id_in;
	    

END //
DELIMITER ;




DROP PROCEDURE IF EXISTS sp_GetDrinks;
DELIMITER //
CREATE PROCEDURE sp_GetDrinks()
BEGIN
	
	DROP TABLE IF EXISTS TempDrinks;
	CREATE TEMPORARY TABLE TempDrinks (
	     Drink_id INT NOT NULL,
	     DrinkName varchar(500) NOT NULL,
	     AddedBy varchar(500) NOT NULL,
	     DrinkDescription varchar(2000),
	     DrinkImage varchar(500),
	     DrinkStartDate datetime,
	     CanMake INT NOT NULL DEFAULT 0,
	     IngredientsVolumeRatio DECIMAL(5,3),
	     AlcoholPercentage INT,
	     PourTime INT
	);

	INSERT INTO TempDrinks( Drink_id, DrinkName, AddedBy, DrinkDescription, DrinkImage, DrinkStartDate, CanMake, IngredientsVolumeRatio, AlcoholPercentage, PourTime )
	SELECT Drink_id,
		DrinkName,
		AddedBy,
		DrinkDescription,
		DrinkImage,
		DrinkStartDate,
		CASE WHEN CanMake = 0 THEN 1 ELSE 0 END as CanMake,
		TotalVolume * 1.0 / 100 as IngredientsVolumeRatio,
		AlcoholVolume * 100.0 / TotalVolume as AlcoholPercentage,
		MaxTime * 1.0 * 100 / TotalVolume as PourTime
	FROM (
		SELECT D.Drink_id, 
			D.DrinkName, 
			D.AddedBy,
	        D.DrinkDescription, 
	        D.DrinkImage,
	        D.DrinkStartDate,
	        SUM( CASE WHEN D.GPIOPinNumber IS NULL THEN 1 ELSE 0 END ) as CanMake,
	        SUM( D.Volume ) as TotalVolume,
	        SUM( IFNULL(D.Volume, 0) * IFNULL(D.Percentage*1.0/100, 0)) as AlcoholVolume,
	        MAX( IFNULL(D.Volume*1.0/100, 0) * 1.0 / D.FlowRate ) as MaxTime
		FROM vw_Drink D 
		WHERE D.DrinkEndDate IS NULL 
		GROUP BY D.Drink_id, 
			D.DrinkName, 
			D.AddedBy,
	        D.DrinkDescription, 
	        D.DrinkImage,
	        D.DrinkStartDate
	    ) subquery;


	SELECT * 
	FROM TempDrinks;

	SELECT T.Drink_id,
			ING.Name, 
	        ING.Volume, 
	        ING.PumpNumber,
	        ING.Percentage,
	        ING.GPIOPinNumber,
	        ING.FlowRate
	FROM TempDrinks T 
	INNER JOIN vw_Ingredient ING on T.Drink_id = ING.Drink_id;

	DROP TABLE IF EXISTS TempDrinks;
	
END //
DELIMITER ;




/* #################### Insert ################## */

DROP PROCEDURE IF EXISTS sp_CreateDrink;
DELIMITER //
CREATE PROCEDURE sp_CreateDrink(
	in name_in varchar(500),
	in description_in varchar(2000)
)
BEGIN
	
	INSERT INTO Drink(Name, Description)
	VALUES(name_in, description_in);

	SELECT LAST_INSERT_ID() as ID; 
	
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_AddDrinkIngredient;
DELIMITER //
CREATE PROCEDURE sp_AddDrinkIngredient(
	in drink_id_in int,
	in name_in varchar(500),
	in volume_in int
)
BEGIN
	
	INSERT INTO Ingredients(Name, Description)
	VALUES(drink_id_in, name_in, volume_in);
	
END //
DELIMITER ;


