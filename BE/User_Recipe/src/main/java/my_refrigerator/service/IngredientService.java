package my_refrigerator.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import my_refrigerator.entity.UserIngredient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class IngredientService {
    public List<UserIngredient> getAllIngredients() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection("user_ingredients").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<UserIngredient> result = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            result.add(doc.toObject(UserIngredient.class));
        }
        return result;
    }

    public UserIngredient addIngredient(UserIngredient ing) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        db.collection("user_ingredients").add(ing);
        return ing;
    }

    public UserIngredient updateByName(String name, UserIngredient ing) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference ref = db.collection("user_ingredients");
        ApiFuture<QuerySnapshot> future = ref.whereEqualTo("name", name).get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();
        if (docs.isEmpty()) throw new RuntimeException("식재료를 찾을 수 없습니다.");
        DocumentReference docRef = docs.get(0).getReference();
        docRef.set(ing);
        return ing;
    }

    public void deleteByName(String name) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference ref = db.collection("user_ingredients");
        ApiFuture<QuerySnapshot> future = ref.whereEqualTo("name", name).get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();
        for (QueryDocumentSnapshot doc : docs) {
            doc.getReference().delete();
        }
    }

    public List<UserIngredient> getIngredientsByUserId(String userId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection("user_ingredients").whereEqualTo("userId", userId).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<UserIngredient> result = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            result.add(doc.toObject(UserIngredient.class));
        }
        return result;
    }

    public UserIngredient updateQuantity(String id, int quantity) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("user_ingredients").document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot doc = future.get();
        if (!doc.exists()) throw new RuntimeException("식재료를 찾을 수 없습니다.");
        UserIngredient ingredient = doc.toObject(UserIngredient.class);
        ingredient.setQuantity(quantity);
        docRef.set(ingredient);
        return ingredient;
    }

    public void deleteById(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        db.collection("user_ingredients").document(id).delete();
    }
}
