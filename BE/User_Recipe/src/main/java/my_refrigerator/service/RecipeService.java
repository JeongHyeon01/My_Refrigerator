package my_refrigerator.service;

import my_refrigerator.dto.RecipeDto;
import my_refrigerator.entity.Recipe;
import my_refrigerator.entity.UserIngredient;
import my_refrigerator.repository.IngredientRepository;
import my_refrigerator.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class RecipeService {
    private final IngredientRepository ingredientRepository;
    private final RecipeRepository recipeRepository;
    private final WebClient webClient;

    public RecipeService(IngredientRepository ingredientRepository,
                         RecipeRepository recipeRepository) {
        this.ingredientRepository = ingredientRepository;
        this.recipeRepository = recipeRepository;
        this.webClient = WebClient.create("http://localhost:5000");
    }

    public List<RecipeDto> recommendRecipe() {
        LocalDate aWeekLater = LocalDate.now().plusWeeks(1);

        List<UserIngredient> expiring = ingredientRepository.
                                            findByExpiryDateBefore(aWeekLater);

        if (expiring.isEmpty()) {
            throw new IllegalStateException("유통기한 임박 재료가 없습니다.");
        }

        List<String> keywords = expiring.stream().
                                    sorted(Comparator.comparing(UserIngredient::getExpiryDate)).
                                    limit(5).
                                    map(UserIngredient::getName).
                                    toList();

        List<RecipeDto> results = new ArrayList<>();

        for (String keyword : keywords) {
            // 우선 DB 검색
            List<Recipe> recipes = recipeRepository.findTop5ByNameContaining(keyword);
            if (!recipes.isEmpty()) {
                results.addAll(recipes.stream().map(this::toDto).toList());
                continue;
            }

            // DB에 없을 경우 크롤링
            List<RecipeDto> crawled = crawling(keyword);
            results.addAll(crawled);

            // 크롤링 -> DB 저장
            List<Recipe> dtoToEntity = crawled.stream().map(this::toEntity).toList();
            recipeRepository.saveAll(dtoToEntity);
        }

        return results;
    }

    private List<RecipeDto> crawling(String keyword) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/recommend")
                        .queryParam("keyword", keyword).build())
                        .retrieve()
                        .bodyToFlux(RecipeDto.class)
                        .collectList()
                        .block();
    }

    private RecipeDto toDto(Recipe recipe) {
        return new RecipeDto(
                recipe.getName(),
                recipe.getMainImageUrl(),
                recipe.getIngredients(),
                recipe.getSteps()
        );
    }

    private Recipe toEntity(RecipeDto dto) {
        Recipe recipe = new Recipe();
        recipe.setName(dto.getName());
        recipe.setMainImageUrl(dto.getMainImageUrl());
        recipe.setIngredients(dto.getIngredients());
        recipe.setSteps(dto.getSteps());
        return recipe;
    }
}
