package com.example.pp_marketplace.service;

import com.example.pp_marketplace.dto.CartItemDTO;
import com.example.pp_marketplace.entity.CartItem;
import com.example.pp_marketplace.entity.Product;
import com.example.pp_marketplace.entity.User;
import com.example.pp_marketplace.repository.CartItemRepository;
import com.example.pp_marketplace.repository.ProductRepository;
import com.example.pp_marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public CartItemDTO addToCart(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem existingItem = cartItemRepository.findByUserIdAndProductId(userId, productId).orElse(null);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
            return convertToDTO(existingItem);
        }

        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(quantity)
                .build();

        cartItem = cartItemRepository.save(cartItem);
        return convertToDTO(cartItem);
    }

    public List<CartItemDTO> getCartItems(Long userId) {
        return cartItemRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CartItemDTO updateCartItem(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cartItem.setQuantity(quantity);
        cartItem = cartItemRepository.save(cartItem);
        return convertToDTO(cartItem);
    }

    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    public void removeFromCartByProductId(Long userId, Long productId) {
        cartItemRepository.deleteByUserIdAndProductId(userId, productId);
    }

    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    private CartItemDTO convertToDTO(CartItem cartItem) {
        return CartItemDTO.builder()
                .id(cartItem.getId())
                .userId(cartItem.getUser().getId())
                .productId(cartItem.getProduct().getId())
                .productName(cartItem.getProduct().getName())
                .quantity(cartItem.getQuantity())
                .price(cartItem.getProduct().getPrice())
                .imageUrl(cartItem.getProduct().getImageUrl())
                .addedAt(cartItem.getAddedAt())
                .build();
    }
}
