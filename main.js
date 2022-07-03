(() => {

  const toggleNav = e => {
    document.querySelector('nav').classList.toggle('nav-active')
    document.querySelector('main').classList.toggle('main-active')
  };

  const validateForm = inputs => {
    let validated = true;
    Array.from(inputs).forEach(input => {
      if(!input.value){
        input.classList.add("red-border");
        validated = false;
      }
      else input.classList.remove("red-border");
    });
    return validated;
  }

  const sendEmail = e => {
    e.preventDefault();
    const { target: form } = e;
    const inputs = form.querySelectorAll("input,textarea");
    if( !validateForm(inputs) ) return;
    const gId = "AKfycbxm41-BDGarEx58rCD5jsqU9fv0EesM5vHemLYm2ya9Gdv6qNLz5nJRdbBaN_ENyv9gUw";
    const emailData = {
      sender: form.elements["sender"].value,
      subject: form.elements["subject"].value,
      body: form.elements["message"].value
    };
    const payload = {
      method:"POST",
      mode: "no-cors",
      headers: {
        "Content-Type":"application/json"
      },
      body:JSON.stringify(emailData)
    };
    fetch(`https://script.google.com/macros/s/${gId}/exec`,payload)
    .then(() => form.parentElement.innerHTML = "<h2 id='thank-you'>Thanks for reaching out!</h2>")
    .catch(e => console.error(e.message));
    return false;
  }

  document.getElementById('burger').onclick = toggleNav;
  document.getElementById("email-form").onsubmit = sendEmail;
  
})();