(() => {
  let currentLevel;
  const leaderboardButton = document.getElementById('LeaderboardBtn');
  leaderboardButton.addEventListener('click' , ()=> {
    window.location.hash = "/leaderboard";
  })
  const dictionaryButton = document.getElementById('DictionaryBtn');
  dictionaryButton.addEventListener('click' , ()=> {
    window.open('https://dictionary.cambridge.org/', '_blank');
  })
  const profileButton = document.getElementById('ProfileBtn');
  profileButton.addEventListener('click' , ()=> {
    window.location.hash = "/profile";
  })
  const playButton = document.getElementById('PlayBtn');
  playButton.addEventListener('click' , ()=>{
    window.location.hash = `/level/${currentLevel}`
  })
  const updateDetails = async() =>{
    try{
       const res = await fetch('http://localhost:8080/user/profile',{
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) {
        window.location.hash = "/";
        return;
      }
      const data = await res.json();
      document.getElementById("username").innerHTML=data.username;
      document.getElementById("level").innerHTML=currentLevel=data.level;
      document.getElementById("hints").innerHTML=data.hints;
    }catch(err){
      alert("Fetching details failed");
      window.location.hash = '/';
    }
  }
  updateDetails();
})();

