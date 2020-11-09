#!/bin/sh
# wait-for-it.sh

while ! curl db:5432/ 2>&1 || grep '52'
do
  sleep 1
done

exec $@