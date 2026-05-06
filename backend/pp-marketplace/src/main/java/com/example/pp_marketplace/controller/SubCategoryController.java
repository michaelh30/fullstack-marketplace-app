package com.example.pp_marketplace.controller;

import com.example.pp_marketplace.dto.SubCategoryDTO;
import com.example.pp_marketplace.entity.Game;
import com.example.pp_marketplace.entity.SubCategory;
import com.example.pp_marketplace.repository.GameRepository;
import com.example.pp_marketplace.repository.SubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/subcategories")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SubCategoryController {

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Autowired
    private GameRepository gameRepository;

    @GetMapping("/game/{gameId}")
    public List<SubCategoryDTO> getSubCategoriesByGame(@PathVariable Long gameId) {
        return subCategoryRepository.findByGameId(gameId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public SubCategoryDTO createSubCategory(@RequestBody SubCategoryDTO subCategoryDTO) {
        Game game = gameRepository.findById(subCategoryDTO.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        SubCategory subCategory = SubCategory.builder()
                .game(game)
                .name(subCategoryDTO.getName())
                .description(subCategoryDTO.getDescription())
                .build();

        return convertToDTO(subCategoryRepository.save(subCategory));
    }

    @PutMapping("/{id}")
    public SubCategoryDTO updateSubCategory(@PathVariable Long id, @RequestBody SubCategoryDTO subCategoryDTO) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));

        if (subCategoryDTO.getGameId() != null) {
            Game game = gameRepository.findById(subCategoryDTO.getGameId())
                    .orElseThrow(() -> new RuntimeException("Game not found"));
            subCategory.setGame(game);
        }
        if (subCategoryDTO.getName() != null) {
            subCategory.setName(subCategoryDTO.getName());
        }
        if (subCategoryDTO.getDescription() != null) {
            subCategory.setDescription(subCategoryDTO.getDescription());
        }

        return convertToDTO(subCategoryRepository.save(subCategory));
    }

    @DeleteMapping("/{id}")
    public void deleteSubCategory(@PathVariable Long id) {
        subCategoryRepository.deleteById(id);
    }

    private SubCategoryDTO convertToDTO(SubCategory subCategory) {
        return SubCategoryDTO.builder()
                .id(subCategory.getId())
                .gameId(subCategory.getGame().getId())
                .gameName(subCategory.getGame().getName())
                .name(subCategory.getName())
                .description(subCategory.getDescription())
                .createdAt(subCategory.getCreatedAt())
                .build();
    }
}
