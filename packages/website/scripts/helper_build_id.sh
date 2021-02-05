#!/usr/bin/env sh

GIT_LAST_COMMIT_ID=$(git log --format="%H" -n 1);

git diff-index --quiet HEAD;

GIT_HAS_CHANGES=$?;

BUILD_ID_APPEND="";

if [ $GIT_HAS_CHANGES ]; then
    # Append current timestamp if GIT has changes. It means that the project is
    # most probably under development now.
    BUILD_ID_APPEND="_$( date "+%s" )";
fi

BUILD_ID="${GIT_LAST_COMMIT_ID}${BUILD_ID_APPEND}";

echo $BUILD_ID
