use RoboBarTender; 


/* #################### View ################## */



DROP PROCEDURE IF EXISTS sp_GetDrinkIngredients;
DELIMITER //
CREATE PROCEDURE sp_GetDrinkIngredients( 
	in drink_id_in varchar(400)
)
BEGIN
	
	SET @is_int = (SELECT drink_id_in REGEXP '^(-|\\+){0,1}([0-9]+\\.[0-9]*|[0-9]*\\.[0-9]+|[0-9]+)$');


	IF (@is_int = 1) THEN
		SET @drink_id_calc = drink_id_in;
	ELSE 
		SET @drink_id_calc = (SELECT Drink_id FROM vw_Drink WHERE DrinkEndDate IS NULL AND DrinkName = drink_id_in LIMIT 1);
	END IF;


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
			AND D.Drink_id = @drink_id_calc
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
	WHERE ING.Drink_id = @drink_id_calc;
	    

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
	     IngredientsVolumeRatio DECIMAL(7,3),
	     AlcoholPercentage INT,
	     PourTime DECIMAL(6,2)
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
	        MAX( (IFNULL(D.Volume*1.0/100, 0.0)) * 1.0 / D.FlowRate ) as MaxTime
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
	in description_in varchar(2000),
	in image_in varchar(500)
)
BEGIN
	
	INSERT INTO Drink(Name, User_id, Description, Image)
	VALUES(name_in, 1,description_in, image_in);

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
	
	INSERT INTO Ingredients(Drink_id, Name, Volume)
	VALUES(drink_id_in, name_in, volume_in);
	
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_LogDrinkRequest;
DELIMITER //
CREATE PROCEDURE sp_LogDrinkRequest(
	in drink_id_in int,
	in volume_in int,
	in user_in varchar(500),
	in source_in varchar(500),
	in status_in varchar(500),
	in statusReason_in varchar(500)
)
BEGIN
	
	IF (status_in = 'success') THEN
		SET @DrinkLogStatus_id = (SELECT DrinkLogStatus_id FROM DrinkLogStatus WHERE Status = 'success');
	ELSE 
		SET @DrinkLogStatus_id = (SELECT DrinkLogStatus_id FROM DrinkLogStatus WHERE Status = 'fail' AND Reason = statusReason_in);
	END IF;

	IF (@DrinkLogStatus_id IS NULL) THEN 
		SET @DrinkLogStatus_id = (SELECT DrinkLogStatus_id FROM DrinkLogStatus WHERE Status = 'fail' AND Reason = 'Other'); 
	END IF;
	
	

	INSERT INTO DrinkLog(Drink_id, Volume, User, Source, DrinkLogStatus_id)
	VALUES(drink_id_in, volume_in, user_in, source_in, @DrinkLogStatus_id);
	
END //
DELIMITER ;



