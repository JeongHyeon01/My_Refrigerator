package my_refrigerator.repository;

import my_refrigerator.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findTop5ByNameContaining(String keyword);
}