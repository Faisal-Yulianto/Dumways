const button = document.getElementById("submit")
button.addEventListener("click",function(event){
    event.preventDefault()
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let number = document.getElementById("number").value
    let position = document.getElementById("position").value
    let message = document.getElementById("message").value
    
    console.log("name : ",name)
    console.log("Email : ",email)
    console.log("Phone : ",number)
    console.log("position : ",position)
    console.log("Message : ",message)

    document.getElementById("name").value ="";
    document.getElementById("email").value ="";
    document.getElementById("number").value ="";
    document.getElementById("position").value ="Select Option";
    document.getElementById("message").value = "";

    if (name == "") {
        return alert("Tolong diisikan nama kamu");
      } else if (email == "") {
        return alert("Tolong diisikan nama kamu");
      }
    
      let myEmail = "ilham@gmail.com";
      let subject = "introduction";
      let a = document.createElement("a");
      a.href = `mailto:${myEmail}?subject=${subject}&body=halo bang`;
      a.click();

})