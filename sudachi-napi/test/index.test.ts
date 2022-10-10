import { describe, expect, it } from "vitest";
import { SudachiJs } from "../index";

describe("SudachiJs", () => {
  it("basic", () => {
    const sudachi = SudachiJs.create(
      "../resources/sudachi.json",
      "../resources",
      "../sudachi-wasm/packages/cli/data/sudachi-dictionary-20220729/system_small.dic"
    );
    expect(
      sudachi.run("検索は次の言語でもご利用いただけます")
    ).toMatchInlineSnapshot(`
      [
        {
          "normalizedForm": "検索",
          "partOfSpeech": [
            "名詞",
            "普通名詞",
            "サ変可能",
            "*",
            "*",
            "*",
          ],
          "surface": "検索",
        },
        {
          "normalizedForm": "は",
          "partOfSpeech": [
            "助詞",
            "係助詞",
            "*",
            "*",
            "*",
            "*",
          ],
          "surface": "は",
        },
        {
          "normalizedForm": "次",
          "partOfSpeech": [
            "名詞",
            "普通名詞",
            "一般",
            "*",
            "*",
            "*",
          ],
          "surface": "次",
        },
        {
          "normalizedForm": "の",
          "partOfSpeech": [
            "助詞",
            "格助詞",
            "*",
            "*",
            "*",
            "*",
          ],
          "surface": "の",
        },
        {
          "normalizedForm": "言語",
          "partOfSpeech": [
            "名詞",
            "普通名詞",
            "一般",
            "*",
            "*",
            "*",
          ],
          "surface": "言語",
        },
        {
          "normalizedForm": "で",
          "partOfSpeech": [
            "助詞",
            "格助詞",
            "*",
            "*",
            "*",
            "*",
          ],
          "surface": "で",
        },
        {
          "normalizedForm": "も",
          "partOfSpeech": [
            "助詞",
            "係助詞",
            "*",
            "*",
            "*",
            "*",
          ],
          "surface": "も",
        },
        {
          "normalizedForm": "御",
          "partOfSpeech": [
            "接頭辞",
            "*",
            "*",
            "*",
            "*",
            "*",
          ],
          "surface": "ご",
        },
        {
          "normalizedForm": "利用",
          "partOfSpeech": [
            "名詞",
            "普通名詞",
            "サ変可能",
            "*",
            "*",
            "*",
          ],
          "surface": "利用",
        },
        {
          "normalizedForm": "頂く",
          "partOfSpeech": [
            "動詞",
            "非自立可能",
            "*",
            "*",
            "下一段-カ行",
            "連用形-一般",
          ],
          "surface": "いただけ",
        },
        {
          "normalizedForm": "ます",
          "partOfSpeech": [
            "助動詞",
            "*",
            "*",
            "*",
            "助動詞-マス",
            "終止形-一般",
          ],
          "surface": "ます",
        },
      ]
    `);
  });
});
