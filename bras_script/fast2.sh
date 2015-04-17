#!/bin/sh
BASE_DIR=$(cd "$(dirname "$0")"; pwd);
$BASE_DIR/set_user_meal.sh 172.21.4.101 gsta123 172.21.4.102 testing123 user3 qos6m
