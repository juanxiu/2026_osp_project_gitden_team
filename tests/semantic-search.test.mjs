import assert from "node:assert/strict";
import test from "node:test";
import { createProductSearch } from "../static/js/semantic-search.mjs";

test("encodes the catalog once and sorts IDs by normalized dot product for each query", async () => {
  const products = [
    { id: "beads", name: "팔찌", description: "청록색 비즈" },
    { id: "bookmark", name: "책갈피", description: "읽던 쪽을 표시" },
  ];
  const calls = [];
  const vectors = [
    [[0.6, 0.8], [0.8, 0.6]], // 팔찌, 책갈피
    [[1, 0]],                  // 독서
    [[0, 1]],                  // 장신구
  ];
  const encoder = async (texts, options) => {
    assert.deepEqual(options, { pooling: "mean", normalize: true });
    calls.push(texts);
    return { tolist: () => vectors.shift() };
  };

  const search = await createProductSearch(products, encoder);
  assert.deepEqual(await search("  독서  "), ["bookmark", "beads"]);
  assert.deepEqual(await search(" "), []);
  assert.deepEqual(await search("장신구"), ["beads", "bookmark"]);
  assert.deepEqual(calls, [
    ["passage: 팔찌 청록색 비즈", "passage: 책갈피 읽던 쪽을 표시"],
    ["query: 독서"],
    ["query: 장신구"],
  ]);
});

test("an empty catalog can be searched without loading a model", async () => {
  const search = await createProductSearch([]);
  assert.deepEqual(await search("책갈피"), []);
});
