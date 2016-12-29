use RoboBarTender; 


/* #################### View ################## */

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
	FROM TempDrinks ;

	SELECT T.Drink_id,
			ING.Name, 
	        ING.Volume, 
	        ING.PumpNumber,
	        ING.Percentage,
	        ING.GPIOPinNumber,
	        ING.FlowRate
	FROM TempDrinks T 
	INNER JOIN vw_Ingredient ING on T.Drink_id = ING.Drink_id;

	DROP TABLE TempDrinks;
	
END //
DELIMITER ;
