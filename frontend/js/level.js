(() => {

  let collectedWords = [];
  let wordSize;

  function getLevelId() {
    return window.currentLevelId;
  }

  function placeWord(x, y, dir, word) {
    let i = x, j = y;
    for (let it = 0; it < word.length; it++) {
      const box = document.getElementById(`${i}-${j}`);
      if (box) {
        box.innerHTML = word[it];
        box.style.background = "beige";
      }
      if (dir === "vertical") i++;
      if (dir === "horizontal") j++;
    }
  }

  function updatebox(s, x) {
  // Shift previous messages up
  for (let i = 1; i < 8; i++) {
    const current = document.getElementById(`${i}`);
    const next = document.getElementById(`${i + 1}`);
    current.innerText = next.innerText;
    current.style.background = next.style.background;
  }

  // Insert new message at the bottom
  const last = document.getElementById("8");
  last.innerText = s;
  if (x === 0) last.style.background = "rgb(101, 222, 101)";
  else if (x === 1) last.style.background = "rgb(206, 97, 97)";
  else if(x==-1) last.style.background = "rgb(244, 244, 9)";
  else  last.style.background = "darkkhaki";
}


  const updateLevel = async () => {
    try {
      const res = await fetch('http://localhost:8080/level/updateLevel', {
        method: "PUT",
        credentials: "include"
      });
      if (!res.ok) {
        const text = await res.text();
        alert("Server Error while updating level: " + text);
      }
    } catch {
      alert("Something went wrong while updating level.");
    }
  };

  const hintsButton = document.getElementById("hintBtn");
  hintsButton.addEventListener('click', async () => {
    if (collectedWords.length === wordSize) {
      return alert("All words are already found. No hints available.");
    }
    try {
      const id = getLevelId();
      const res = await fetch(`http://localhost:8080/level/${id}/giveHints`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ collectedWords })
      });
      const data = await res.json();
      updatebox(`Hint!!. Try this word: ${data.hint}`,2);
      document.getElementById("wordInput").focus();
    } catch {
      alert("Unable to fetch hint. Please try again later.");
    }
  });

  const submitButton = document.getElementById("submitWordBtn");
  document.getElementById("wordInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      submitButton.click();
    }
  });

  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const word = document.getElementById("wordInput").value.trim().toLowerCase();
    if (collectedWords.includes(word)) {
      document.getElementById("wordInput").value = "";
      updatebox(`${word} is already found.Try another one.`,-1);
      document.getElementById("wordInput").focus();
      return;
    }

    try {
      const id = getLevelId();
      const res = await fetch(`http://localhost:8080/level/${id}/check`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ word })
      });
      const data = await res.json();
      if (data.found) {
        placeWord(parseInt(data.x), parseInt(data.y), data.dir, word);
        updatebox(`New word found : ${word}`, 0);
        collectedWords.push(word);
        document.getElementById("wordInput").value = "";
        document.getElementById("wordInput").focus();
        if (collectedWords.length === wordSize) {
          await updateLevel();
          window.location.hash = "/home";
        }
      } else {
        updatebox(`Word doesn't exist in grid : ${word}`,1);
        document.getElementById("wordInput").value = "";
        document.getElementById("wordInput").focus();
      }
    } catch {
      alert("Failed to check the word. Please try again.");
    }
  });

  const getGivenGrid = async () => {
    try {
      const id = getLevelId();
      const res = await fetch(`http://localhost:8080/level/${id}`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!res.ok) {
        alert("Could not load level. Redirecting to home.");
        window.location.hash = '/home';
        return;
      }
      const data = await res.json();
      return data;
    } catch {
      alert("Failed to load the level data. Redirecting to home.");
      window.location.hash = '/home';
    }
  };

  const showLetters = (letters) => {
    const box = document.getElementById("lettersContainer");
    box.innerHTML = "";
    const shuffled = [...letters].sort(() => Math.random() - Math.random());

    shuffled.forEach(letter => {
      const tile = document.createElement("div");
      tile.innerText = letter.toUpperCase();

      Object.assign(tile.style, {
        width: "50px",
        height: "50px",
        background: "rgba(255, 255, 255, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(6px)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        fontWeight: "bold",
        color: "#000",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
        margin: "4px"
      });

      box.appendChild(tile);
    });
  };

  const createGrid = (data) => {
    const given = data.given;
    for (let i = 0; i < 15; i++) {
      const box = document.getElementById("main-box");
      const div = document.createElement("div");
      div.className = "gap-1 d-flex mt-1";
      for (let j = 0; j < 15; j++) {
        const smallDiv = document.createElement("div");
        if (given[i][j] === '.') {
          smallDiv.style.width = "25px";
          smallDiv.style.height = "25px";
        } else {
          smallDiv.style.width = "25px";
          smallDiv.style.height = "25px";
          smallDiv.style.background = "white";
          smallDiv.innerText = "";
          smallDiv.style.color = "black";
          smallDiv.style.textAlign = "center";
          smallDiv.id = `${i}-${j}`;
        }
        div.appendChild(smallDiv);
      }
      box.appendChild(div);
    }
  };

  (async () => {
    const data = await getGivenGrid();
    if (!data) return;
    createGrid(data);
    showLetters(data.letters);
    wordSize = data.size;
    document.getElementById("wordInput").focus();
  })();

})();
