#!/usr/bin/env bash

# -- Standard Header --
echoerr() { printf "%s\n" "$*" >&2; }
export FUSEBIT_DEBUG=

# -- Optional Parameters --
AWS_PROFILE=${AWS_PROFILE:=default}

# -- Script --
set -e

export GEM_HOME=${HOME}/.gem
export PATH=${PATH}:${HOME}/.gem/bin

cd docs

echoerr Building docs...
gem install bundler jekyll
bundle install
bundle exec jekyll build --config _config.yml,_config_prod.yml

echoerr Uploading to ${S3_BUCKET}/docs...
aws s3 --profile=${AWS_PROFILE} sync --acl public-read --cache-control max-age=300 _site s3://${S3_BUCKET}/docs
