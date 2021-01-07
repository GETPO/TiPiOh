package com.TiPiOh_Server.TiPiOh_Server.controller;

import com.TiPiOh_Server.TiPiOh_Server.model.UserProfile;
import com.TiPiOh_Server.TiPiOh_Server.service.FirebaseInitializer;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController // Spring Framework 이 자동으로 이 클래스를 컨트롤러로 인식하게 해주는 annotation
public class UserProfileController {
    @Autowired
    FirebaseInitializer db;

    @GetMapping("/user/all")    //모든 정보 조회
    public List<UserProfile> getUserProfileList () throws ExecutionException, InterruptedException {
        List<UserProfile> userList = new ArrayList<UserProfile>();
        CollectionReference userProfile = db.getFirebase().collection("UserProfile");
        ApiFuture<QuerySnapshot> querySnapshot = userProfile.get();

        for (DocumentSnapshot doc : querySnapshot.get().getDocuments()) {
            UserProfile user = doc.toObject(UserProfile.class);
            userList.add(user);
        }
        return userList;
    }

}
