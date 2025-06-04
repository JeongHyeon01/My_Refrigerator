package my_refrigerator.service;
import my_refrigerator.entity.UserIngredient;
import my_refrigerator.repository.IngredientRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredientService {
    private final IngredientRepository repo;

    public IngredientService(IngredientRepository repo) {
        this.repo = repo;
    }

    public List<UserIngredient> getAllIngredients() {
        return repo.findAll();
    }

    public UserIngredient addIngredient(UserIngredient ing) {
        return repo.save(ing);
    }

    public UserIngredient updateByName(String name, UserIngredient ing) {
        UserIngredient existing = repo.findByName(name).orElseThrow();
        existing.setQuantity(ing.getQuantity());
        existing.setExpiryDate(ing.getExpiryDate());
        return repo.save(existing);
    }

    @Transactional
    public void deleteByName(String name) {
        repo.deleteByName(name);
    }
}
