package com.example.pp_marketplace.repository;

import com.example.pp_marketplace.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    List<SubCategory> findByGameId(Long gameId);
    Optional<SubCategory> findByIdAndGameId(Long id, Long gameId);
}
