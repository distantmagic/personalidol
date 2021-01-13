#!/usr/bin/env sh

NOTIFICATION_TIMEOUT_MS=3000;

notify() {
    # notify-send -t $NOTIFICATION_TIMEOUT_MS "${1}: ${2}" "${3}";
    echo "${1}: ${2}" "${3}";
}
