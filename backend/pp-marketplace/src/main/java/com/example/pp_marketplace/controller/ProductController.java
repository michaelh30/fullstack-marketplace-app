package com.example.pp_marketplace.controller;

import com.example.pp_marketplace.dto.PagedResponse;
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

    // -------------------------------------------------------
    // Non-paginated endpoints (admin / internal)
    // -------------------------------------------------------

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/subcategory/{subCategoryId}")
    public List<ProductDTO> getProductsBySubCategory(@PathVariable Long subCategoryId) {
        return productService.getProductsBySubCategory(subCategoryId);
    }

    @GetMapping("/top-rated/game/{gameId}")
    public List<ProductDTO> getTopRatedProducts(@PathVariable Long gameId) {
        return productService.getTopRatedProducts(gameId);
    }

    @GetMapping("/cheapest/game/{gameId}")
    public List<ProductDTO> getCheapestProducts(@PathVariable Long gameId) {
        return productService.getCheapestProducts(gameId);
    }

    // -------------------------------------------------------
    // Paginated listing endpoints (public facing)
    //
    //  Query params:
    //    page  – 0-based page index (default 0)
    //    size  – items per page     (default 20)
    //    sort  – "recommended" | "cheapest" | "top-rated"
    //    search – optional keyword
    // -------------------------------------------------------

    @GetMapping("/game/{gameId}")
    public PagedResponse<ProductDTO> getProductsByGame(
            @PathVariable Long gameId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "recommended") String sort,
            @RequestParam(required = false, defaultValue = "") String search) {

        if (!search.isBlank()) {
            return productService.searchProductsByGamePaged(gameId, search, page, size, sort);
        }
        return productService.getProductsByGamePaged(gameId, page, size, sort);
    }

    @GetMapping("/game/{gameId}/subcategory/{subCategoryId}")
    public PagedResponse<ProductDTO> getProductsByGameAndSubCategory(
            @PathVariable Long gameId,
            @PathVariable Long subCategoryId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "recommended") String sort,
            @RequestParam(required = false, defaultValue = "") String search) {

        if (!search.isBlank()) {
            // search within the subcategory by querying the game endpoint with the same search term
            // (search across game, filter on UI or extend later)
            return productService.searchProductsByGamePaged(gameId, search, page, size, sort);
        }
        return productService.getProductsByGameAndSubCategoryPaged(gameId, subCategoryId, page, size, sort);
    }

    @GetMapping("/search")
    public List<ProductDTO> searchProducts(@RequestParam String term) {
        return productService.searchProducts(term);
    }

    @GetMapping("/search/game/{gameId}")
    public PagedResponse<ProductDTO> searchProductsByGame(
            @PathVariable Long gameId,
            @RequestParam String term,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "recommended") String sort) {
        return productService.searchProductsByGamePaged(gameId, term, page, size, sort);
    }

    // -------------------------------------------------------
    // Write operations
    // -------------------------------------------------------

    @PostMapping
    public ProductDTO createProduct(@RequestBody ProductDTO productDTO) {
        return productService.createProduct(productDTO);
    }

    @PutMapping("/{id}")
    public ProductDTO updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        return productService.updateProduct(id, productDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}
