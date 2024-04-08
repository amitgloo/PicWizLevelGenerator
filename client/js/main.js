"use strict";
// let gptAnswer = d.getElementById("gpt-answer");
const SERVER_URL = "http://localhost:8000"
const d = document;

function logMessage(message) {
    const logger = d.getElementById("logger-display")
    var logContent = logger.textContent
    console.log(logContent)

    if (logContent.length == 0) {
        logger.textContent = message
    } else {
        logger.textContent = logContent + "\n" + message
    }

    logger.scrollTop = logger.scrollHeight;
}

function get_prompt_ai(levelGenerator, prompt, called, total_calls, loader) {
    if (called >= total_calls) {
        // loader.turnLoaderOff()
        logMessage("Start generating images...")
        get_image_from_prompts(levelGenerator, 0, loader)
        return;
    }
    
    loader.updateLoader(called, total_calls)
    logMessage("("+called+"/"+total_calls+") - prompt generation...")
    
    fetch(SERVER_URL + "/generate-prompt/", {
        method: 'POST',
        body: JSON.stringify({
            "engine": levelGenerator.engine,
            "prompt": prompt})
        })
    .then((response) => response.json())
    .then((out_prompt) => {
        console.log(out_prompt)
        // var demoPic = d.getElementById("prompt-area-"+called)
        // demoPic.textContent = out_prompt
        logMessage("\nprompt #"+called+": "+out_prompt+"\n")
        called++
        levelGenerator.prompts.push(prompt)
        get_prompt_ai(levelGenerator, prompt, called, total_calls, loader)
    })
    .catch(error => {
        // Error occurred during the fetch
        console.error('Error submitting form data:', error);
    });
}

function get_image_from_prompts(levelGenerator, index, loader) {
    if (levelGenerator.prompts.length <= index) {
        logMessage("Finished Successfullly!")
        loader.turnLoaderOff()
        return;
    }

    loader.updateLoader(index, levelGenerator.prompts.length)
    logMessage("("+index+"/"+levelGenerator.prompts.length+") - image generation...")
    
    fetch(SERVER_URL + "/generate-img/", {
        method: 'POST',
        body: JSON.stringify({
            "engine": levelGenerator.engine,
            "prompt": levelGenerator.prompts[index]
        })
    })
    .then((response) => response.json())
    .then((url) => {
        console.log(url)
        var demoPic = d.getElementById("out-pic-"+index)
        demoPic.src = url
        demoPic.addEventListener("load", () => {
            get_image_from_prompts(levelGenerator, index+1, loader)
        })
    })
    .catch(error => {
        // Error occurred during the fetch
        console.error('Error submitting form data:', error);
    });

}

const askGenPromptAI = d.getElementById("gen-prompts-form")
askGenPromptAI.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // handle submit
    const engine = d.getElementById("gen-target-model").value
    const promptCount = d.getElementById("gen-prompts-count").value
    if (engine.toLowerCase() == "model" || promptCount.toLowerCase() == "count") {
        return
    }
    const levelPrompt = d.getElementById("gen-prompt-input").value
    var loader = new Loader()
    loader.turnLoaderOn(promptCount)
    
    const levelTitle = d.getElementById("current-level")
    levelTitle.textContent = levelPrompt

    console.log("Engine: " + engine)
    console.log("Prompt: " + levelPrompt)

    logMessage("Chosen engine: " + engine)
    logMessage("# of images: " + promptCount)
    logMessage("Level prompt: " + levelPrompt)

    return
    
    var levelGenerator = new LevelGenerator(engine)

    get_prompt_ai(levelGenerator, levelPrompt, 0, promptCount, loader)
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


//-------- class defs ---------//

class Loader {
    constructor(type) {
        this.type = type
    }
    
    turnLoaderOn(maxcount) {
        const loader = d.getElementById("loader-div-id")
        const loaderStatus = d.getElementById("progress-status")
        loaderStatus.textContent = "(1/"+maxcount+") "
        loader.style.display = "flex"
    }
    
    updateLoader(count, maxcount) {
        const loaderStatus = d.getElementById("progress-status")
        loaderStatus.textContent = "("+count+"/"+maxcount+") "
    }
    
    turnLoaderOff() {
        const loader = d.getElementById("loader-div-id")
        loader.style.display = "none"
    }
}

class LevelGenerator {
    constructor(engine) {
        this.prompts = []
        this.engine = engine
    }
}