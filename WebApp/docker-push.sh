#!/bin/bash 

#Script to build and push a docker image

echo "BUILDING $NODE_ENV ENVIRONMENT";

echo "Building web pack bundle";
npm run webpack;

echo "Building docker image";
docker build -t henrymunro/robobartender:latest .; 

echo "Pushing docker image";
docker push henrymunro/robobartender;


