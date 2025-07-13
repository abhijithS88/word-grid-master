
(() => {

const form = document.getElementById("form");

form.addEventListener('submit' , async(e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try{
    const res = await fetch("http://localhost:8080/user/login" , {
      method : "POST",
      credentials: 'include',
      headers : {
        "Content-type" : "application/json",
      },
      body: JSON.stringify({email, password })
    })
    const data = await res.json();
    if(res.ok){
      window.location.hash = "/home";
    }
    else{
      alert(data.message || "Registration failed.");
    }
  }catch (error) {
      alert("Something went wrong.Login failed.");
    }
})

})();