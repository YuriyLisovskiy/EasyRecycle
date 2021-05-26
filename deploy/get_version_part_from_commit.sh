#!/usr/bin/env bash

set -e

COMMIT_MSG=$(git log -1 --pretty=%B)

if [[ -z "${COMMIT_MSG}" ]]; then
	echo "usage: $0 COMMIT_MSG" >&2
	exit 1
fi

if [[ "${COMMIT_MSG}" == *"[major]"* ]]; then
	echo -n "major"
elif [[ "${COMMIT_MSG}" == *"[minor]"* ]]; then
	echo -n "minor"
else
	echo -n "patch"
fi

