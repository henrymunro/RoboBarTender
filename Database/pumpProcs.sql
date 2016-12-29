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



