package com.example.pp_marketplace.service;

import com.example.pp_marketplace.dto.GameDTO;
import com.example.pp_marketplace.entity.Game;
import com.example.pp_marketplace.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    public List<GameDTO> getAllGames() {
        return gameRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public GameDTO getGameById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        return convertToDTO(game);
    }

    public GameDTO getGameByName(String name) {
        Game game = gameRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        return convertToDTO(game);
    }

    public GameDTO createGame(GameDTO gameDTO) {
        Game game = Game.builder()
                .name(gameDTO.getName())
                .description(gameDTO.getDescription())
                .imageUrl(gameDTO.getImageUrl())
                .build();
        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public GameDTO updateGame(Long id, GameDTO gameDTO) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        game.setName(gameDTO.getName());
        game.setDescription(gameDTO.getDescription());
        game.setImageUrl(gameDTO.getImageUrl());
        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public void deleteGame(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        gameRepository.delete(game);
    }

    private GameDTO convertToDTO(Game game) {
        return GameDTO.builder()
                .id(game.getId())
                .name(game.getName())
                .description(game.getDescription())
                .imageUrl(game.getImageUrl())
                .createdAt(game.getCreatedAt())
                .build();
    }
}
