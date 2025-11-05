#!/bin/bash

COMMAND=$1
shift
ARGUMENTS=${@}

shell() {
	docker compose run --rm workspace bash
}

cmd() {
	docker compose run --rm workspace ${@}
}

usage() {
	echo "Usage: $0 [COMMAND] [ARGUMENTS]"
	echo "Commands:"
	echo "  shell     Open a shell in the development container"
	echo "  cmd       Run a command in the development container"
}

fn_exists() {
    type $1 2>/dev/null | grep -q 'is a function'
}

fn_exists $COMMAND
if [ $? -eq 0 ]; then
	$COMMAND $ARGUMENTS
else
	usage
fi
