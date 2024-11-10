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

export { getRandomElement, shuffle };
