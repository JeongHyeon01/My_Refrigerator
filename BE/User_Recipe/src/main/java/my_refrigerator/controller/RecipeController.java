package my_refrigerator.controller;

import my_refrigerator.dto.RecipeDto;
import my_refrigerator.service.RecipeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/recommend")
@CrossOrigin(origins = "http://localhost:5174") // Vite 개발 서버
public class RecipeController {
    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public List<RecipeDto> recommend() throws Exception {
        return recipeService.recommendRecipe();
    }
}
