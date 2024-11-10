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
  let offset = e.currentTarget.getBoundingClientRect();
  let centerX = (offset.left + offset.right) / 2;
  let centerY = (offset.top + offset.bottom) / 2;
  let mouseX = e.clientX - centerX;
  let mouseY = e.clientY - centerY;

  e.currentTarget.style.transition = "transform 0.1s ease-out";
  e.currentTarget.style.transformOrigin = "50% 50%";
  e.currentTarget.style.transform = `rotateX(${mouseY * 0.05}deg)
  rotateY(${mouseX * -0.05}deg) scale(1.1)`;
  e.currentTarget.parentNode.style.perspective = "500px";
}

function cardReset(e) {
  e.currentTarget.style.transition = "transform 0.5s ease-out";
  e.currentTarget.style.transform = "";
}
export { getRandomElement, shuffle, cardHover, cardReset };
