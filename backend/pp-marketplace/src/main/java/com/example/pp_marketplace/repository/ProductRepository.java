package com.example.pp_marketplace.repository;

import com.example.pp_marketplace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByGameId(Long gameId);
    List<Product> findBySubCategoryId(Long subCategoryId);
    List<Product> findByGameIdAndSubCategoryId(Long gameId, Long subCategoryId);
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:searchTerm% OR p.description LIKE %:searchTerm%")
    List<Product> searchProducts(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT p FROM Product p WHERE p.gameId = :gameId AND (p.name LIKE %:searchTerm% OR p.description LIKE %:searchTerm%)")
    List<Product> searchProductsByGameId(@Param("gameId") Long gameId, @Param("searchTerm") String searchTerm);
    
    List<Product> findByGameIdOrderByRatingDesc(Long gameId);
    List<Product> findByGameIdOrderByPriceAsc(Long gameId);
}
