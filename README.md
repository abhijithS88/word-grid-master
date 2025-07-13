# 🧩 Word Grid Master

Word Grid Master is a crossword-style puzzle game.

<!--
---

## 🎥 Demo Video

[![Watch the video](https://img.youtube.com/vi/YOUR_VIDEO_URL/hqdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_URL)
-->
---

## 📋 Game Details

- A set of letters is provided, and words must be formed using only those letters.
- The formed words are arranged in a crossword-style grid and must be discovered.
- Hints can be used when the player gets stuck.
- Each completed level unlocks the next one.
- A total of **2,787 levels** have been included, and the count can be increased by expanding the word list.
- Words with length less than 4 and more than 7 have been excluded to maintain balance.
- Levels were generated using **C++** and saved as `.json` files.
- All JSON files were added to **MongoDB** using a single script.
- **MySQL** is used to store user data such as usernames, passwords, and current progress(level,hints).
- A **JWT (JSON Web Token)** is issued to users after registration or login for authorization.
- The game contains **7 main pages**:
  - Get Started Page
  - Register Page
  - Login Page
  - Home Page
  - Profile Page
  - Level Page (for gameplay)
  - Leaderboard Page
- A single HTML file is used for the entire frontend, and **URL hash routing** is used to navigate between pages.
- The leaderboard is sorted by:
  - Level in descending order
  - Number of hints used in ascending order (if levels are the same)

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, Bootstrap, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB (level data), MySQL (user data)
- **Level Generation:** C++ using [nlohmann/json](https://github.com/nlohmann/json)

