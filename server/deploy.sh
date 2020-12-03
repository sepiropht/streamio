#!/bin/bash

echo What should the version be?
read VERSION


if [ ${ENV} = "PROD" ]; then 
    docker build -t sepiropht/lireddit:$VERSION .
    docker push sepiropht/lireddit:$VERSION
    ssh root@104.248.38.40 "docker pull sepiropht/lireddit:$VERSION && docker tag sepiropht/lireddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"
else 
    docker build -t sepiropht/lireddit:$VERSION -f Dockerfile.dev .
    docker push sepiropht/lireddit:$VERSION
    ssh root@104.248.38.40 "docker pull sepiropht/lireddit:$VERSION && docker tag sepiropht/lireddit:$VERSION dokku/streamio-dev:$VERSION && dokku deploy streamio-dev $VERSION"
fi
    