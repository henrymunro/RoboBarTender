#!/bin/bash 

#Script to build and push a docker image

echo "BUILDING $NODE_ENV ENVIRONMENT";

APP=robobartender

if [ "$NODE_ENV" == "production" ] || [ "$NODE_ENV" == "staging" ] || [ "$NODE_ENV" == "development" ]  ; then
	echo "Building web pack bundle";
	npm run webpack;

	echo "Building docker image";
	docker build -t henrymunro/${NODE_ENV}.${APP}:latest .; 

	echo "Pushing docker image";
	docker push henrymunro/${NODE_ENV}.${APP};
else 
	echo "ENVIROMMENT NOT RECOGNISED"
fi




