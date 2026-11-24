---
layout: post
title: "깃든마켓 커미션 신청: 마음에 드는 작품을 내 취향대로 주문 제작하기"
date: 2026-11-24
categories: [Explanation]
---

## Context

깃든마켓은 대학생 작가들의 핸드메이드 작품을 사고파는 마켓이다. 핸드메이드 작품은 공장에서 찍어내는 물건과 달리 같은 작품이 거의 없다. 그래서 "이 키링 너무 예쁜데 색만 바꿔서 하나 더 만들어 주실 수 있나요?" 같은 요청 사항이 자연스럽게 생긴다. 일반 마켓이라면 판매자에게 따로 연락해야 하는 일이지만, 우리 팀은 이 과정을 마켓 안의 기능으로 만들기로 했다. 그것이 **커미션(주문 제작) 신청** 기능이다.

이 글에서는 판매자가 커미션을 받겠다고 설정하는 순간부터, 구매자가 요청을 남기고 완료 팝업을 보기까지의 흐름을 설명한다.

<br>

## Goal

- 판매자는 상품을 등록할 때 커미션을 받을지 고를 수 있다.
- 구매자는 상품 상세 페이지에서 커미션 가능 여부를 보고, 버튼을 클릭해 바로 요청 화면으로 이동할 수 있다.
- 요청 화면에는 어떤 작품을 바탕으로 요청하는지 함께 보여준다.
- 요청사항(필수)과 참고 이미지(선택, 최대 3장)를 받는다.
- 요청을 저장하면 완료 팝업으로 내가 남긴 내용을 다시 확인할 수 있다.

<br>

## 전체 흐름

```text
[상품 등록] 커미션 수락 토글 ON
      |
      v
[상품 상세] "커미션 가능" 표시 + [커미션 신청하기] 버튼
      |  commission_request.html?product=작품ID
      v
[커미션 요청] 작품 정보 표시 → 요청사항·참고 이미지 입력 → [요청 저장하기]
      |
      v
[완료 팝업] 남긴 요청 내용 확인 → 확인 / 상품 상세로
```

<br>

## Steps

### 1. 상품 등록: 커미션 수락 토글

상품 등록 폼에 체크박스 하나를 스위치 모양으로 꾸민 "커미션 수락" 항목을 넣었다. 체크 상태에 따라 "커미션을 받지 않아요 / 커미션을 받아요" 문구가 바뀌고, 아래에 이 설정이 무엇을 뜻하는지 짧은 설명을 붙였다.

```html
<label class="pg-switch">
  <input type="checkbox" name="commission" value="1" />
  <span class="pg-track" aria-hidden="true"></span>
  <span class="pg-switch-text">
    <span class="pg-off">커미션을 받지 않아요</span>
    <span class="pg-on">커미션을 받아요</span>
  </span>
</label>
<p class="pg-help">
  구매자가 이 상품을 바탕으로 주문 제작(커미션)을 요청할 수 있어요.
</p>
```

실제 체크박스는 그대로 두고 CSS로 모양만 바꿨기 때문에, 키보드로 선택하거나 스크린 리더로 읽을 때도 일반 체크박스처럼 동작한다.

### 2. 상품 상세: 커미션 가능 표시와 신청 버튼

상세 페이지의 상품 정보 목록에 "커미션 가능" 칩과 안내 문구를 넣고, 구매하기 버튼 옆에 **커미션 신청하기** 버튼을 두었다. 구매와 커미션을 나란히 놓아서, 그대로 살지 바꿔서 주문할지 한눈에 고를 수 있게 했다.

```html
<a
  class="pg-btn pg-btn--outline pg-btn--lg"
  href="../commission_request.html?product=flower-keyring"
  data-product-link
>
  커미션 신청하기
</a>
```

![상품 상세의 커미션 가능 표시와 커미션 신청하기 버튼]({{ "/assets/commission/01-product-detail.png" | relative_url }})

### 3. 요청 화면에 어떤 작품인지 보여주기

요청 화면은 어떤 작품을 바탕으로 요청하는지 알아야 한다. 그래서 상세 페이지에서 넘어올 때 **query string**(`?product=작품ID`)으로 작품을 전달한다. 공통 스크립트 `product-preview.js`가 URL에서 작품 ID를 읽고, `data-product-field`가 붙은 요소들에 작품 이름, 판매자, 가격을 채운다.

```js
const requestedProduct = new URLSearchParams(window.location.search).get(
  "product",
);

for (const element of document.querySelectorAll("[data-product-field]")) {
  element.textContent = fields[element.dataset.productField];
}
```

