# CS2102 Project Group 36

Place the directory 'CS2102_Project' in the Desktop.
Do not close any terminals which you have opened in this README for the span of the testing.

# Database Setup
- Open 'CS2102_Project/pool.js'
- In lines 4 to 8, modify the 'user', 'host', 'database', 'password', and 'port' parameters to match your system's configuration 
- Save the file
- Open a command prompt terminal
- Run the following commands:
```
psql -U <PostgreSQL role>
<password>
CREATE DATABASE <value of 'database' parameter in 'CS2102_Project/pool.js'>
\c <value of 'database' parameter in 'CS2102_Project/pool.js'>
\i '<absolute path to 'CS2102_Project/lumischema.sql'>'
\i '<absolute path to 'CS2102_Project/mockdata.sql'>'
\q
```
# Run server
- In the same terminal, run the following commands:
```
cd Desktop/CS2102_Project
npm install
nodemon server
```
# Start application
- Open another command prompt terminal
- Run the following commands:
```
cd Desktop/CS2102_Project/client
npm install
npm start
```
# Login information
- There are two roles you can take on in our system, that of a student and a professor, the roles have differing functions and functions in the system
- For logging in as a student, from the mock data, there are 2 ready-made sample accounts that can be used, the respective usernames are 'E000001' and 'E000002' with 'password' as the password. 
- For logging in as a professor, from the mock data, there are 2 ready-made sample accounts that can be used, the respective usernames are 'A0000001' and 'A0000002' with 'password' as the password.
