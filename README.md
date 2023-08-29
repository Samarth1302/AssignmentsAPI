Classroom Assignments API built for users (students and teachers) to facilitate assignment submission and grading process. Teachers create, update, delete assignments and students can post their submissions based on the assignment posted. Teachers can then view submissions to created assignments and students can review all of their submissions. All the requests require JWT token (bearer token) for authentication of user.

Usage- Replace http://127.0.0.1:3000 or http://localhost:3000 with https://assignments-api.onrender.com based on how you access the API. While using the docker image or hosted API service it is important to replace the URL path with the hosted URL and send requests only to that URL.

Hosted URL on Render- https://assignments-api.onrender.com

The documentation link of the API on Postman : https://documenter.getpostman.com/view/29367674/2s9Y5Ztg7a

Docker Image is available in DockerHub - https://hub.docker.com/r/samarthchauhan/classroom
or simply run the commands-

1. docker pull samarthchauhan/classroom
2. docker run -p 3000:3000 samarthchauhan/classroom

<!--
Some registered (username password role) for users are given below for testing-

person per123 student
par pa2 teacher
stude12 st23 student
jack j76 student
james jb student
wurtz qwe teacher
-->
