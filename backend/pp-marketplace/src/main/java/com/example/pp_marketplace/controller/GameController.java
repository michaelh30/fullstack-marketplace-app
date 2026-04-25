package com.example.pp_marketplace.controller;

import com.example.pp_marketplace.dto.GameDTO;
import com.example.pp_marketplace.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping
    public List<GameDTO> getAllGames() {
        return gameService.getAllGames();
    }

    @GetMapping("/{id}")
    public GameDTO getGameById(@PathVariable Long id) {
        return gameService.getGameById(id);
    }

    @GetMapping("/name/{name}")
    public GameDTO getGameByName(@PathVariable String name) {
        return gameService.getGameByName(name);
    }

    @PostMapping
    public GameDTO createGame(@RequestBody GameDTO gameDTO) {
        return gameService.createGame(gameDTO);
    }

    @PutMapping("/{id}")
    public GameDTO updateGame(@PathVariable Long id, @RequestBody GameDTO gameDTO) {
        return gameService.updateGame(id, gameDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
    }
}
