function getRandomIndex(upper) {
  return Math.floor(Math.random() * upper);
}

function getRandomElement(arr) {
  return arr[getRandomIndex(arr.length)];
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = getRandomIndex(currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function cardHover(e) {
  let root = document.querySelector(":root");
  let offset = e.currentTarget.getBoundingClientRect();
  let centerX = (offset.left + offset.right) / 2;
  let centerY = (offset.top + offset.bottom) / 2;
  let mouseX = e.clientX - centerX;
  let mouseY = e.clientY - centerY;
  let mouseXPercentage =
    (100 * (e.clientX - offset.left)) / (offset.right - offset.left);
  let mouseYPercentage =
    (100 * (e.clientY - offset.top)) / (offset.bottom - offset.top);
  let strength = (mouseYPercentage - 50) / 50;
  let mousePosition = `${mouseXPercentage}% ${100}%`;
  console.log(mousePosition);

  root.style.setProperty("--mouse-position", mousePosition);
  root.style.setProperty("--strength", strength);
  e.currentTarget.style.transition = "transform 0.2s ease-out";
  e.currentTarget.style.transformOrigin = "50% 50%";
  e.currentTarget.style.transform = `rotateX(${mouseY * 0.1}deg)
  rotateY(${mouseX * -0.1}deg) scale(1.1)`;
  e.currentTarget.parentNode.style.perspective = "1600px";
}

function cardReset(e) {
  e.currentTarget.style.transition = "transform 0.5s ease-out";
  e.currentTarget.style.transform = "";
}
export { getRandomElement, shuffle, cardHover, cardReset };
