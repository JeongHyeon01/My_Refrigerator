package my_refrigerator.controller;

import my_refrigerator.service.RecipeCrawlerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:3000")
public class RecipeCrawlerController {

    @Autowired
    private RecipeCrawlerService recipeCrawlerService;

    @GetMapping("/crawl")
    public ResponseEntity<List<Map<String, Object>>> crawlRecipes(
            @RequestParam(required = false) String ingredient) {
        try {
            List<Map<String, Object>> recipes = recipeCrawlerService.crawlRecipes(ingredient);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 