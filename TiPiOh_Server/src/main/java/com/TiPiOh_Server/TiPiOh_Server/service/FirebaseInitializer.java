package com.TiPiOh_Server.TiPiOh_Server.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Service
public class FirebaseInitializer {

    @PostConstruct
    private void initDB() throws IOException {

        InputStream serviceAccount =
                this.getClass().getClassLoader().getResourceAsStream("./tipioh-5eba5-firebase-adminsdk-v97pl-611b411ac6.json");

        FirebaseOptions options = new FirebaseOptions.Builder()
                                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                                    .setDatabaseUrl("https://tipioh-5eba5-default-rtdb.firebaseio.com")
                                    .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }

    public Firestore getFirebase() {
        return FirestoreClient.getFirestore();
    }
}
