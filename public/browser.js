document.addEventListener("click", function(e) {
  // update 
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt("Update now !!")
    if(userInput.trim()){
      axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function () {
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
    }).catch(function() {
      console.log("Please try again later.")
    })
    }else
    alert("you have to put something !")
  }
  // delete
  if (e.target.classList.contains("delete-me")) {
    if(confirm("Do you really wanna delete this item ?")){
      axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function () {
      e.target.parentElement.parentElement.remove()
    }).catch(function() {
      console.log("Please try again later.")
    })
    }
}
})