# Sword Health Backend Challenge

## How to build

1. Checkout and prepare infrastructure

<pre>
git clone https://github.com/kech37/sword-health-backend-challenge.git
cd sword-health-backend-challenge
docker-compose -f ./dockers/mysql-docker-compose.yml up -d
docker-compose -f ./dockers/rabbitmq-docker-compose.yml up -d
</pre>

2. Create _.env_ file in the project root diretory (_./sword-health-backend-challenge/_) with the following content

<pre>
log_level=trace
jwt_log_level=error

http_server_port=3000

database_host=127.0.0.1
database_port=3306
database_database=public
database_username=user
database_password=password
database_root_password=root-password
database_encryption_key=e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61

message_broker_host=127.0.0.1
message_broker_port=5672
message_broker_username=guest
message_broker_password=guest

token_secret=2412d4105fcb2b981225c2df34f846a5948915ee58d1c578376f58cd508dc6515dbeceb5c1ebf545bdcd5b2b8012e0f4bad74593814c279b249108e1ea18eb14
</pre>

3. Project install and database init

<pre>
npm run setup:dev
</pre>

## How to run

**⚠️ Before run:** Please check the API swagger (_./sword-health-backend-challenge/docks/swagger.yml_) to know the expected behaviour for each endpoint. **⚠️**

#### Run locally

`npm run start` or `npm run dev` for pretty.

#### Run as docker container

Check future improvents.

## Access tokens

**Manager #1** [id = fa634d9f-7a47-4efb-b432-812d2b449dd5]

<pre>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6ImZhNjM0ZDlmLTdhNDctNGVmYi1iNDMyLTgxMmQyYjQ0OWRkNSIsImlhdCI6MTY5NTkxODIzMn0.tMLUTqLfqryHjGfV-0mBl2Lh6htUPZujCU7IIhcj3uI</pre>

**Manager #2** [id = 31afbafc-bd8f-47c4-bd37-3e6e22f02da2]

<pre>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6IjMxYWZiYWZjLWJkOGYtNDdjNC1iZDM3LTNlNmUyMmYwMmRhMiIsImlhdCI6MTY5NjAzNTgyOX0.p_7fn0dcteIV_YU2Tz6le5pa6gwGc3h2FgT4cTMjLjs</pre>

**Technician #1** [id = 41f71b67-a18c-4374-87a4-b2ed044fdbde]

<pre>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6IjQxZjcxYjY3LWExOGMtNDM3NC04N2E0LWIyZWQwNDRmZGJkZSIsImlhdCI6MTY5NjAzNDg4NH0.aIiC6u7fplcfaRFAa7w5HVYOh7C6SAlHhWRbR19BwVk</pre>

**Technician #2** [id = 88686182-9b18-4556-b4bf-664a82bf06e5]

<pre>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6Ijg4Njg2MTgyLTliMTgtNDU1Ni1iNGJmLTY2NGE4MmJmMDZlNSIsImlhdCI6MTY5NjAzNTgyOX0.x6C2UWemuBOsW8vy-3mdMWMmnfSZCkeG6Lo8WvDAsFU</pre>

## Future improvements

- Better security: The API access security should be improved by using access tokens with expiring dates, rotating secret tokens, and implementing the possibility for the user to renew access tokens using a refresh token.

- Better permissions management: The implemented logic is very much tied to the Manager and Technician role, mainly because of the use of the `Utils.isManager()` and `Utils.isTechnician()` methods. In the future, better permission control should be implemented using the own CRUD and global CRUD permissions stored in the role table on the database.

- Better bad request feedback: When the request input data is not well formatted the request response will display a 400 Bad Request error explaining that the request input is not ok. This is not very useful because of the lack of verbosity to say which parameter is wrong.

- Better type checking: Instead of using custom type guards for each object, a good improvement would be to use a runtime validator (like `typia`) to validate objects using type tags that can be used to define what an object should be.

- Message broker gracefully stop: In the current implementation when the service connection is stopped it throws an unhandled _IllegalOperationError_ error. A future improvement should be to handle this error gracefully.

- Run as a container: At this moment it's possible to build and run the service using the provided Dockerfile but does not fully work because it doesn't have a connection to the database and message broker containers.

- Deathletter queue: Implement a system to archive and handle broker messages that do not follow the expected message model.
