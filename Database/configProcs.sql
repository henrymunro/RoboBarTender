use RoboBarTender; 


/* #################### View ################## */

DROP PROCEDURE IF EXISTS sp_GetApplicationStatus;
DELIMITER //
CREATE PROCEDURE sp_GetApplicationStatus()
BEGIN
	
	SELECT KillSwitch, 
			Pumping,
			CupInPlace
    FROM Config
  	LIMIT 1; 
	
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_UpdatePumpingStatus;
DELIMITER //
CREATE PROCEDURE sp_UpdatePumpingStatus(
	in isPumping int 
)
BEGIN
	
	UPDATE Config
	SET Pumping = isPumping;
	
END //
DELIMITER ;