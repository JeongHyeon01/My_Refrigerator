package my_refrigerator.dto;

import my_refrigerator.entity.value.RecipeStep;

import java.util.List;

public class RecipeDto {
    private final String name;
    private final String mainImageUrl;
    private final List<String> ingredients;
    private final List<RecipeStep> steps;

    public RecipeDto(String name, String mainImageUrl, List<String> ingredients, List<RecipeStep> steps) {
        this.name = name;
        this.mainImageUrl = mainImageUrl;
        this.ingredients = ingredients;
        this.steps = steps;
    }

    public String getName() {
        return name;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public List<RecipeStep> getSteps() {
        return steps;
    }
}