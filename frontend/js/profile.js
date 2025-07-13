
(()=> {

  const deleteButton = document.getElementById('DeleteBtn');
  deleteButton.addEventListener('click' , async () => {
    if (!confirm('Are you sure you want to delete your account?')) return;
    try{
      const res = await fetch('http://localhost:8080/user',{
        method: 'DELETE',
        credentials: 'include',
      })
      if(res.ok){
        alert('User deleted successfully')
        window.location.hash = "/";
        return;
      }
      else{
        const error = await res.json();
        alert('Failed to delete user');
      }
    }
    catch(err){
      alert("Error in deleteing account");
    }
  })

  const getUserDetails = async() =>{
    try{
      const res = await fetch('http://localhost:8080/user/profile',{
        method: 'GET',
        credentials: 'include',
      })
      if(!res.ok){
        window.location.hash = "/";
        return;
      }
      const data = await res.json();
      document.getElementById("username").innerHTML = data.username;
      document.getElementById("email").innerHTML = data.email;
      document.getElementById("level").innerHTML = data.level;
      document.getElementById("hints").innerHTML = data.hints;
    }
    catch(err){
      alert("Error in deleteing account");
      window.location.hash = '/';
    }
  }
  getUserDetails();
})();