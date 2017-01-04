use RoboBarTender; 


/* #################### View ################## */

DROP PROCEDURE IF EXISTS sp_GetPumps;
DELIMITER //
CREATE PROCEDURE sp_GetPumps()
BEGIN
	
	SELECT Pump_id, 
	    PumpNumber,
	    PumpName,
	    DisplayName,
	    Percentage,
	    StartDate, 
	    GPIOPinNumber,
	    PumpType,
	    FlowRate,
	    0 AS PumpStatus
    FROM vw_Pump
    WHERE EndDate is NULL
    ORDER BY PumpNumber;
	
END //
DELIMITER ;



DROP PROCEDURE IF EXISTS sp_GetPumpsStatus;
DELIMITER //
CREATE PROCEDURE sp_GetPumpsStatus()
BEGIN
	
	SELECT P.Pump_id, 
	    PumpNumber,
	    PumpName,
	    DisplayName,
	    Percentage,
	    P.StartDate, 
	    GPIOPinNumber,
	    PumpType,
	    FlowRate,
	    CASE WHEN PS.Pump_id is not null then 1 ELSE 0 END as PumpStatus
    FROM vw_Pump P 
    LEFT JOIN PumpStatus PS on P.Pump_id = PS.Pump_id and PS.EndDate is null
    WHERE P.EndDate is NULL
    ORDER BY PumpNumber;
	
END //
DELIMITER ;



/* #################### INSERT  ################## */

DROP PROCEDURE IF EXISTS sp_UpdatePumpStatus;
DELIMITER //
CREATE PROCEDURE sp_UpdatePumpStatus(
	in pump_id_in int, 
	in status_id_in int
)
BEGIN
	
	/* Request to switch on Pump*/
	IF (status_id_in = 1) AND EXISTS (select * from PumpStatus where Pump_id = pump_id_in and EndDate IS NULL) THEN
		/* Request to switch pump on, but its already on*/
		SELECT Pump_id, StartDate 
		FROM PumpStatus;
	ELSEIF (status_id_in = 1) AND NOT EXISTS (select * from PumpStatus where Pump_id = pump_id_in and EndDate IS NULL) THEN
		/* If pump is not already on */ 
		    INSERT INTO PumpStatus(Pump_id)
		    VALUES (pump_id_in);
	ELSE 
		UPDATE PumpStatus
		SET EndDate = CURRENT_TIMESTAMP
		WHERE Pump_id = pump_id_in;
	END IF;
	
END //
DELIMITER ;



/* Proc to assign a new drink to a pump */
DROP PROCEDURE IF EXISTS sp_AddNewPump;
DELIMITER //
CREATE PROCEDURE sp_AddNewPump(
	in name_in varchar(500),
	in displayName_in varchar(1000),
	in percentage_in int, 
	in pumpNumber_in int
)
BEGIN
	
	IF EXISTS (SELECT * FROM Pump P 
			INNER JOIN GPIOPump GP on P.GPIOPump_id = GP.GPIOPump_id
			WHERE GP.PumpNumber = pumpNumber_in
				AND GP.EndDate IS NULL 
				AND P.EndDate IS NULL 
			) THEN 

		UPDATE Pump 
		SET EndDate = CURRENT_TIMESTAMP
		WHERE GPIOPump_id = (SELECT GPIOPump_id FROM GPIOPump WHERE PumpNumber = pumpNumber_in AND EndDate IS NULL)
			AND EndDate IS NULL;

		INSERT INTO Pump(Name, DisplayName, Percentage, GPIOPump_id)
		SELECT name_in, displayName_in, percentage_in, GPIOPump_id
		FROM GPIOPump 
		WHERE PumpNumber = pumpNumber_in
			AND EndDate IS NULL;


	ELSEIF (IFNULL((SELECT COUNT(*) FROM GPIOPump WHERE PumpNumber = pumpNumber_in and EndDate is NULL), 0) < 1) THEN
		INSERT INTO GPIOPump(PumpNumber, GPIOPinNumber, PumpType_id)
		SELECT pumpNumber_in, 2, 1;

		INSERT INTO Pump(Name, DisplayName, Percentage, GPIOPump_id)
		SELECT name_in, displayName_in, percentage_in, LAST_INSERT_ID();


	ELSE
		INSERT INTO Pump(Name, DisplayName, Percentage, GPIOPump_id)
		SELECT name_in, displayName_in, percentage_in, GPIOPump_id
		FROM GPIOPump 
		WHERE PumpNumber = pumpNumber_in
			AND EndDate IS NULL;
	END IF;
	
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_CeasePump;
DELIMITER //
CREATE PROCEDURE sp_CeasePump(in pumpNumber_in int)
BEGIN

	SELECT @GPIOPump_id := GP.GPIOPump_id 
	FROM Pump P 
	INNER JOIN GPIOPump GP on P.GPIOPump_id = GP.GPIOPump_id
	WHERE GP.PumpNumber = pumpNumber_in
		AND GP.EndDate IS NULL 
		AND P.EndDate IS NULL;
	
	IF (@GPIOPump_id IS NOT NULL) THEN 
		UPDATE Pump 
		SET EndDate = CURRENT_TIMESTAMP
		WHERE GPIOPump_id = @GPIOPump_id;
	ELSE 
		SELECT 'Pump number not set up' AS ErrorMessage;
	END IF;
	
END //
DELIMITER ;



