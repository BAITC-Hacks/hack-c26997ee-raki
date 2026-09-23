from pathlib import Path
import json


ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"


def load_json(filename: str):
    path = DATA_DIR / filename

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def load_districts():
    return load_json("districts.json")


def load_measures():
    return load_json("measures.json")


def load_scoring():
    return load_json("scoring.json")
