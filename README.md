
# SWAY
![Logo](https://imgtr.ee/images/2023/10/23/14cde60510757789286b05a046db61ec.png)

sway is a real time chat application that uses socket io and powerful mern stack to base its backend of, it can connect with individuals who are signed up on sway!




## Features

- search users and connect with them
- online status and typing indicators
- send files (supports gif/png/jpeg)
- emoji picker
- Jason Web Token to authenticate using cookies,


## Tech Stack

technologies that have been used

- socketio
- MongoDb
- Express.js
- React.js
- Node.js
- tailwind CSS
- Jason Web Token
- Cloudinary
- bcrypt
- redux
- moment

## Installation and run locally for frontend

Install SWAY with npm

```bash
  cd app
  npm install   
  npm run dev
```


## backend

```bash  
  cd server
  npm install 
  npm start
```
## .env file


define a mongo DB url, that was provided by mongoose connection setup

```
MONGO_URL = ***************************
```

Jason web token secret key
```
JWT_SECRET = ****
```