# sword-health-backend-challenge

Sword Health Backend Challenge

## How to run

git clone https://github.com/kech37/sword-health-backend-challenge.git
cd sword-health-backend-challenge
docker-compose -f ./dockers/mysql-docker-compose.yml up -d
docker-compose -f ./dockers/rabbitmq-docker-compose.yml up -d
npm run setup:dev
npm run start

## Access tokens:

### Manager #1

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6ImZhNjM0ZDlmLTdhNDctNGVmYi1iNDMyLTgxMmQyYjQ0OWRkNSIsImlhdCI6MTY5NTkxODIzMn0.tMLUTqLfqryHjGfV-0mBl2Lh6htUPZujCU7IIhcj3uI

### Manager #2

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6IjMxYWZiYWZjLWJkOGYtNDdjNC1iZDM3LTNlNmUyMmYwMmRhMiIsImlhdCI6MTY5NjAzNTgyOX0.p_7fn0dcteIV_YU2Tz6le5pa6gwGc3h2FgT4cTMjLjs

### Technician #1

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6IjQxZjcxYjY3LWExOGMtNDM3NC04N2E0LWIyZWQwNDRmZGJkZSIsImlhdCI6MTY5NjAzNDg4NH0.aIiC6u7fplcfaRFAa7w5HVYOh7C6SAlHhWRbR19BwVk

### Technician #2

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6Ijg4Njg2MTgyLTliMTgtNDU1Ni1iNGJmLTY2NGE4MmJmMDZlNSIsImlhdCI6MTY5NjAzNTgyOX0.x6C2UWemuBOsW8vy-3mdMWMmnfSZCkeG6Lo8WvDAsFU
