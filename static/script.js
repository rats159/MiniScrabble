async function verify(word) {
   return await fetch(`http://localhost:8080/api/verify?word=${word}`).then(
      (data) => data.json()
   );
}
