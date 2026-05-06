package com.example.pp_marketplace.service;

import com.example.pp_marketplace.dto.PagedResponse;
import com.example.pp_marketplace.dto.ProductDTO;
import com.example.pp_marketplace.entity.Game;
import com.example.pp_marketplace.entity.Product;
import com.example.pp_marketplace.entity.SubCategory;
import com.example.pp_marketplace.repository.GameRepository;
import com.example.pp_marketplace.repository.ProductRepository;
import com.example.pp_marketplace.repository.SubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    // -------------------------------------------------------
    // Non-paginated (kept for admin / internal use)
    // -------------------------------------------------------

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }

    public List<ProductDTO> getProductsByGame(Long gameId) {
        return productRepository.findByGameId(gameId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsBySubCategory(Long subCategoryId) {
        return productRepository.findBySubCategoryId(subCategoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByGameAndSubCategory(Long gameId, Long subCategoryId) {
        return productRepository.findByGameIdAndSubCategoryId(gameId, subCategoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProducts(String searchTerm) {
        return productRepository.searchProducts(searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProductsByGame(Long gameId, String searchTerm) {
        return productRepository.searchProductsByGameId(gameId, searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getTopRatedProducts(Long gameId) {
        return productRepository.findByGameIdOrderByRatingDesc(gameId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getCheapestProducts(Long gameId) {
        return productRepository.findByGameIdOrderByPriceAsc(gameId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------
    // Paginated public listing methods
    // -------------------------------------------------------

    /**
     * Build a Pageable from the request parameters.
     * sort: "recommended" | "cheapest" | "top-rated"
     */
    private Pageable buildPageable(int page, int size, String sort) {
        Sort springSort;
        switch (sort) {
            case "cheapest"   -> springSort = Sort.by("price").ascending();
            case "top-rated"  -> springSort = Sort.by("rating").descending();
            default           -> springSort = Sort.by("id").ascending(); // recommended / default
        }
        return PageRequest.of(page, size, springSort);
    }

    private PagedResponse<ProductDTO> toPagedResponse(Page<Product> productPage) {
        List<ProductDTO> content = productPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<ProductDTO>builder()
                .content(content)
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .first(productPage.isFirst())
                .last(productPage.isLast())
                .build();
    }

    public PagedResponse<ProductDTO> getProductsByGamePaged(Long gameId, int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        return toPagedResponse(productRepository.findByGameId(gameId, pageable));
    }

    public PagedResponse<ProductDTO> getProductsByGameAndSubCategoryPaged(
            Long gameId, Long subCategoryId, int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        return toPagedResponse(productRepository.findByGameIdAndSubCategoryId(gameId, subCategoryId, pageable));
    }

    public PagedResponse<ProductDTO> searchProductsByGamePaged(
            Long gameId, String searchTerm, int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        return toPagedResponse(productRepository.searchProductsByGameId(gameId, searchTerm, pageable));
    }

    public PagedResponse<ProductDTO> getAllProductsPaged(int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        return toPagedResponse(productRepository.findAll(pageable));
    }

    // -------------------------------------------------------
    // Write operations
    // -------------------------------------------------------

    public ProductDTO createProduct(ProductDTO productDTO) {
        Game game = gameRepository.findById(productDTO.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));
        SubCategory subCategory = subCategoryRepository.findByIdAndGameId(productDTO.getSubCategoryId(), productDTO.getGameId())
                .orElseThrow(() -> new RuntimeException("SubCategory not found for selected game"));

        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .quantity(productDTO.getQuantity())
                .imageUrl(productDTO.getImageUrl())
                .rating(BigDecimal.ZERO)
                .reviewCount(0)
                .game(game)
                .subCategory(subCategory)
                .build();

        product = productRepository.save(product);
        return convertToDTO(product);
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (productDTO.getGameId() != null) {
            Game game = gameRepository.findById(productDTO.getGameId())
                    .orElseThrow(() -> new RuntimeException("Game not found"));
            product.setGame(game);
        }
        if (productDTO.getSubCategoryId() != null) {
            SubCategory subCategory = subCategoryRepository.findByIdAndGameId(productDTO.getSubCategoryId(), productDTO.getGameId())
                    .orElseThrow(() -> new RuntimeException("SubCategory not found for selected game"));
            product.setSubCategory(subCategory);
        }
        if (productDTO.getName() != null) product.setName(productDTO.getName());
        if (productDTO.getDescription() != null) product.setDescription(productDTO.getDescription());
        if (productDTO.getPrice() != null) product.setPrice(productDTO.getPrice());
        if (productDTO.getQuantity() != null) product.setQuantity(productDTO.getQuantity());
        if (productDTO.getImageUrl() != null) product.setImageUrl(productDTO.getImageUrl());

        product = productRepository.save(product);
        return convertToDTO(product);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    // -------------------------------------------------------
    // Conversion
    // -------------------------------------------------------

    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .imageUrl(product.getImageUrl())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .gameId(product.getGame().getId())
                .gameName(product.getGame().getName())
                .subCategoryId(product.getSubCategory().getId())
                .subCategoryName(product.getSubCategory().getName())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
