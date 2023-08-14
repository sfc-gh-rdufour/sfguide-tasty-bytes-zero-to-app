USE ROLE accountadmin;
USE DATABASE frostbyte_tasty_bytes;
USE SCHEMA frostbyte_tasty_bytes.app;

-- Create Role for the API
CREATE ROLE IF NOT EXISTS tasty_app_api_role;

-- Create Warehouse for the API
create or replace warehouse tasty_app_api_wh with 
    warehouse_size = 'xsmall' 
    warehouse_type = 'standard' 
    auto_suspend = 300 
    auto_resume = true 
    min_cluster_count = 1 
    max_cluster_count = 1 
    scaling_policy = 'standard';
GRANT USAGE ON WAREHOUSE tasty_app_api_wh TO ROLE tasty_app_api_role;

-- Create Users table for the Website
create or replace table users (
	user_id number(38,0) autoincrement,
	user_name varchar(16777216) not null,
	hashed_password varchar(16777216),
	franchise_id number(38,0),
	password_date timestamp_ntz(9),
	status boolean,
	unique (user_name)
);

 -- Add application users 
insert into users
    values
    (1,'user1','$2b$10$v0IoU/pokkiM13e.eayf1u3DkgtIBMGO1uRO2O.mlb2K2cLztV5vy',1,current_timestamp,TRUE),
    (2,'user2','$2b$10$e2TXM/kLlazbH1xl31SeOe6RTyfL3E9mE8sZZsU33AE52rO.u44JC',120,current_timestamp,TRUE),
    (3,'user3','$2b$10$WX4e1LAC.rAabBJV58RuKerEK4T/U4htgXrmedTa5oiGCWIRHwe0e',271,current_timestamp,TRUE);

-- Grant Access to the data for the API and Website
GRANT USAGE ON DATABASE frostbyte_tasty_bytes TO ROLE tasty_app_api_role;
GRANT USAGE ON SCHEMA frostbyte_tasty_bytes.app TO ROLE tasty_app_api_role;
GRANT SELECT ON ALL TABLES IN SCHEMA frostbyte_tasty_bytes.app TO tasty_app_api_role;

CREATE USER IF NOT EXISTS tasty_app_api_user
    PASSWORD = NULL
    LOGIN_NAME = 'tasty_app_api_user'
    DISPLAY_NAME = 'Tasty App API user'
    FIRST_NAME = 'Tasty App API user'
    LAST_NAME = 'Tasty App API user'
    MUST_CHANGE_PASSWORD = FALSE
    DISABLED = FALSE
    DEFAULT_WAREHOUSE = tasty_app_api_wh
    DEFAULT_NAMESPACE = frostbyte_tasty_bytes.app
    DEFAULT_ROLE = tasty_app_api_role
    RSA_PUBLIC_KEY = '***REPLACE_WITH_PUBLIC_KEY***'
    COMMENT = 'API user for Tasty App';

GRANT ROLE tasty_app_api_role TO USER tasty_app_api_user;
