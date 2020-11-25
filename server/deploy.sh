#!/bin/bash

echo What should the version be?
read VERSION

docker build -t sepiropht/lireddit:$VERSION .
docker push sepiropht/lireddit:$VERSION
ssh root@104.248.38.40 "docker pull sepiropht/lireddit:$VERSION && docker tag sepiropht/lireddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"