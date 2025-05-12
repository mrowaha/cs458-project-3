# CS458 Selenium Automated Testing

## Start Application
Run the following commands in succession
```
npm i
npm run dev
```
This should start the Nextjs application served at `localhost:3000`

## Example User Flow
`localhost:3000` will be redirected to the login page. User can either put in email/password credentials or sign in via Google. Valid users are stored in [a json file](/src/data.json). You can view the users from there and sign in with any one of them. Afterall successful login, user will be directed to the `/dashboard`

## Setting Up the Environment
Create a `.env.local` file in the root of the repository. You will require the following env variables for successful oauth integrations
```
GOOGLE_CLIENT_ID= <registered client id>
GOOGLE_CLIENT_SECRET= <corresponding client secret>
KEYCLOAK_CLIENT_ID= <will be explained>
KEYCLOAK_CLIENT_SECRET= ...
KEYCLOAK_ISSUER= ...
```

## Selenium Automated Tests
### Setting up the Environment
Create a `.env` file in [Selenium Tests](/tests//selenium/). You will need the following variables
```
KEYCLOAK_USERNAME= <will be explained>
KEYCLOAK_PASSWORD= ...
BROWSER= firefox or chrome
```
For the browser you choose, you will need to put the driver for the browser in [Selenium Tests](/tests//selenium/).

### Running the Test Suite
Cd to the [Selenium Tests](/tests/selenium/)
Create a python virtual environment; for example, you can use the following command
```
python -m venv env
```
Then activate the env and run
```
pip install -r requirements.txt
```

Then start the nextjs server in the root of the app
```
npm run dev
```

and then run the following command from the [Selenium Tests](/tests/selenium/)
```
python -m unittest main
```

And this will run the entire test suite

### Test Suite Breakdown
#### Incomplete Fields
Seleinum bot (hereon SO) attempts login without entering email and password. The application prompts corresponding error
```
python -m unittest main.AppTest.test_incomplete_fields
```
#### Unauthorized Login
SO files in incorrect credentials and attempts login. Application prompts error
```
python -m unittest main.AppTest.test_unauthorized_login
```
#### Successful Login
SO files in correct credentials and attempts login. Redirected to dashboard
```
python -m unittest main.AppTest.test_successful_login
```
#### Access Denied
SO redirects directly to dashboard. Access is denied
```
python -m unittest main.AppTest.test_access_denied
```
#### Max Attempts
SO tries 5 times for logging in and fails. Application prompts
```
python -m unittest main.AppTest.test_max_attempts
```
### OAuth Mock Flow with Keycloak
cd to [Keycloak Mock](/tests//mock//keycloak/) and run `docker-compose up`
Go to `localhost:8080`
Go to the admin portal and sign in with `email = admin, password = admin`
Create a new realm. E.g `cs458-project-oauth`
The `KEYCLOAK_ISSUER` will be `http://localhost:8080/realms/<realm-name>`
Go to the new realm. Create a client e.g. `cs-project-oauth-client`
The `KEYCLOAK_CLIENT_ID` will be this client name. And the `KEYCLOAK_CLIENT_SECRET` will be provided
Create a mock user. Set its password and optionally email. Password should be set to `NOT Temporary`
The `KEYCLOAK_USERNAME` will be this mock username and the `KEYCLOAK_PASSWORD` will be this password

Now run the test
```
python -m unittest main.AppTest.test_keycloak_flow
```