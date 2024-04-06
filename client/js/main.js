"use strict";
let textMessages = []
// let gptAnswer = d.getElementById("gpt-answer");
const SERVER_URL = "http://localhost:8000"
const d = document;

function get_image_open_ai(engine, prompt, called, total_calls) {
    if (called >= total_calls) {
        return;
    }
    
    fetch(SERVER_URL + "/generate-img/", {
        method: 'POST',
        body: JSON.stringify({engine, prompt})
    })
    .then((response) => response.json())
    .then((data) => {
        called++
        console.log(data)
        var demoPic = d.getElementById("out-pic-"+called)
        demoPic.src = data

        var demoPic = d.getElementById("link-out-pic-"+called)
        demoPic.download = prompt+".png"
        demoPic.href = data
        get_image_open_ai(engine, prompt, called, total_calls)
    })
    .catch(error => {
        // Error occurred during the fetch
        console.error('Error submitting form data:', error);
    });
}

const askImageAI = d.getElementById("ask-ai")
askImageAI.addEventListener("submit", (e) => {
    e.preventDefault();
  
    // handle submit
    const engine = d.getElementById("AI-Engine").value
    const prompt = d.getElementById("prompt-input").value

    console.log("Engine: " + engine)
    console.log("Prompt: " + prompt)

    if (engine == "OpenAI") {
        get_image_open_ai(engine, prompt, 0, 1)    
    }
});

// const buttons = document.querySelectorAll('.generated-image')
// buttons.forEach((button) => {
//     button.addEventListener("click", (e) => {
//         // if (e.target.classList.contains("generated-image")) {
//         //     e = e.target.getElementsByClassName("button-letter")[0]
//         // } else if (e.target.classList.contains("letter-count")) {
//         //     e = e.target.parentElement.getElementsByClassName("button-letter")[0]
//         // }

//         const srcImage = e.target.src;
//         console.log("Clicked to save: "+srcImage + " with prompt: " + d.getElementById("prompt-input").value)
//     }, {passive: true})
// });
