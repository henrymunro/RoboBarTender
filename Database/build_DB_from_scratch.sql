create database RoboBarTender;

SELECT 'CREATING USER';
CREATE USER 'RoboBarTender'@'%' IDENTIFIED BY 'some_pass';
GRANT EXECUTE ON RoboBarTender.* TO 'RoboBarTender'@'%';

use RoboBarTender;

SELECT 'BUILDING TABLES, VIEWS AND FUNCTIONS';
source RoboBarTender build tables.sql;


SELECT 'BUILDING DRINK PROCS';
source drinkProcs.sql;

SELECT 'BUILDING PUMP PROCS';
source pumpProcs.sql;

SELECT 'BUILDING CONFIG PROCS';
source configProcs.sql;



SELECT 'DONE!';
