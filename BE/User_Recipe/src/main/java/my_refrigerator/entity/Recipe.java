package my_refrigerator.entity;

import my_refrigerator.entity.value.RecipeStep;
import java.util.List;

public class Recipe {
    private String id;
    private String name;
    private String mainImageUrl;
    private List<String> ingredients;
    private List<RecipeStep> steps;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getMainImageUrl() {
        return mainImageUrl;
    }
    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }
    public List<String> getIngredients() {
        return ingredients;
    }
    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }
    public List<RecipeStep> getSteps() {
        return steps;
    }
    public void setSteps(List<RecipeStep> steps) {
        this.steps = steps;
    }
}
