package my_refrigerator.repository;

import my_refrigerator.entity.UserIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface IngredientRepository extends JpaRepository<UserIngredient, Long> {
    Optional<UserIngredient> findByName(String name);
    void deleteByName(String name);
    List<UserIngredient> findByExpiryDateBefore(LocalDate date);
}
