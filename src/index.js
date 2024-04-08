let addToy = false;

//Adds a click event listener to the add a new toy button that makes a form 
//pop up to add a new toy
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//linking toy api and toy collection container to a variable 
const toyUrl = "http://localhost:3000/toys"
const toyCollectionContainer = document.querySelector('#toy-collection')

//fetches the toy api and parses it into a usable JS object and 
//calls the render toys function and passes in the array of toy objects as a parameter
fetch(toyUrl)
  .then(response => response.json())
  .then(data => renderToys(data))
  .catch(error => console.error('Error:', error));

//function to render toys to page
function renderToys(objOfToys) {
  //adds h2, img, p and button for each toy with data from api with added classes and ids
  //appends h2, img, p and button to a card div for each toy and appends all those cards to the toy collection container
  objOfToys.forEach(toy => {
    const h2 = document.createElement('h2')
    h2.textContent = toy.name
    const img = document.createElement('img')
    img.src = toy.image
    img.classList = "toy-avatar"
    const p = document.createElement('p')
    p.textContent = toy.likes
    const btn = document.createElement('button')
    btn.classList = "like-btn"
    btn.textContent = "Like ❤️"
    btn.id = toy.id
    const cardDiv = document.createElement('div')
    cardDiv.classList = "card"
    cardDiv.appendChild(h2)
    cardDiv.appendChild(img)
    cardDiv.appendChild(p)
    cardDiv.appendChild(btn)
    toyCollectionContainer.appendChild(cardDiv)

    //adding a like button event listener for each like button (iterating through node list)
    const likeButtons = document.querySelectorAll('.like-btn')
    for (button of likeButtons) {
      button.addEventListener('click', e => updateLikes(e))
    }

    //function to update number of likes of each toy
    function updateLikes(e) {
      e.preventDefault();
      const toyToUpdate = objOfToys.find(toy => toy.id === e.target.id); //finds toy that matches the id of the button

      if (toyToUpdate) {
        // Send a PATCH request to update the likes count on the server for the target object
        fetch("http://localhost:3000/toys/" + e.target.id, {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({ likes: toyToUpdate.likes + 1 }) // Increment likes by 1 on the server
        })
          .then((resp) => resp.json())
          .then((data) => {
            // Update the likes count in the DOM with the value returned from the server
            toyToUpdate.likes = data.likes;
            //re-renders the toys with the updated data received from server
            renderToys(data);
          })
          .catch(error => console.error('Error updating likes:', error));
      }
    }
  })
}

//grabs form and declares it as a variable and adds event listener to submit it
const form = document.querySelector('.add-toy-form')
form.addEventListener('submit', e => handleNewChar(e))

//function to add new character through creating a new object to post with the input values inside
function handleNewChar(e) {
  e.preventDefault()

  const newCharObj = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }

  //using post to add new object to the api to then be rendered as a toy card right away
  fetch(toyUrl, {
    method: "POST",
    headers:
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newCharObj) //converts the JavaScript object or value to a JSON string to be put into api 

  })
    .then((resp) => resp.json())
    .then((data) => renderToys(data))
}



