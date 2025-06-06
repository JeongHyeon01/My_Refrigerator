package my_refrigerator.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecipeCrawlerService {

    public List<Map<String, Object>> crawlRecipes(String ingredient) throws Exception {
        List<Map<String, Object>> recipes = new ArrayList<>();
        
        // 만개의 레시피 검색 URL
        String searchUrl = "https://www.10000recipe.com/recipe/list.html";
        if (ingredient != null && !ingredient.isEmpty()) {
            searchUrl += "?q=" + ingredient;
        }

        // 웹페이지 크롤링
        Document doc = Jsoup.connect(searchUrl)
                .userAgent("Mozilla/5.0")
                .timeout(5000)
                .get();

        // 레시피 목록 추출
        Elements recipeElements = doc.select(".common_sp_list_li");
        
        for (Element element : recipeElements) {
            Map<String, Object> recipe = new HashMap<>();
            
            // 레시피 제목
            Element titleElement = element.select(".common_sp_caption_tit").first();
            if (titleElement != null) {
                recipe.put("name", titleElement.text());
            }

            // 레시피 링크
            Element linkElement = element.select("a").first();
            if (linkElement != null) {
                String recipeUrl = "https://www.10000recipe.com" + linkElement.attr("href");
                recipe.put("url", recipeUrl);
                
                // 상세 페이지 크롤링
                Document recipeDoc = Jsoup.connect(recipeUrl)
                        .userAgent("Mozilla/5.0")
                        .timeout(5000)
                        .get();

                // 재료 목록
                Elements ingredients = recipeDoc.select(".ready_ingre3 li");
                List<String> ingredientList = new ArrayList<>();
                for (Element ing : ingredients) {
                    ingredientList.add(ing.text().trim());
                }
                recipe.put("ingredients", ingredientList);

                // 조리 순서
                Elements steps = recipeDoc.select(".view_step_cont");
                List<String> stepList = new ArrayList<>();
                for (Element step : steps) {
                    stepList.add(step.text().trim());
                }
                recipe.put("steps", stepList);
            }

            recipes.add(recipe);
        }

        return recipes;
    }
} 