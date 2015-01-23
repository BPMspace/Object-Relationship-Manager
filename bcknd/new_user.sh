#!/bin/bash
#create database

if [ $# != 2 ]
then
	echo "Usage: $0 <username> <password>"
	exit -1
fi

if [ ! -f users.db ]
then

sqlite3 users.db <<EOF
BEGIN TRANSACTION;
create TABLE users(username text PRIMARY KEY, password text NOT NULL);
COMMIT;
EOF

chmod a+rw users.db

echo "Created users.db"

fi

sqlite3 users.db <<EOF
BEGIN TRANSACTION;
INSERT OR REPLACE INTO users VALUES("$1","$2");
COMMIT;
EOF

mkdir db 2>/dev/null
chmod 777 db
chmod 777 ./

sqlite3 db/$1.db <<EOF
BEGIN TRANSACTION;
create TABLE attributes(key text PRIMARY KEY, data text NOT NULL);
create TABLE relations(key text PRIMARY KEY, data text NOT NULL);
create TABLE objects(key text PRIMARY KEY, data text NOT NULL);
create TABLE roblists(key text PRIMARY KEY, data text NOT NULL);
COMMIT;
EOF

chmod a+rw db/$1.db

echo Done
echo "***************WARNING***************"
echo " default file access is rw-rw-rw "
echo " change this and make only the "
echo " webserver rw-rw-r "

