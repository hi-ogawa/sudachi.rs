#!/bin/bash
set -eu -o pipefail

cd "$(dirname "$0")"
mkdir -p data
cd data

dict_version="${dict_version:-"20220729"}"
dict_type="${dict_type:-"small"}"

dict_file="sudachi-dictionary-$dict_version-$dict_type"
dict_url="http://sudachi.s3-website-ap-northeast-1.amazonaws.com/sudachidict/$dict_file.zip"

wget -c "$dict_url"
unzip -o "$dict_file.zip"
