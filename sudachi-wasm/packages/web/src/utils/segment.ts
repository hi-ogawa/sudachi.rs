import type { Morpheme } from "@hiogawa/sudachi.wasm";
import _ from "lodash"; // TODO: rakkas pre-rendering fails when named import...
import { tinyassert } from "./tinyassert";

export function segment(morphemes: Morpheme[]): Morpheme[][] {
  if (morphemes.length === 0) {
    return [];
  }
  const result: Morpheme[][] = [morphemes.slice(0, 1)];
  for (const [prev, curr] of _.zip(
    morphemes.slice(0, -1),
    morphemes.slice(1)
  )) {
    tinyassert(prev);
    tinyassert(curr);
    if (checkDependency(prev, curr)) {
      _.last(result)?.push(curr);
    } else {
      result.push([curr]);
    }
  }
  return result;
}

// heuristics based on https://github.com/google/budou/blob/d45791a244e00d84f87da2a4678da2b63a9c232f/budou/mecabsegmenter.py#L95-L108

const POS_FORWARD = ["接頭辞", "連体詞"];
const POS_BACKWARD = ["助詞", "助動詞", "接尾辞"];
const POS_PAIRS = [["名詞", "名詞"]];

function checkDependency(t1: Morpheme, t2: Morpheme): boolean {
  return checkForward(t1) || checkBackward(t2) || checkPair(t1, t2);
}

function checkForward(t: Morpheme): boolean {
  const [pos, ...tags] = t.part_of_speech;
  return (
    (pos && POS_FORWARD.includes(pos)) ||
    (pos === "補助記号" && tags.includes("括弧開"))
  );
}

function checkBackward(t: Morpheme): boolean {
  const [pos, ...tags] = t.part_of_speech;
  return (
    (pos && POS_BACKWARD.includes(pos)) ||
    (pos === "補助記号" && !tags.includes("括弧開"))
  );
}

function checkPair(t1: Morpheme, t2: Morpheme): boolean {
  return POS_PAIRS.some((pair) =>
    _.isEqual(pair, [t1.part_of_speech[0], t2.part_of_speech[0]])
  );
}
