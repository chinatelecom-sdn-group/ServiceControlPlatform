#!/bin/sh
BASE_DIR=$(cd "$(dirname "$0")"; pwd);
TMP_FILE=/tmp/`openssl rand -base64 20|tr -d '/'`;
if [[  $# -lt 6 ]] ;then
    echo "Parama must be : \"   radius_IP   radius_password   bras_IP   radius_key   user_name   meal_name\""
        exit;
fi
expect $BASE_DIR/expect_script/set_user_meal.exp $* >$TMP_FILE
cat $TMP_FILE|grep -q "Accepted      : 1" $TMP_FILE &&echo success || echo fail

cat $TMP_FILE 1>&2 #把缓冲信息输出到第二频道
rm -rf $TMP_FILE