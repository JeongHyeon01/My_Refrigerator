from flask import Flask, jsonify, request
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)
CORS(app)

HEADERS = {"User-Agent": "Mozilla/5.0"}

def crawl_recipe_detail(url):
    try:
        res = requests.get(url, headers=HEADERS, timeout=5)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, 'html.parser')

        def clean_ingredient(text):
            cleaned = text.replace("구매", "").replace("\n", " ").replace("\r", " ").strip()
            return ' '.join(cleaned.split())

        ingredients = [clean_ingredient(li.text) for li in soup.select('.ready_ingre3 ul li')]

        steps = []
        step_containers = soup.select('.view_step_cont')
        step_images = soup.select('.view_step_cont img')

        for i, step_el in enumerate(step_containers):
            desc = step_el.text.strip()
            img_url = step_images[i]['src'] if i < len(step_images) else ""
            steps.append({
                "imageUrl": img_url,
                "description": desc
            })

        return ingredients, steps

    except Exception as e:
        print(f"Error crawling detail page {url}: {e}")
        return None, None

@app.route('/recommend', methods=['GET'])
def crawl_recipes():
    keyword = request.args.get("keyword")
    if not keyword:
        return jsonify({"error": "No keyword provided"}), 400

    url = f"https://www.10000recipe.com/recipe/list.html?q={keyword}"

    try:
        res = requests.get(url, headers=HEADERS, timeout=5)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, 'html.parser')

        recipes = []
        max_recipes = 5

        for item in soup.select(".common_sp_list_li")[:max_recipes]:
            name = item.select_one(".common_sp_caption_tit").text.strip()
            link_suffix = item.select_one("a.common_sp_link")["href"]
            detail_url = "https://www.10000recipe.com" + link_suffix

            main_image_tag = item.select_one(".common_sp_thumb img")
            main_image_url = main_image_tag['src'] if main_image_tag else ""

            ingredients_list, steps_list = crawl_recipe_detail(detail_url)

            recipes.append({
                "name": name,
                "mainImageUrl": main_image_url,
                "ingredients": ingredients_list or [],
                "steps": steps_list or []
            })

        return jsonify(recipes)

    except Exception as e:
        print(f"Error crawling main list page: {e}")
        return jsonify({"error": "Failed to crawl recipes"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)