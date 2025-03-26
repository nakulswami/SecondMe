"""L2 Generator module for handling L2 level data processing and model operations.

This module provides the L2Generator class which is responsible for data preprocessing,
subjective data generation, model conversion, and inference with the trained model.
"""

from typing import Dict, List
import os

from openai import OpenAI

from lpm_kernel.L1.bio import Note
from lpm_kernel.L2.data import L2DataProcessor
import yaml
import logging
from lpm_kernel.L2.data_pipeline.data_prep.preference.preference_QA_generate import PreferenceQAGenerator
from lpm_kernel.L2.data_pipeline.data_prep.diversity.diversity_data_generator import DiversityDataGenerator
from lpm_kernel.L2.data_pipeline.data_prep.selfqa.selfqa_generator import SelfQA
import json

class L2Generator:
    """L2 level generator for handling data and model operations.
    
    This class manages operations related to L2 processing, including data preprocessing,
    subjective data generation, model conversion, and model inference.
    
    Attributes:
        data_path: Path to the raw data directory.
        data_processor: Instance of L2DataProcessor for handling data processing.
    """

    def __init__(self, data_path: str = "../raw_data", prefered_lang: str = "English"):
        """Initialize the L2Generator with data path and preferred language.
        
        Args:
            data_path: Path to the raw data directory. Defaults to "../raw_data".
            prefered_lang: Preferred language for data processing. Defaults to "English".
        """
        self.data_path = data_path
        self.data_processor = L2DataProcessor(data_path, prefered_lang)
        self.prefered_lang = prefered_lang
        
    def data_preprocess(self, note_list: List[Note], basic_info: Dict):
        """Preprocess the input notes and basic information.
        
        Args:
            note_list: List of Note objects to process.
            basic_info: Dictionary containing basic user information.
        """
        self.data_processor(note_list, basic_info)

    def gen_subjective_data(
        self,
        note_list: List[Note],
        basic_info: Dict,
        data_output_base_dir: str,
        topics_path: str,
        entities_path: str,
        graph_path: str,
        config_path: str,
    ):
        """Generate subjective data based on input notes and user information.
        
        Args:
            note_list: List of Note objects.
            basic_info: Dictionary containing basic user information.
            data_output_base_dir: Base directory for output data.
            topics_path: Path to topics data.
            entities_path: Path to entities data.
            graph_path: Path to graph data.
            config_path: Path to configuration file.
        """
        global_bio = basic_info["globalBio"]
        user_name = basic_info["username"]
        user_intro = basic_info["aboutMe"]

        preference_output_path = "preference.json"
        diversity_output_path = "diversity.json"
        selfqa_output_path = "selfqa.json"

        self.data_processor.gen_subjective_data(
            note_list,
            data_output_base_dir,
            preference_output_path,
            diversity_output_path,
            selfqa_output_path,
            global_bio,
            topics_path,
            entities_path,
            graph_path,
            user_name,
            config_path,
            user_intro,
        )

    def gen_preference_data(
        self,
        note_list: List[Note],
        basic_info: Dict,
        data_output_base_dir: str,
        topics_path: str,
        entities_path: str,
        graph_path: str,
        config_path: str,
    ):
        global_bio = basic_info["globalBio"]
        preference_output_path = os.path.join(data_output_base_dir, "preference.json")

        processor = PreferenceQAGenerator(
            filename=topics_path, bio=global_bio, preference_language=self.prefered_lang
        )
        processor.process_clusters(preference_output_path)
    
    def gen_diversity_data(
        self, 
        note_list: List[Note], 
        basic_info: Dict, 
        data_output_base_dir: str, 
        topics_path: str, 
        entities_path: str, 
        graph_path: str, 
        config_path: str
    ):
        global_bio = basic_info["globalBio"]
        user_name = basic_info["username"]
        output_path = os.path.join(data_output_base_dir, "diversity.json")

        processor = DiversityDataGenerator(self.prefered_lang)
        processor.generate_data(
            entities_path, note_list, config_path, graph_path, user_name, global_bio, output_path
        )

    def gen_selfqa_data(
        self, 
        note_list: List[Note], 
        basic_info: Dict, 
        data_output_base_dir: str, 
        topics_path: str, 
        entities_path: str, 
        graph_path: str, 
        config_path: str
    ):
        global_bio = basic_info["globalBio"]
        user_name = basic_info["username"]
        user_intro = basic_info["aboutMe"]
        output_path = os.path.join(data_output_base_dir, "selfqa.json")

        selfqa = SelfQA(
            user_name=user_name,
            user_input_introduction=user_intro,
            user_global_bio= global_bio,
            preferred_language=self.prefered_lang,
        )
        q_a_list = selfqa.generate_qa()
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(q_a_list, f, ensure_ascii=False, indent=4)

    def clean_graphrag_keys(self):
        GRAPH_CONFIG = os.path.join(
            os.getcwd(), "lpm_kernel/L2/data_pipeline/graphrag_indexing/settings.yaml"
        )

        with open(GRAPH_CONFIG, "r", encoding="utf-8") as file:
            settings = yaml.safe_load(file)
        
        settings["input"]["base_dir"] = "/your_dir"
        settings["output"]["base_dir"] = "/your_dir"
        settings["reporting"]["base_dir"] = "/your_dir"
        settings["models"]["default_chat_model"]["api_key"] = "sk-xxxxxx"
        
        ENV_CONFIG = os.path.join(
            os.getcwd(), "lpm_kernel/L2/data_pipeline/graphrag_indexing/.env"
        )
        with open(ENV_CONFIG, "w", encoding="utf-8") as file:
            file.write("GRAPHRAG_API_KEY=sk-xxxxxx")
        
        with open(GRAPH_CONFIG, "w", encoding="utf-8") as file:
            yaml.dump(settings, file, default_flow_style=False, allow_unicode=True)
        logging.info("Graphrag config updated successfully")
