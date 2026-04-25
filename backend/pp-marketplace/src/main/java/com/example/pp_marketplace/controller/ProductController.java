package com.example.pp_marketplace.controller;

import com.example.pp_marketplace.dto.ProductDTO;
import com.example.pp_marketplace.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/game/{gameId}")
    public List<ProductDTO> getProductsByGame(@PathVariable Long gameId) {
        return productService.getProductsByGame(gameId);
    }

    @GetMapping("/subcategory/{subCategoryId}")
    public List<ProductDTO> getProductsBySubCategory(@PathVariable Long subCategoryId) {
        return productService.getProductsBySubCategory(subCategoryId);
    }

    @GetMapping("/game/{gameId}/subcategory/{subCategoryId}")
    public List<ProductDTO> getProductsByGameAndSubCategory(@PathVariable Long gameId, @PathVariable Long subCategoryId) {
        return productService.getProductsByGameAndSubCategory(gameId, subCategoryId);
    }

    @GetMapping("/search")
    public List<ProductDTO> searchProducts(@RequestParam String term) {
        return productService.searchProducts(term);
    }

    @GetMapping("/search/game/{gameId}")
    public List<ProductDTO> searchProductsByGame(@PathVariable Long gameId, @RequestParam String term) {
        return productService.searchProductsByGame(gameId, term);
    }

    @GetMapping("/top-rated/game/{gameId}")
    public List<ProductDTO> getTopRatedProducts(@PathVariable Long gameId) {
        return productService.getTopRatedProducts(gameId);
    }

    @GetMapping("/cheapest/game/{gameId}")
    public List<ProductDTO> getCheapestProducts(@PathVariable Long gameId) {
        return productService.getCheapestProducts(gameId);
    }
}
