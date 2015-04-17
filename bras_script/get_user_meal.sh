#!/bin/sh
BASE_DIR=$(cd "$(dirname "$0")"; pwd);
TMP_FILE=/tmp/`openssl rand -base64 20|tr -d '/'`
if [[  $# -lt 4 ]] ;then
    echo "Parama must be : \"   bras_IP   bras_user   bras_password    user_name\""
        exit;
fi
expect $BASE_DIR/expect_script/get_user_meal.exp $* >$TMP_FILE
cat $TMP_FILE|grep "User profile"|awk '{print $3}'

cat $TMP_FILE 1>&2 #把缓冲信息输出到第二频道
rm -rf $TMP_FILE