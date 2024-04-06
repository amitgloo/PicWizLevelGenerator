"use strict";
let textMessages = []
// let gptAnswer = d.getElementById("gpt-answer");
const SERVER_URL = "http://localhost:8000"
const d = document;

function update_html(url, imageIndex, prompt){
    fetch(url)
        .then(response => response.blob())
        .then(image => {
                var demoPic = d.getElementById("link-out-pic-"+imageIndex)
                var imageSrc = URL.createObjectURL(image)  
                demoPic.download = prompt+".png"
                demoPic.href = imageSrc
    })
}

function get_image_ai(engine, prompt, called, total_calls) {
    if (called >= total_calls) {
        const loader = d.getElementById("loader")
        loader.style.display = "none"
        return;
    }
    
    fetch(SERVER_URL + "/generate-img/", {
        method: 'POST',
        body: JSON.stringify({engine, prompt})
    })
    .then((response) => response.json())
    .then((url) => {
        called++
        console.log(url)
        var demoPic = d.getElementById("out-pic-"+called)
        demoPic.src = url

        get_image_ai(engine, prompt, called, total_calls)
    })
    .catch(error => {
        // Error occurred during the fetch
        console.error('Error submitting form data:', error);
    });
}

// function get_image_go_api_mid_jouney(engine, prompt) {
//     fetch(SERVER_URL + "/generate-img-go-api-midjourney/", {
//         method: 'POST',
//         body: JSON.stringify({engine, prompt})
//     })
//     .then((response) => response.json())
//     .then((goapiResult) => {
//         console.log(goapiResult)
//     })
//     .catch(error => {
//         // Error occurred during the fetch
//         console.error('Error submitting form data:', error);
//     });
// }

const askImageAI = d.getElementById("ask-ai")
askImageAI.addEventListener("submit", (e) => {
    e.preventDefault();
  
    // handle submit
    const engine = d.getElementById("AI-Engine").value
    const prompt = d.getElementById("prompt-input").value
    const loader = d.getElementById("loader")
    loader.style.display = "block"

    console.log("Engine: " + engine)
    console.log("Prompt: " + prompt)

    get_image_ai(engine, prompt, 0, 1)
});

// Using fetch
async function downloadImage(imageSrc, imageName) {
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
  
    const link = document.createElement('a')
    link.href = imageURL
    link.download = imageName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

const buttons = document.querySelectorAll('.generated-image')
buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const srcImage = e.target.src;
        const prompt = d.getElementById("prompt-input").value

        if (srcImage.includes("glue.webp")) {
            return
        }

        console.log("Clicked to save: "+srcImage + " with prompt: " + d.getElementById("prompt-input").value)
        downloadImage(srcImage, prompt+".png")
    }, {passive: true})
});
