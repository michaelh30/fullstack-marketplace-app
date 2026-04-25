package com.example.pp_marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private BigDecimal rating;
    private Integer reviewCount;
    private Long gameId;
    private String gameName;
    private Long subCategoryId;
    private String subCategoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
