from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from httpx import AsyncClient

import logging
from serverLogic.chatgpt import get_chat_gpt_response, get_chat_gpt_prompt
from serverLogic.openai_endpoint import get_create_image
from serverLogic.goapi_endpoint import get_midjourney_image
import uvicorn

logger = logging.getLogger("uvicorn")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/", StaticFiles(directory="./client/dist",html = True), name="static")

@app.post("/generate-prompt/")
async def generate_chat(request: Request):
    try:
        prompt = await request.json()

        if not prompt:
            raise ValueError("Prompt cannot be empty.")

        # Call the ChatGPT API to generate the response
        response = get_chat_gpt_prompt(prompt['prompt'])

        return JSONResponse(content=response, status_code=200)

    except Exception as e:
        logger.error(str(e))
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/generate-img/")
async def generate_img_response(request: Request):
    try:
        prompt = await request.json()
        logger.info(prompt)

        if not prompt:
            raise ValueError("Prompt cannot be empty.")

        if prompt["engine"] == "OpenAI":
            # Call the ChatGPT API to generate the response
            response = get_create_image(prompt['prompt'])
        elif prompt["engine"] == "Midjourney":
            # Call the GoAPI to MidJourney to generate the response
            response = get_midjourney_image(prompt['prompt'])

        return JSONResponse(content=response, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)