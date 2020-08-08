#!/usr/bin/env sh

build_dependencies() {
    local _BUILD_NAME=$1
    local _PACKAGE_SCOPE=$2
    local _PACKAGE_NAME=$3

    lerna ls \
        -a \
        --include-filtered-dependencies \
        --scope "@${_PACKAGE_SCOPE}/${_PACKAGE_NAME}" \
        --toposort \
        -p \
    | while read PACKAGE_DIRECTORY; do
        if [ "$PWD" = "$PACKAGE_DIRECTORY" ]; then
            break;
        fi

        _PACKAGE_NAME=$(basename "${PACKAGE_DIRECTORY}")

        notify "Building" "${_PACKAGE_SCOPE}/${_PACKAGE_NAME}" "Because of: ${_BUILD_NAME}"
        if $MAKE -C $PACKAGE_DIRECTORY build; then
            notify "Done" "${_PACKAGE_SCOPE}/${_PACKAGE_NAME}" "Because of: ${_BUILD_NAME}"
        else
            notify "Failure" "${_PACKAGE_SCOPE}/${_PACKAGE_NAME}" "Because of: ${_BUILD_NAME}"
            return 1;
        fi
    done;
}
