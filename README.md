# Sword Health Backend Challenges

## How to build

<pre>
git clone https://github.com/kech37/sword-health-backend-challenge.git
cd sword-health-backend-challenge
docker-compose -f ./dockers/mysql-docker-compose.yml up -d
docker-compose -f ./dockers/rabbitmq-docker-compose.yml up -d
npm run setup:dev
npm run start
</pre>

## How to run

<pre>npm run start</pre>

or

<pre>npm run dev</pre>

for pretty logs

## Access tokens

**Manager #1** [id = fa634d9f-7a47-4efb-b432-812d2b449dd5]

<pre>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6ImZhNjM0ZDlmLTdhNDctNGVmYi1iNDMyLTgxMmQyYjQ0OWRkNSIsImlhdCI6MTY5NTkxODIzMn0.tMLUTqLfqryHjGfV-0mBl2Lh6htUPZujCU7IIhcj3uI</pre>

**Manager #2** [id = 31afbafc-bd8f-47c4-bd37-3e6e22f02da2]

<pre>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6IjMxYWZiYWZjLWJkOGYtNDdjNC1iZDM3LTNlNmUyMmYwMmRhMiIsImlhdCI6MTY5NjAzNTgyOX0.p_7fn0dcteIV_YU2Tz6le5pa6gwGc3h2FgT4cTMjLjs</pre>

**Technician #1** [id = 41f71b67-a18c-4374-87a4-b2ed044fdbde]

<pre>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6IjQxZjcxYjY3LWExOGMtNDM3NC04N2E0LWIyZWQwNDRmZGJkZSIsImlhdCI6MTY5NjAzNDg4NH0.aIiC6u7fplcfaRFAa7w5HVYOh7C6SAlHhWRbR19BwVk</pre>

**Technician #2** [id = 88686182-9b18-4556-b4bf-664a82bf06e5]

<pre>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6Ijg4Njg2MTgyLTliMTgtNDU1Ni1iNGJmLTY2NGE4MmJmMDZlNSIsImlhdCI6MTY5NjAzNTgyOX0.x6C2UWemuBOsW8vy-3mdMWMmnfSZCkeG6Lo8WvDAsFU</pre>
