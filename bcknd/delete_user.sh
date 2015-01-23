#!/bin/bash
#create database

if [ $# != 1 ]
then
	echo "Usage: $0 <username>"
	exit -1
fi

echo '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
echo "      This script will delete user $1."
echo "   If this is not what you want hit CTRL-C NOW"
echo '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
sleep 2

sqlite3 users.db <<EOF
BEGIN TRANSACTION;
delete from users where username == "$1";
COMMIT;
EOF

echo "deleted user $i"

echo
echo
echo '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
echo "      Now I will delete that users data"
echo "   If this is not what you want hit CTRL-C NOW"
echo '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
sleep 2

if [ -f db/$1.db ]
then
	rm db/$1.db
fi
exit 1
