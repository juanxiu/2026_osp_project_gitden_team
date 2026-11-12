(() => {
  const form = document.querySelector(".request-form");
  const request = document.querySelector("#request-text");
  const images = form.elements.namedItem("ref_images");
  const imageError = form.querySelector(".request-error");
  const confirmation = document.querySelector("#commission-confirmation");

  request.addEventListener("input", () => request.setCustomValidity(""));
  images.addEventListener("change", () => {
    imageError.textContent = images.files.length > 3 ? "참고 이미지는 최대 3장까지 선택해 주세요." : "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = request.value.trim();
    if (!message) {
      request.setCustomValidity("요청사항을 입력해 주세요.");
      request.reportValidity();
      return;
    }
    if (imageError.textContent) {
      return;
    }

    confirmation.querySelector(".commission-request-preview").textContent = message;
    confirmation.showModal();
  });
})();
