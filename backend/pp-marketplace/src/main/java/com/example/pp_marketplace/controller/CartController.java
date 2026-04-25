package com.example.pp_marketplace.controller;

import com.example.pp_marketplace.dto.CartItemDTO;
import com.example.pp_marketplace.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping
    public CartItemDTO addToCart(@RequestParam Long userId, @RequestParam Long productId, @RequestParam Integer quantity) {
        return cartService.addToCart(userId, productId, quantity);
    }

    @GetMapping("/{userId}")
    public List<CartItemDTO> getCartItems(@PathVariable Long userId) {
        return cartService.getCartItems(userId);
    }

    @PutMapping("/{cartItemId}")
    public CartItemDTO updateCartItem(@PathVariable Long cartItemId, @RequestParam Integer quantity) {
        return cartService.updateCartItem(cartItemId, quantity);
    }

    @DeleteMapping("/{cartItemId}")
    public void removeFromCart(@PathVariable Long cartItemId) {
        cartService.removeFromCart(cartItemId);
    }

    @DeleteMapping("/product/{userId}/{productId}")
    public void removeFromCartByProductId(@PathVariable Long userId, @PathVariable Long productId) {
        cartService.removeFromCartByProductId(userId, productId);
    }

    @DeleteMapping("/{userId}/clear")
    public void clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
    }
}
