package my_refrigerator.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import my_refrigerator.dto.RecipeDto;
import my_refrigerator.entity.Recipe;
import my_refrigerator.entity.UserIngredient;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class RecipeService {
    private final WebClient webClient;

    public RecipeService() {
        this.webClient = WebClient.create("http://localhost:5000");
    }

    public List<RecipeDto> recommendRecipe() throws Exception {
        LocalDate aWeekLater = LocalDate.now().plusWeeks(1);

        // Firestore에서 유통기한 임박 재료 조회
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference ingredientsRef = db.collection("user_ingredients");
        ApiFuture<QuerySnapshot> future = ingredientsRef.whereLessThan("expiryDate", aWeekLater.toString()).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        if (documents.isEmpty()) {
            throw new IllegalStateException("유통기한 임박 재료가 없습니다.");
        }

        List<UserIngredient> expiring = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            expiring.add(doc.toObject(UserIngredient.class));
        }

        List<String> keywords = expiring.stream()
                .sorted(Comparator.comparing(UserIngredient::getExpiryDate))
                .limit(5)
                .map(UserIngredient::getName)
                .toList();

        List<RecipeDto> results = new ArrayList<>();

        for (String keyword : keywords) {
            // Firestore에서 레시피 검색
            CollectionReference recipesRef = db.collection("recipes");
            ApiFuture<QuerySnapshot> recipeFuture = recipesRef.whereGreaterThanOrEqualTo("name", keyword).get();
            List<QueryDocumentSnapshot> recipeDocs = recipeFuture.get().getDocuments();

            if (!recipeDocs.isEmpty()) {
                for (QueryDocumentSnapshot doc : recipeDocs) {
                    results.add(toDto(doc.toObject(Recipe.class)));
                }
                continue;
            }

            // DB에 없을 경우 크롤링
            List<RecipeDto> crawled = crawling(keyword);
            results.addAll(crawled);

            // 크롤링 -> Firestore 저장
            for (RecipeDto dto : crawled) {
                Recipe recipe = toEntity(dto);
                recipesRef.add(recipe);
            }
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
