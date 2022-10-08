#!/bin/bash
set -eu -o pipefail

actual="$(node index-cli.js '検索は次の言語でもご利用いただけます')"

expected='
[
  {
    "surface": "検索",
    "part_of_speech": [
      "名詞",
      "普通名詞",
      "サ変可能",
      "*",
      "*",
      "*"
    ],
    "normalized_form": "検索"
  },
  {
    "surface": "は",
    "part_of_speech": [
      "助詞",
      "係助詞",
      "*",
      "*",
      "*",
      "*"
    ],
    "normalized_form": "は"
  },
  {
    "surface": "次",
    "part_of_speech": [
      "名詞",
      "普通名詞",
      "一般",
      "*",
      "*",
      "*"
    ],
    "normalized_form": "次"
  },
  {
    "surface": "の",
    "part_of_speech": [
      "助詞",
      "格助詞",
      "*",
      "*",
      "*",
      "*"
    ],
    "normalized_form": "の"
  },
  {
    "surface": "言語",
    "part_of_speech": [
      "名詞",
      "普通名詞",
      "一般",
      "*",
      "*",
      "*"
    ],
    "normalized_form": "言語"
  },
  {
    "surface": "で",
    "part_of_speech": [
      "助詞",
      "格助詞",
      "*",
      "*",
      "*",
      "*"
    ],
    "normalized_form": "で"
  },
  {
    "surface": "も",
    "part_of_speech": [
      "助詞",
      "係助詞",
      "*",
      "*",
      "*",
      "*"
    ],
    "normalized_form": "も"
  },
  {
    "surface": "ご",
    "part_of_speech": [
      "接頭辞",
      "*",
      "*",
      "*",
      "*",
      "*"
    ],
    "normalized_form": "御"
  },
  {
    "surface": "利用",
    "part_of_speech": [
      "名詞",
      "普通名詞",
      "サ変可能",
      "*",
      "*",
      "*"
    ],
    "normalized_form": "利用"
  },
  {
    "surface": "いただけ",
    "part_of_speech": [
      "動詞",
      "非自立可能",
      "*",
      "*",
      "下一段-カ行",
      "連用形-一般"
    ],
    "normalized_form": "頂く"
  },
  {
    "surface": "ます",
    "part_of_speech": [
      "助動詞",
      "*",
      "*",
      "*",
      "助動詞-マス",
      "終止形-一般"
    ],
    "normalized_form": "ます"
  }
]
'

diff <(echo "$actual" | jq) <(echo "$expected" | jq)
