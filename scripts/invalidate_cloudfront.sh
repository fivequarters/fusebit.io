#!/usr/bin/env bash

# -- Standard Header --
echoerr() { printf "%s\n" "$*" >&2; }
export FUSEBIT_DEBUG=

# -- Optional Parameters --
AWS_PROFILE=${AWS_PROFILE:=default}

# -- Script --
set -e

aws cloudfront create-invalidation --profile=${AWS_PROFILE} --distribution-id ${CLOUDFRONT_ID} --paths '/*'

