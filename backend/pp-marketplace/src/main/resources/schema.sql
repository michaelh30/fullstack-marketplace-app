-- Gaming Marketplace Database Schema
-- Execute this script in PostgreSQL to initialize the database

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS sub_categories CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sub Categories table
CREATE TABLE sub_categories (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, name)
);

-- Products table (Items for sale)
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sub_category_id BIGINT NOT NULL REFERENCES sub_categories(id) ON DELETE CASCADE,
    game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    image_url VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'PROCESSING')),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table (Line items for each order)
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
);

-- Cart Items table (Temporary shopping cart)
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Create indexes for performance
CREATE INDEX idx_products_game_id ON products(game_id);
CREATE INDEX idx_products_sub_category_id ON products(sub_category_id);
CREATE INDEX idx_sub_categories_game_id ON sub_categories(game_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- Insert sample data
-- Sample Admin User
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@marketplace.com', '$2a$10$slYQmyNdGzin7olVN3p5aOYkNyPZDxL5R2K2x.ZZZ.ZZZ.ZZZ.ZZZ', 'Admin User', 'ADMIN');

-- Sample Customer Users
INSERT INTO users (email, password_hash, full_name, role) VALUES
('customer1@example.com', '$2a$10$slYQmyNdGzin7olVN3p5aOYkNyPZDxL5R2K2x.ZZZ.ZZZ.ZZZ.ZZZ', 'Customer One', 'CUSTOMER'),
('customer2@example.com', '$2a$10$slYQmyNdGzin7olVN3p5aOYkNyPZDxL5R2K2x.ZZZ.ZZZ.ZZZ.ZZZ', 'Customer Two', 'CUSTOMER');

-- Sample Games
INSERT INTO games (name, description, image_url) VALUES
('Valorant', 'Competitive tactical first-person shooter', 'https://images.igdb.com/igdb/image/scale_huge/co5e85.jpg'),
('CS:GO', 'Counter-Strike: Global Offensive competitive FPS', 'https://images.igdb.com/igdb/image/scale_huge/co234e.jpg'),
('Dota 2', 'Free-to-play multiplayer online battle arena', 'https://images.igdb.com/igdb/image/scale_huge/co1xdp.jpg');

-- Sample Sub Categories for Valorant
INSERT INTO sub_categories (game_id, name, description) VALUES
(1, 'Valorant Points', 'In-game premium currency'),
(1, 'Skins', 'Weapon and character cosmetics'),
(1, 'Agent Passes', 'Seasonal battle pass items');

-- Sample Sub Categories for CS:GO
INSERT INTO sub_categories (game_id, name, description) VALUES
(2, 'Skins', 'Weapon skins and cases'),
(2, 'Knives', 'Knife weapon skins'),
(2, 'Keys', 'Case opening keys');

-- Sample Sub Categories for Dota 2
INSERT INTO sub_categories (game_id, name, description) VALUES
(3, 'Cosmetics', 'Hero and item cosmetics'),
(3, 'Battle Pass', 'Seasonal battle pass levels');

-- Sample Products for Valorant Points
INSERT INTO products (sub_category_id, game_id, name, description, price, quantity, image_url) VALUES
(1, 1, '1000 Valorant Points', 'Starter pack of Valorant Points', 9.99, 100, 'https://valorant-api.com/v1/bundles/a69d11ff-f85d-4d89-8f18-f0c02d13a97c/displayIcon.png'),
(1, 1, '2100 Valorant Points', 'Bundle deal with bonus points', 19.99, 150, 'https://valorant-api.com/v1/bundles/d2551b3f-f4f2-44bb-9e95-ccae992da642/displayIcon.png'),
(1, 1, '5000 Valorant Points', 'Large bundle for big spenders', 49.99, 75, 'https://valorant-api.com/v1/bundles/4d0f7d5b-1e7b-4e65-a0e5-e9e5b5b5b5b5/displayIcon.png');

-- Sample Products for Valorant Skins
INSERT INTO products (sub_category_id, game_id, name, description, price, quantity, image_url) VALUES
(2, 1, 'Elderflame Vandal', 'Legendary weapon skin', 39.99, 20, 'https://valorant-api.com/v1/weapons/9c82e19d-4575-0246-5eda-80b0880f8026/skins/3ad50100-46ad-16da-99fb-4abace2146be/displayIcon.png'),
(2, 1, 'Prime 2.0 Phantom', 'Ultra premium skin', 49.99, 15, 'https://valorant-api.com/v1/weapons/ee8e6f67-464f-474c-8ac9-4c11a9254a2b/skins/15352b27-4141-d028-2eb4-4181ee06bec3/displayIcon.png');

-- Sample Products for CS:GO Skins
INSERT INTO products (sub_category_id, game_id, name, description, price, quantity, image_url) VALUES
(4, 2, 'Dragon Lore FN', 'Extremely rare Souvenir skin', 499.99, 3, 'https://steamuserimages-a.akamaihd.net/ugc/1816994948057677309/8A0B7FB5E5D9F8E3D3E5F3E3E3E3E3E3E3E3E3E3/'),
(4, 2, 'Howl FT', 'Iconic StatTrak skin', 299.99, 5, 'https://steamuserimages-a.akamaihd.net/ugc/1816994948057677310/A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0/');

-- Sample Products for CS:GO Knives
INSERT INTO products (sub_category_id, game_id, name, description, price, quantity, image_url) VALUES
(5, 2, 'Karambit Fade FN', 'Fade pattern karambit knife', 399.99, 8, 'https://steamuserimages-a.akamaihd.net/ugc/1816994948057677311/B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1/'),
(5, 2, 'M9 Bayonet CW MW', 'Classic M9 Bayonet Crimson Web', 279.99, 10, 'https://steamuserimages-a.akamaihd.net/ugc/1816994948057677312/C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2/');

-- Sample Products for Dota 2
INSERT INTO products (sub_category_id, game_id, name, description, price, quantity, image_url) VALUES
(7, 3, 'Arcana Bundle', 'Premium hero cosmetic bundle', 34.99, 30, 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/blog/arcana_header.jpg'),
(7, 3, 'TI Battle Pass', 'The International seasonal pass', 9.99, 200, 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/international/banner_bp_2024.jpg');

-- Insert sample reviews
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
(1, 2, 5, 'Great value for VP! Quick delivery.'),
(1, 3, 4, 'Good product, packaging could be better'),
(2, 2, 5, 'Exactly as described, highly recommended!'),
(6, 3, 5, 'Beautiful skin, worth every penny');

-- Update product ratings based on reviews
UPDATE products SET rating = 4.5, review_count = 2 WHERE id = 1;
UPDATE products SET rating = 5.0, review_count = 1 WHERE id = 2;
UPDATE products SET rating = 5.0, review_count = 1 WHERE id = 6;

COMMIT;
