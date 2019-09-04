#!/bin/sh

if tmux ls | grep -q "personalidol"; then
    echo "Session is already opened.";
    echo "Use \`tmux attach -t personalidol\` to attach to the existing session.";
    echo "Use \`tmux kill-session -t personalidol\` to kill the session, then rerun this script.";
    exit 1;
fi

tmux new-session -s personalidol
tmux new-window "personalidol:start" -s personalidol
