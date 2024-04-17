const [shuffle, sort, submit, exchange, pass] = document.querySelectorAll(".action");

shuffle.addEventListener("click", () => {
   const children = [...rack.children];
   for (let i = 0; i < children.length; i++) {
      const swapIndex = Math.floor(Math.random() * (children.length - i) + i);
      const temp = children[swapIndex];
      children[swapIndex] = children[i];
      children[i] = temp;
   }

   for (const child of children) {
      child.classList.add("shrinking");
      setTimeout(() => {
         rack.appendChild(child);
         child.classList.add("growing");
      }, 250);
      setTimeout(() => {
         child.classList.remove("shrinking", "growing");
      }, 500);
   }
});

sort.addEventListener("click", () => {
   const children = [...rack.children];

   children.sort((a, b) => a.dataset["letter"].charCodeAt(0) - b.dataset["letter"].charCodeAt(0));

   for (const child of children) {
      child.classList.add("sorting1");
      setTimeout(() => {
         rack.appendChild(child);
         child.classList.add("sorting2");
      }, 250);
      setTimeout(() => {
         child.classList.remove("sorting1", "sorting2");
      }, 500);
   }
});

submit.addEventListener("click", () => {
   for (const tile of turnTiles) {
      const words = getWordsFrom(tile.dataset["x"], tile.dataset["y"]);
      console.log(tile);
   }
});
