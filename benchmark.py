from benchmark.settings.levelConfigs import LEVEL_CAPTIONS

from benchmark.models.promptModels.openaiPromptModel import openai_prompt_model
from benchmark.models.imageModels.openaiImageModel import openai_image_model
from benchmark.models.imageModels.midjourneyImageModel import midjourney_image_model

from urllib.request import urlretrieve
import logging
import requests
import os
from pathlib import Path

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class Benchmark:
    def __init__(self, level_captions, prompt_models, image_models, results_dir, output_json):
        self.level_captions = level_captions
        self.prompt_models = prompt_models
        self.image_models = image_models
        self.output_json = output_json
        self.results_dir = results_dir
        self.global_id = 0
    
    def run(self):
        for prompt_model in self.prompt_models:
            for image_model in self.image_models:
                output_dir = self.create_results_dir(prompt_model, image_model)
                for level_caption in self.level_captions:
                    self.run_iteration(level_caption, prompt_model, image_model, output_dir)

    def create_results_dir(self, prompt_model, image_model):
        base_model_result = os.path.join(self.results_dir, str(prompt_model)) 
        if not os.path.isdir(base_model_result):
            os.mkdir(base_model_result)

        full_result_path = os.path.join(base_model_result, str(image_model))
        if not os.path.isdir(full_result_path):
                os.mkdir(full_result_path)

        return full_result_path


    def run_iteration(self, level_caption, prompt_model, image_model, output_dir):
        logger.info(f"""Running - 
                    level_caption: {level_caption},
                    prompt_model: {prompt_model},
                    image_model: {image_model}""")
        output_dict = {
            "level_caption": level_caption,
            "prompt_model": prompt_model,
            "image_model": image_model
        }
        image_prompt = prompt_model.generate_image_prompt(level_caption)
        output_dict["image_prompt"] = image_prompt
        image_url = image_model.generate_image(image_prompt)
        output_dict["image_url"] = image_url
        image_dest = os.path.join(output_dir, "".join([level_caption, " id ", str(self.global_id), ".png"]))
        output_dict["image_dest"] = image_dest
        logger.info(f"""Finished
                    level_caption: {level_caption},
                    prompt_model: {prompt_model},
                    image_model: {image_model},
                    prompt: {image_prompt},
                    image_url: {image_url},
                    image_dest: {image_dest}
                    """)
        # urlretrieve(image_url, image_dest)
        r = requests.get(image_url)
        with open(image_dest, 'wb') as outfile:
            outfile.write(r.content)

        self.log_output(output_dict)
        self.global_id += 1
    
    def log_output(self, log_dict):
        pass

if __name__ == "__main__":
    benchmark_model = Benchmark(
        LEVEL_CAPTIONS,
        [openai_prompt_model],
        [midjourney_image_model, openai_image_model],
        Path("./benchmark/results/"),
        Path("./benchmark/results/resultDoc.json"))

    benchmark_model.run()