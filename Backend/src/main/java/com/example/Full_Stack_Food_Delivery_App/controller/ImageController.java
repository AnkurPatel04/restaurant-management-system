package com.example.Full_Stack_Food_Delivery_App.controller;

import com.example.Full_Stack_Food_Delivery_App.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file) {

        Map result = imageService.uploadImage(file);

        String imageUrl = result.get("secure_url").toString();
        String publicId = result.get("public_id").toString();

        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        response.put("publicId", publicId);

        return ResponseEntity.ok(response);
    }




//    private final ImageService imageService;
//
//    // GET IMAGE FOR BROWSER / <img src="">
//    @GetMapping("/view/{id}")
//    public ResponseEntity<byte[]> getImage(@PathVariable String id)
//            throws IOException {
//
//        GridFsResource resource = imageService.getImageResource(id);
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.parseMediaType(resource.getContentType()))
//                .body(resource.getInputStream().readAllBytes());
//    }
}
