# Installation Guide

## Assumptions

- This guide assumes you have knowledge of servers, command line, SQL/databases, and how to work with hidden files.

## Software Installation

- Install `node.js` and `npm`: https://nodejs.org/en/download
  - You should have at least node v18+ and npm v9+.
  - You can check your versions by using `node -v` and `npm -v` in a terminal or command window.
  - You may also use yarn, but this guide uses npm.
- Install `blitzjs`: `npm install -g blitz` in a terminal/command window. Check your version is at least v2+ by using `blitz -v` in a command window.

- Ensure that you have a local postgres service running on your computer. To install see: [https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database). Be sure to write down the superuser information as you are installing the setup.

  - You may use other databases, but will need to modify the provided code for their implementation.

- Create the databases for STAPLE. Go to terminal and use: https://www.tutorialspoint.com/postgresql/postgresql_environment.htm
  - Note that all lines that start with # are comments for explanation.

```
# get into postgres
psql -U postgres
# enter your password for superuser when prompted
CREATE DATABASE staple;
CREATE DATABASE staple_test;
```

- Create a user with appropriate privileges after postgres installation. While in the terminal and postgres, create a new user: https://www.tutorialspoint.com/postgresql/postgresql_privileges.htm. Change out `username` and `password` (be sure to leave the quotes!) for your desired user.

```
CREATE USER username WITH PASSWORD 'password';

GRANT ALL ON SCHEMA public TO username;
```

- Clone or copy this github repository on to your local computer.

- Copy the `.env` file and rename it `.env.local`. You may need to turn on settings to see these hidden files on your machine.

- Ensure the `.env.local` file has required environment variables by adding the following line and changing the <YOUR_DB_USERNAME> to `username:password`.

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/staple
```

- Copy the `.env.test` file and rename `.env.test.local`.

- Ensure the `.env.test.local` file has required environment variables in the same way you did above.

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/staple_test
```

9. In a terminal window, go to the folder you cloned this repository, and type the following to install the packages and create the databases needed for the application.

```
# to install all packages for staple
npm install
# install tailwind css
blitz install tailwind
# install daisyui
npm i -D daisyui@latest
# to create database with the right set up
blitz prisma migrate dev
```

## Starting the App - Local Testing

- In a terminal window, go to the folder you cloned this repository and type:

```
blitz dev
```

- Open (usually) [http://localhost:3000](http://localhost:3000) (or whatever it says for localhost in the terminal) with your browser to see the result.

## Starting the App - Production

- In a terminal window, go to the folder you cloned this repository and type:

```
blitz build
```

- This step may produce errors in the build. You will need to fix these error before running the application. We provide a list of common issues here XXX.

- Create a service. Generally, you might consider putting it here: `/etc/systemd/system/` on a linux machine. We've named the file `blizt.service` as an example creating it using `nano`. Tutorial for those who do not know how to do this: https://www.digitalocean.com/community/tutorials/how-to-configure-a-linux-service-to-start-automatically-after-a-crash-or-reboot-part-1-practical-examples

Example file structure:

```
[Unit]
Description=Starts the CogLab Blitz service.
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/html/STAPLE
ExecStart=/usr/local/bin/blitz start
Restart=always

[Install]
WantedBy=default.target
```

- Commands:
  - stop: `sudo systemctl stop blitz`
  - start: `sudo systemctl start blitz`
  - restart: `sudo systemctl restart blitz`
  - reload: `sudo systemctl reload blitz`
  - disable: `sudo systemctl disable blitz`
  - re-enable: `sudo systemctl enable blitz`
  - status: `sudo systemctl status blitz`
  - reset: `sudo systemctl reset-failed blitz`

And this last one is important to know. Sometimes if a service fails to start, and tries to restart again several times in a row, systemd will kill it and prevent it from starting again to protect the OS from thrashing. If you ever see a status that says it failed too many times, run this command to clear the block. And then use the start command to run it again.

_Many thanks to Scott B. for setting this up and giving instructions_.
