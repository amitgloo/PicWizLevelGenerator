from benchmark.settings.levelConfigs import LEVEL_CAPTIONS

from benchmark.models.promptModels.openaiPromptModel import openai_prompt_model
from benchmark.models.imageModels.openaiImageModel import openai_image_model
from benchmark.models.imageModels.midjourneyImageModel import midjourney_image_model

from urllib.request import urlretrieve
import logging
import requests
import os
from pathlib import Path
import pandas as pd
import openpyxl
import time

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class Benchmark:
    def __init__(self, level_captions, prompt_models, image_models, results_dir, results_documentation):
        self.level_captions = level_captions
        self.prompt_models = prompt_models
        self.image_models = image_models
        self.results_documentation = results_documentation
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
                    Prompt Model: {prompt_model},
                    Image Model: {image_model}""")
        new_entry = {
            "Level Caption": [level_caption],
            "Prompt Model": [prompt_model],
            "Image Model": [image_model]
        }
        image_prompt = prompt_model.generate_image_prompt(level_caption)
        new_entry["Image Prompt"] = [image_prompt]
        image_url = image_model.generate_image(image_prompt)
        # new_entry["image_url"] = image_url
        image_dest = Path(os.path.join(output_dir, "".join([level_caption, " id ", str(self.global_id), ".png"])))
        new_entry["Image Path"] = [image_dest.relative_to(self.results_dir)]
        new_entry["Image Filename"] = image_dest.name
        logger.info(f"""Finished
                    level_caption: {level_caption},
                    prompt_model: {prompt_model},
                    image_model: {image_model},
                    prompt: {image_prompt},
                    image_url: {image_url},
                    image_dest: {image_dest}
                    """)

        r = requests.get(image_url)
        with open(image_dest, 'wb') as outfile:
            outfile.write(r.content)

        self.log_output(new_entry)
        self.global_id += 1
    
    def log_output(self, new_entry):
        df_new = pd.DataFrame(new_entry)
        df_existing = pd.read_excel(self.results_documentation)
        df_combined = pd.concat([df_existing, df_new], ignore_index=True)
        df_combined.to_excel(output_doc, index=False)

if __name__ == "__main__":
    timestr = time.strftime("test_results_%Y%m%d_%H%M%S")
    result_path = Path(f"./benchmark/results/{timestr}")
    if not os.path.isdir(result_path):
        os.mkdir(result_path)

    logger.info(f"Test: {result_path}")
    output_doc = Path.joinpath(result_path, "results.xlsx")
    if output_doc.is_file():
        raise Exception(f"Cannot override existing results.xlsx! (path: {output_doc})")
   
    df = pd.DataFrame([['<caption>',
                        '<prompt model>',
                        '<image model>',
                        '<image file name>',
                        '<image prompt>',
                        '<image file path>']], columns=[
                            'Level Caption',
                            'Prompt Model',
                            'Image Model',
                            'Image Filename',
                            'Image Prompt',
                            'Image Path'])

    df.to_excel(output_doc, index=False)

    benchmark_model = Benchmark(
        LEVEL_CAPTIONS,
        [openai_prompt_model],
        [openai_image_model, midjourney_image_model],
        result_path,
        output_doc)

    benchmark_model.run()