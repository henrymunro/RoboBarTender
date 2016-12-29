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
	    FlowRate
    FROM vw_Pump
    WHERE EndDate is NULL
    ORDER BY PumpNumber;
	
END //
DELIMITER ;
