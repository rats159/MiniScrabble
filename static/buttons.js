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
   let tileObjs = [];
   for (const tile of turnTiles) {
      tileObjs.push(getWordsFrom(+tile.dataset["x"], +tile.dataset["y"]));
   }

   const allObjs = [];
   tileObjs.forEach((tileObj) => {
      if (tileObj.horizontal.word.length > 1) {
         allObjs.push(tileObj.horizontal);
      }
      if (tileObj.vertical.word.length > 1) {
         allObjs.push(tileObj.vertical);
      }
   });

   const deDuplicated = new Map();
   for (const word of allObjs) {
      deDuplicated.set(word.x.join("") + word.y.join(""), word.word);
   }

   const allWords = [...deDuplicated.values()];
   console.log(allWords);
});
