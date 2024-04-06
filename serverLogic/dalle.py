from settings import API_KEY
from openai import OpenAI

import urllib.request
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import os
import logging
import uvicorn

logger = logging.getLogger("uvicorn")

client = OpenAI(api_key=API_KEY)

OPTION_MODELS = ["gpt-4-vision-preview", "dall-e-3"]

def get_create_image(prompt):
    response = client.images.generate(prompt=prompt,
    n=1,
    size="1024x1024",
    quality="standard",
    model= "dall-e-3")

    logger.info(response.data)
    logger.info(response.data[0])
    url = response.data[0].url
    return url

def present_image(url):
    os.remove("image.png")
    urllib.request.urlretrieve(url, "image.png")
    img = mpimg.imread('image.png')
    plt.imshow(img)
    plt.show()

def main():
    while True:
        prompt = input("Prompt: ")
        url = get_create_image(prompt)
        present_image(url)

if __name__ == "__main__":
    main()