package my_refrigerator.controller;

import my_refrigerator.entity.UserIngredient;
import my_refrigerator.service.IngredientService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/ingredients")
public class IngredientController {
    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    public List<UserIngredient> getAll() {
        return ingredientService.getAllIngredients();
    }

    @PostMapping
    public UserIngredient add(@RequestBody UserIngredient ing) {
        return ingredientService.addIngredient(ing);
    }

    @PutMapping("/{name}")
    public UserIngredient update(@PathVariable String name, @RequestBody UserIngredient ing) {
        return ingredientService.updateByName(name, ing);
    }

    @DeleteMapping("/{name}")
    public void delete(@PathVariable String name) {
        ingredientService.deleteByName(name);
    }
}
