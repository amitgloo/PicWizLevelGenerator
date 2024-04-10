"use strict";

const d = document;
const CONTEXT = `
Pic Wiz is your ultimate destination for picture-guessing fun with friends. Imagine merging the thrill of art-based riddles with the joy of multiplayer collaboration. Enter Pic Wiz – the perfect game for sharpening your mind while connecting with others.
In Pic Wiz, it's not just about what you see but how you think and solve with your friends. How effectively can you and your team analyze images to uncover hidden objects or phrases? Can you work together to decipher the artistic clues? Engage in this exciting challenge, where teamwork and strategy combine to create a unique, brain-teasing experience. Get ready for endless fun as you.
Here are examples of caption and level description output:

caption: I have a dream
level output: Martin Luther King, sleeping on a cloud. Realistic 3d render Pixar style. 32k. pastel colors, with a light solid background

caption: better late than never
level output: Realistic 3d render of An 70-year-old woman smiles in her graduation clothes, and lots of young students in their graduation clothes. Everyone is wearing the same clothes. Pixar style. 32k. pastel colors, with a light solid background

caption: ceaser salad
level output: Realistic 3d render of A Roman emperor cutting a salad. Pixar style. 32k. pastel colors, with a light solid background

capition: do not judge a book by its cover
level output: Realistic 3d render of A judge in court holds a book. with a white wig. Pixar style. 32k. pastel colors, with a light solid background

caption: mac and cheese
level output: A Mac computer with a slice of cheese on the side

caption: turtleneck
level output: A tattoo of a turtle on the neck

from now on I will query with a caption and you should only responsd with a level output
`
var OPENAI_API_KEY="";
var GOAPI_KEY = "";

function fetch_img(task_id, levelGenerator, index, loader, callback) {
    fetch("https://api.midjourneyapi.xyz/mj/v2/fetch", {
        method: 'POST',
        body: JSON.stringify({ task_id })
     })
    .then((response) => response.json())
    .then((response) => {
        if (response["status"] == "finished") {
            callback(response["task_result"]["image_url"], levelGenerator, index, loader)
        } else {
            logMessage("Current request status: `"+response["status"]+"`)")
            logMessage("Sleeping for 5 seconds...")
            setTimeout(() => {
                return fetch_img(task_id, levelGenerator, index, loader, callback)
              }, 5000);
        }
    })
    .catch((error) => {
        console.error(error);
  });
}

function get_midjourney_image(levelGenerator, index, loader, callback) {
    if (levelGenerator.prompts.length <= index) {
        logMessage("Finished Successfullly!")
        loader.turnLoaderOff()
        return;
    }

    loader.updateLoader(index, levelGenerator.prompts.length)
    logMessage("("+index+"/"+levelGenerator.prompts.length+") - image generation...")
    
    fetch("https://api.midjourneyapi.xyz/mj/v2/imagine", {
        method: 'POST',
        body: JSON.stringify({
            "prompt": levelGenerator.prompts[index],
            "aspect_ratio": "4:3",
            "process_mode": "fast",
            "webhook_endpoint": "",
            "webhook_secret": ""
          }),
        headers: { "X-API-KEY": GOAPI_KEY }
     })
    .then((response) => response.json())
    .then((response) => {
        fetch_img(response["task_id"], levelGenerator, index, loader, callback)
    })
    .catch((error) => {
        console.error(error);
  });
}

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
        get_image_from_prompts(levelGenerator, loader)
        return;
    }

    loader.updateLoader(called, total_calls)
    logMessage("("+called+"/"+total_calls+") - prompt generation...")

    fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ OPENAI_API_KEY
        },
        body: JSON.stringify({
            messages: [
              {"role": "system", "content": CONTEXT},
              {"role": "user", "content": prompt}
            ],
            model: "gpt-4-0125-preview",
        })
    })
    .then((response) => response.json())
    .then((out_prompt) => {
        console.log(out_prompt)
        out_prompt = out_prompt.choices[0].message.content
        // var demoPic = d.getElementById("prompt-area-"+called)
        // demoPic.textContent = out_prompt
        logMessage("\nprompt #"+called+": "+out_prompt+"\n")
        called++
        levelGenerator.prompts.push(out_prompt)
        get_prompt_ai(levelGenerator, prompt, called, total_calls, loader)
    })
    .catch(error => {
        // Error occurred during the fetch
        console.error('Error submitting form data:', error);
    });
}

function get_image_from_prompts(levelGenerator, loader) {
    get_midjourney_image(levelGenerator, 0, loader, callback_image_from_prompts)
}

function callback_image_from_prompts(url, levelGenerator, index, loader) {
    console.log(url)
    var demoPic = d.getElementById("out-pic-"+index)
    demoPic.src = url
    demoPic.addEventListener("load", () => {
        get_midjourney_image(levelGenerator, index+1, loader, callback_image_from_prompts)
    })
}

const askGenPromptAI = d.getElementById("gen-prompts-form")
askGenPromptAI.addEventListener("submit", (e) => {
    e.preventDefault();
    
    OPENAI_API_KEY=d.getElementById("openai-key").value
    GOAPI_KEY=d.getElementById("goapi-key").value

    logMessage("Using OPENAI_API_KEY: "+OPENAI_API_KEY)
    logMessage("Using GOAPI_KEY: "+GOAPI_KEY)
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

    logMessage("Chosen engine: " + engine)
    logMessage("Number of images: " + promptCount)
    logMessage("Level prompt: " + levelPrompt)

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