#!/bin/sh
BASE_DIR=$(cd "$(dirname "$0")"; pwd);
TMP_FILE=/tmp/`openssl rand -base64 20|tr -d '/'`
if [[  $# -lt 3 ]] ;then
    echo "Parama must be : \"   bras_IP   bras_user   bras_password\""
        exit;
fi

declare -A IP_LIST;
declare -A PROFILE_LIST;
STEP_NUM=0;
NOW_PROFILE="";

expect $BASE_DIR/expect_script/get_online_user.exp $* >$TMP_FILE

#cat $TMP_FILE >/tmp/file.txt
while read line; do
    if [[ $STEP_NUM == "0"  ]]; then
        echo $line |grep -q "Interface Username MAC address" && STEP_NUM=1;
    elif [[ $STEP_NUM == "1"  ]] ;then
        echo $line|grep -q  "^<H3C>*"  &&  STEP_NUM=2 || IP_LIST[`echo $line|awk '{print \$2}'`]=`echo $line|awk '{print \$4}'`;
    elif [[ $STEP_NUM == "2"  ]] ;then
        if [[ -n `echo $line|grep -q "User " &&echo 1`  ]];then
             PROFILE_LIST[`echo $line|awk '{print \$2}'|tr -d ':\r'`]=$NOW_PROFILE
        elif [[ -n `echo $line|grep -q "User-Profile: " &&echo 1`  ]];then
            NOW_PROFILE=`echo $line|awk '{print \$2}'|tr -d '\r'`;
        elif [[ -n `echo $line|grep -q "^<H3C>*" &&echo 1`  ]];then
            break;
        fi
    fi
done < $TMP_FILE

for user in ${!IP_LIST[*]} ;do
    echo $user,${IP_LIST[$user]},${PROFILE_LIST[$user]},
done

cat $TMP_FILE 1>&2 #把缓冲信息输出到第二频道

rm -rf $TMP_FILE
