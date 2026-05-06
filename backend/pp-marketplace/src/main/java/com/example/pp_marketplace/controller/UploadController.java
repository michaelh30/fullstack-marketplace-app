package com.example.pp_marketplace.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UploadController {

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        String originalFilename = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
        String extension = "";
        int extensionIndex = originalFilename.lastIndexOf('.');
        if (extensionIndex >= 0) {
            extension = originalFilename.substring(extensionIndex).toLowerCase();
        }

        String safeName = originalFilename
                .replaceAll("[^a-zA-Z0-9._-]", "-")
                .replaceAll("-+", "-");
        String filename = UUID.randomUUID() + "-" + safeName;
        if (!filename.endsWith(extension)) {
            filename = filename + extension;
        }

        Path projectRoot = Paths.get(System.getProperty("user.dir")).getParent().getParent();
        Path imageDirectory = projectRoot.resolve("frontend/pp-marketplace-fe/public/images").normalize();
        Files.createDirectories(imageDirectory);

        Path destination = imageDirectory.resolve(filename).normalize();
        if (!destination.startsWith(imageDirectory)) {
            throw new RuntimeException("Invalid file path");
        }

        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        return ResponseEntity.ok(Map.of("url", "/images/" + filename));
    }
}
