#!/bin/sh
cd $HOME/Bureau

if [ "$1" = "on" ]
then
	sudo cp apt.conf /etc/apt/
else
	sudo rm -fv /etc/apt/apt.conf 
fi

exit 0 
