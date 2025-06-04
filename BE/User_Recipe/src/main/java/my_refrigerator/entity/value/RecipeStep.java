package my_refrigerator.entity.value;

import jakarta.persistence.Embeddable;

@Embeddable
public class RecipeStep {
    private String imageUrl;
    private String description;

    public String getImageUrl() {
        return imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
