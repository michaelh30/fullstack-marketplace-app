package com.example.pp_marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubCategoryDTO {
    private Long id;
    private String name;
    private String description;
    private Long gameId;
    private String gameName;
    private LocalDateTime createdAt;
}
