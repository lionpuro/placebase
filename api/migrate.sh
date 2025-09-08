#!/bin/bash

ENV_FILE=".env"
source $ENV_FILE

DATABASE=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable
MIGRATIONS_DIR=./migrations

usage() {
	echo "Usage: $0 [COMMAND] [ARGUMENTS]"
	echo "Commands:"
	echo "  create       Create a new migration"
	echo "  up           Apply all up migrations"
	echo "  down         Apply N down migrations"
	echo "  force [V]    Set version V, but don't run migration (ignores dirty state)"
}

fn_exists() {
    type $1 2>/dev/null | grep -q 'is a function'
}

COMMAND=$1
shift
ARGUMENTS=${@}

# Base command

cmd() {
	docker run -u 1000:1000 --rm -it -v ${MIGRATIONS_DIR}:/migrations --network host migrate/migrate ${@}
}

# Commands

create() {
	read -p "Enter the sequence name: " SEQ
	cmd create -ext sql -dir /migrations -seq ${SEQ}
}

up() {
	cmd -path=/migrations -database "${DATABASE}" up
}

down() {
	read -p "Number of migrations you want to rollback (default: 1): " NUM; NUM=${NUM:-1}
	cmd -path=/migrations -database "${DATABASE}" down ${NUM}
}

force() {
	read -p "Enter the version to force: " VERSION; \
	cmd -path=/migrations -database "${DATABASE}" force ${VERSION}
}

# Run

fn_exists $COMMAND
if [ $? -eq 0 ]; then
	$COMMAND $ARGUMENTS
else
	usage
fi
