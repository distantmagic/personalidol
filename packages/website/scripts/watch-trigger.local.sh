# notify-send "File change triggered build" "$1";
# curl -I -u mcharytoniuk:118ff7abfe6de54a40f576807d2cdfbc75 "http://localhost:8010/job/personalidol/job/packages/job/personalidol/build?token=5vg1Nrlqs6NMf2Amtgj0dJuPc7MHsLfB"

cd /home/mcharytoniuk/workspace/personalidol/packages/personalidol;

BUILD_NAME="personalidol/personalidol: make public"
NOTIFICATION_TIMEOUT_MS=3000

notify-send -t $NOTIFICATION_TIMEOUT_MS "$BUILD_NAME" "Triggered";
make public && notify-send -t $NOTIFICATION_TIMEOUT_MS "$BUILD_NAME" "Done" && exit;
notify-send -t $NOTIFICATION_TIMEOUT_MS "$BUILD_NAME" "Failure";
