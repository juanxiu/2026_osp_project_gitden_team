(() => {
  const spin = document.querySelector(".roulette-button");
  const result = document.querySelector("#roulette-result");
  const heading = document.querySelector("#roulette-result-title");
  const message = document.querySelector("#roulette-result-message");
  const illustrations = result.querySelectorAll("[data-result-art]");
  const wheel = ["튤립 화분", null, "포근방석", null, "햇살창문", null];

  spin.addEventListener("click", () => {
    const reward = wheel[Math.floor(Math.random() * wheel.length)];
    const illustration = reward === "튤립 화분" ? "tulip" : reward ? null : "miss";
    heading.textContent = reward ? `아이템 ‘${reward}’에 당첨됐어요!` : "아쉽게도 꽝이에요";
    message.textContent = reward
      ? "캐릭터 꾸미기에 사용할 수 있는 아이템이에요."
      : "다음 도전에서 새로운 행운을 만나보세요.";
    for (const figure of illustrations) {
      figure.hidden = figure.dataset.resultArt !== illustration;
    }
    result.showModal();
  });
})();
