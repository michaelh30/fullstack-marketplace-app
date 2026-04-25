package com.example.pp_marketplace.controller;

import com.example.pp_marketplace.dto.ReviewDTO;
import com.example.pp_marketplace.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ReviewDTO addReview(@RequestParam Long productId, @RequestParam Long userId, 
                                @RequestParam Integer rating, @RequestParam(required = false) String comment) {
        return reviewService.addReview(productId, userId, rating, comment);
    }

    @GetMapping("/product/{productId}")
    public List<ReviewDTO> getReviewsByProduct(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    @GetMapping("/user/{userId}")
    public List<ReviewDTO> getReviewsByUser(@PathVariable Long userId) {
        return reviewService.getReviewsByUser(userId);
    }

    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
    }
}
