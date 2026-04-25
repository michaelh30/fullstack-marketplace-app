package com.example.pp_marketplace.service;

import com.example.pp_marketplace.dto.ReviewDTO;
import com.example.pp_marketplace.entity.Review;
import com.example.pp_marketplace.entity.Product;
import com.example.pp_marketplace.entity.User;
import com.example.pp_marketplace.repository.ReviewRepository;
import com.example.pp_marketplace.repository.ProductRepository;
import com.example.pp_marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public ReviewDTO addReview(Long productId, Long userId, Integer rating, String comment) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review existingReview = reviewRepository.findByProductIdAndUserId(productId, userId).orElse(null);
        if (existingReview != null) {
            existingReview.setRating(rating);
            existingReview.setComment(comment);
            existingReview.setUpdatedAt(LocalDateTime.now());
            reviewRepository.save(existingReview);
            return convertToDTO(existingReview);
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(rating)
                .comment(comment)
                .build();

        review = reviewRepository.save(review);
        updateProductRating(productId);
        return convertToDTO(review);
    }

    public List<ReviewDTO> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        Long productId = review.getProduct().getId();
        reviewRepository.deleteById(reviewId);
        updateProductRating(productId);
    }

    private void updateProductRating(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<Review> reviews = reviewRepository.findByProductId(productId);
        if (reviews.isEmpty()) {
            product.setRating(BigDecimal.ZERO);
            product.setReviewCount(0);
        } else {
            double avgRating = reviews.stream()
                    .mapToDouble(r -> r.getRating())
                    .average()
                    .orElse(0);
            product.setRating(BigDecimal.valueOf(avgRating));
            product.setReviewCount(reviews.size());
        }

        productRepository.save(product);
    }

    private ReviewDTO convertToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFullName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
