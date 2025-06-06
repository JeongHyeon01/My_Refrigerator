package my_refrigerator.controller;

import my_refrigerator.entity.UserIngredient;
import my_refrigerator.service.IngredientService;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@CrossOrigin(origins = "http://localhost:5174") // Vite 개발 서버
public class IngredientController {
    private final IngredientService ingredientService;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    public List<UserIngredient> getByUserId(@RequestParam String userId) throws Exception {
        return ingredientService.getIngredientsByUserId(userId);
    }

    @PostMapping
    public UserIngredient add(@RequestBody UserIngredient ing) throws Exception {
        if (ing.getExpiryDate() == null && ing.getExpiryDateStr() != null) {
            ing.setExpiryDate(LocalDate.parse(ing.getExpiryDateStr(), formatter));
        }
        return ingredientService.addIngredient(ing);
    }

    @PatchMapping("/{id}")
    public UserIngredient updateQuantity(@PathVariable String id, @RequestBody UserIngredient ing) throws Exception {
        return ingredientService.updateQuantity(id, ing.getQuantity());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) throws Exception {
        ingredientService.deleteById(id);
    }
}
