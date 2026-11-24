// Prepare once per catalog snapshot, then reuse the returned search function.
// products: [{ id, name, description }]; search(query) resolves to ordered IDs.
export async function createProductSearch(products, encoder) {
  if (products.length === 0) return async () => [];

  const ids = products.map(product => product.id);
  const passages = products.map(product => `passage: ${product.name} ${product.description}`);
  if (!encoder) {
    const { pipeline } = await import(
      "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6/dist/transformers.min.js"
    );
    encoder = await pipeline("feature-extraction", "Xenova/multilingual-e5-small", {
      device: "wasm", dtype: "q8",
    });
  }

  const options = { pooling: "mean", normalize: true };
  const vectors = (await encoder(passages, options)).tolist();
  return async function search(query) {
    const text = query.trim();
    if (!text) return [];
    const [queryVector] = (await encoder([`query: ${text}`], options)).tolist();
    // For unit vectors, the dot product equals cosine similarity.
    return vectors.map((vector, index) => ({
      id: ids[index],
      score: vector.reduce((sum, value, i) => sum + value * queryVector[i], 0),
    }))
      .sort((a, b) => b.score - a.score)
      .map(result => result.id);
  };
}
