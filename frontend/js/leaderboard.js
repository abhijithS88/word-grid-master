
(()=>{
  const fetchLeaderboard = async() =>{
    try{
      const res = await fetch('http://localhost:8080/leaderboard',{
        method : "GET",
        credentials: "include",
      })
      const data = await res.json();
      const leaderboard = document.getElementById("leaderboardBody");
      for(let i=1;i<=data.length;i++){
        const row = document.createElement("tr");
        row.innerHTML =  ` 
        <td>${i}</td>
        <td>${data[i-1].username}</td>
        <td>${data[i-1].level}</td>
        <td>${data[i-1].hints}</td> `;
        leaderboard.appendChild(row);
      }
    }catch(err){
      alert('Fetching leaderboard failed.');
      window.location.hash = "/home";
    }
  }
  fetchLeaderboard();
})();