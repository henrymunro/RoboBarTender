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
