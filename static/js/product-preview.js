(() => {
  const page = document.body.dataset.productPage;
  const imageRoot = new URL("../images/", document.currentScript.src);
  const products = {
    "flower-keyring": {
      name: "뜨개 꽃 키링",
      seller: "ewha_creator02",
      price: "8,000원",
      category: "키링",
      image: "product_1.jpeg",
      description: "코바늘로 정성껏 뜬 데이지 꽃 키링이에요. 크기는 약 6cm예요.",
      reviewCount: 6,
    },
    linen: {
      name: "린넨 스트링 파우치",
      seller: "linen_sori",
      price: "16,000원",
      category: "파우치",
      image: "product-list/linen.png",
      description: "열쇠와 이어폰처럼 작은 물건을 한곳에 모아 담는 린넨 파우치예요. 끈을 당겨 닫을 수 있어요.",
    },
    vase: {
      name: "백유 미니 화병",
      seller: "clay_onu",
      price: "15,000원",
      category: "도자기",
      image: "product-list/vase.png",
      description: "책상이나 선반에 꽃 한 송이를 꽂아 두기 좋은 작은 화병이에요.",
    },
    bookmark: {
      name: "책장 그림 책갈피",
      seller: "paper_momo",
      price: "4,500원",
      category: "문구",
      image: "product-list/bookmark.png",
      description: "책장 그림을 담은 종이 책갈피예요. 읽던 페이지에 끼워 두세요.",
    },
    postcard: {
      name: "식물 드로잉 엽서",
      seller: "slow_post",
      price: "6,000원",
      category: "문구",
      image: "product-list/postcard.png",
      description: "잎맥과 줄기를 가는 선으로 그린 엽서예요. 뒷면에 짧은 안부를 적어 보세요.",
    },
    sunflower: {
      name: "뜨개 해바라기 키링",
      seller: "thread_sun",
      price: "12,000원",
      category: "키링",
      image: "product-list/sunflower.png",
      description: "뜨개로 만든 해바라기 키링이에요. 가방이나 열쇠에 달아 사용할 수 있어요.",
    },
    beads: {
      name: "청록 비즈 팔찌",
      seller: "maker_bora",
      price: "9,000원",
      category: "액세서리",
      image: "product-list/beads.png",
      description: "청록색 비즈를 엮은 팔찌예요. 비즈마다 색과 무늬가 조금씩 달라요.",
    },
  };

  const requestedProduct = new URLSearchParams(window.location.search).get("product");
  const productId = requestedProduct ?? (page === "commission" ? "linen" : "flower-keyring");
  if (!Object.hasOwn(products, productId)) {
    window.location.replace(page === "detail" ? "product_not_found.html" : "templates/product_not_found.html");
    return;
  }

  const product = products[productId];
  const reviewCount = product.reviewCount ?? 0;
  const fields = {
    ...product,
    handle: `@${product.seller}`,
    reviewCount,
    reviewTab: `리뷰 ${reviewCount}`,
    reviewSummary: reviewCount ? `${product.name}의 리뷰 ${reviewCount}개를 볼 수 있어요.` : "아직 등록된 리뷰가 없어요.",
  };

  for (const element of document.querySelectorAll("[data-product-field]")) {
    element.textContent = fields[element.dataset.productField];
  }

  for (const link of document.querySelectorAll("[data-product-link]")) {
    const url = new URL(link.href);
    url.searchParams.set("product", productId);
    link.href = url.href;
  }

  if (requestedProduct && (productId !== "flower-keyring" || page === "commission")) {
    for (const image of document.querySelectorAll("[data-product-image]")) {
      image.src = new URL(product.image, imageRoot);
      image.alt = image.dataset.productImage === "thumbnail" ? `${product.name} 사진 1` : product.name;
    }
  }

  if (page === "detail") {
    document.title = `${product.name} | 깃든마켓`;
    if (productId !== "flower-keyring") {
      document.querySelectorAll(".pg-thumbcol .pg-thumb:not(:first-child)").forEach((thumbnail) => {
        thumbnail.hidden = true;
      });
      document.querySelector(".pg-count").textContent = "1 / 1";
    }

    const showReviewTab = () => {
      if (window.location.hash === "#reviews") {
        document.querySelector("#tab-review").checked = true;
      }
    };
    showReviewTab();
    window.addEventListener("hashchange", showReviewTab);
  }

  if (page === "review-list") {
    document.title = `${product.name} 리뷰 | 깃든마켓`;
    document.querySelectorAll("[data-sample-reviews]").forEach((section) => {
      section.hidden = !reviewCount;
    });
    document.querySelector("[data-review-empty]").hidden = Boolean(reviewCount);
  }

  if (page === "review-write") {
    document.querySelector(".write-form").addEventListener("submit", (event) => {
      event.preventDefault();
      window.location.hash = "review-done";
    });
  }
})();