덕분에 화면 왼쪽에는 "구매할 작품" 카드가, 오른쪽 제목에는 "**@판매자** 님에게 요청사항 남기기"가 작품에 맞게 표시된다. 존재하지 않는 작품 ID로 들어오면 "작품을 찾을 수 없음" 페이지로 보낸다.

![작품 정보가 채워진 커미션 요청 화면]({{ "/assets/commission/02-request-form.png" | relative_url }})

### 4. 요청 폼: 요청사항과 참고 이미지

폼은 두 칸으로 단순하게 만들었다.

1. **요청사항(필수)**: 색, 크기처럼 원하는 내용을 자유롭게 적는다. placeholder에 "연한 베이지 색으로, 손바닥만 한 크기로 떠 주세요" 같은 예시를 넣어 무엇을 써야 할지 감을 잡게 했다.
2. **참고 이미지(선택)**: 말로 설명하기 어려운 분위기를 사진으로 보여줄 수 있다.

참고 이미지 칸은 기본 파일 선택 버튼 대신, 숨긴 `input`을 `label`로 감싸서 "이미지 추가" 박스를 누르면 파일 선택 창이 열리게 했다.

```html
<label class="upload-box">
  <input type="file" name="ref_images" accept="image/*" multiple hidden />
  <span>이미지 추가</span>
</label>
<p class="hint">최대 3장까지 올릴 수 있어요.</p>
<p class="request-error" role="alert"></p>
```

또 판매자가 요청 내용을 보고 가격을 다시 안내할 수 있도록, 폼 위에 "요청 내용에 따라 추가 비용이 생길 수 있어요."라는 안내 문구를 넣었다.

### 5. 입력 확인과 완료 팝업

`commission-preview.js`에서 제출 전에 두 가지를 확인한다.

```js
images.addEventListener("change", () => {
  imageError.textContent =
    images.files.length > 3 ? "참고 이미지는 최대 3장까지 선택해 주세요." : "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = request.value.trim();
  if (!message) {
    // 공백만 입력한 경우
    request.setCustomValidity("요청사항을 입력해 주세요.");
    request.reportValidity();
    return;
  }
  if (imageError.textContent) return; // 이미지가 3장을 넘은 경우

  confirmation.querySelector(".commission-request-preview").textContent =
    message;
  confirmation.showModal(); // 완료 팝업 열기
});
```

- `required`만으로는 공백만 입력해도 통과되기 때문에 `trim()`으로 한 번 더 확인하고, `setCustomValidity()`로 브라우저 기본 경고 말풍선에 우리 문구를 띄운다.
- 사진 개수는 고르는 즉시 확인해서, 제출 버튼을 누르기 전에 에러를 보여준다.
- 완료 팝업은 HTML의 `<dialog>`와 `showModal()`로 만들었다. 팝업 안에 방금 쓴 요청 내용을 다시 보여주고, "확인"과 "상품 상세로" 버튼을 둔다. `<form method="dialog">` 안의 버튼을 누르면 별도 JavaScript 없이 팝업이 닫힌다.

![요청사항을 비우고 저장했을 때 나타나는 안내 문구]({{ "/assets/commission/03-required-warning.png" | relative_url }})

<br>

## Result

![커미션 요청 저장 완료 팝업]({{ "/assets/commission/04-complete-dialog.png" | relative_url }})

- 상품 상세에서 "커미션 신청하기"를 누르면 해당 작품 정보가 채워진 요청 화면이 열린다.
- 요청사항을 비우거나 이미지를 4장 이상 고르면 안내 문구가 나타난다.
- 요청을 저장하면 완료 팝업에서 남긴 요청을 다시 확인하고 상품 상세로 돌아갈 수 있다.

<br>

## What I learned

커미션 화면을 만들면서 가장 많이 고민한 것은 "구매자가 무엇을 써야 할지 모르면 요청을 포기한다"는 점이었다. 그래서 기능을 늘리기보다 칸을 두 개로 줄이고, 예시 문구와 추가 비용 안내, 완료 후 내용 확인처럼 사용자를 안심시키는 장치에 신경을 썼다. 또 `<dialog>`, `setCustomValidity()`처럼 브라우저가 이미 제공하는 기능을 쓰면 적은 코드로도 자연스러운 화면을 만들 수 있다는 것을 배웠다.

<br>

## References

- [MDN – `<dialog>`: The Dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [MDN – HTMLTextAreaElement.setCustomValidity()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/setCustomValidity)
- [MDN – URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- 깃든마켓 팀 저장소: [juanxiu/2026_osp_project_gitden_team](https://github.com/juanxiu/2026_osp_project_gitden_team)
