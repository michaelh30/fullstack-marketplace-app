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
    role VARCHAR(50) DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN', 'SELLER')),
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
-- All items use the same redPanda.png placeholder
-- Sample Admin User
-- Default password: admin123
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@marketplace.com', '$2a$10$zkBo2yS4nErF58rOGVWdo.Vlp2i7qRpBKPvjB6kQB3CkwAx0ejYSm', 'Admin User', 'ADMIN');

-- Sample Customer Users
-- Default password for both customers: customer123
INSERT INTO users (email, password_hash, full_name, role) VALUES
('customer1@example.com', '$2a$10$LzFUl5P9ITCIawxyzG7DQul45bu17lBZKsbZUitjQERthnf16ujKW', 'Customer One', 'CUSTOMER'),
('customer2@example.com', '$2a$10$LzFUl5P9ITCIawxyzG7DQul45bu17lBZKsbZUitjQERthnf16ujKW', 'Customer Two', 'CUSTOMER');

-- Sample Seller User
-- Default password: seller123
INSERT INTO users (email, password_hash, full_name, role) VALUES
('seller1@example.com', '$2a$12$t304hcMFSNdY0C21BE7Fr.sEZo2sdxwSJJL8iBw79G2ZqNVD/R/ki', 'Seller One', 'SELLER');

-- Sample Games
INSERT INTO games (name, description, image_url) VALUES
('Valorant', 'Competitive tactical first-person shooter', '/images/valorantLogo.png'),
('CS:GO', 'Counter-Strike: Global Offensive competitive FPS', '/images/csgoLogo.png'),
('Dota 2', 'Free-to-play multiplayer online battle arena', '/images/dota2Logo.png');

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
(1, 1, '1000 Valorant Points', 'Starter pack of Valorant Points', 9.99, 100, '/images/valorantPoint.png'),
(1, 1, '2100 Valorant Points', 'Bundle deal with bonus points', 19.99, 150, '/images/valorantPoint.png'),
(1, 1, '5000 Valorant Points', 'Large bundle for big spenders', 49.99, 75, '/images/valorantPoint.png');

-- Sample Products for Valorant Skins
INSERT INTO products (sub_category_id, game_id, name, description, price, quantity, image_url) VALUES
(2, 1, 'Elderflame Vandal', 'Legendary weapon skin', 39.99, 20, '/images/elderFlameVandal.png'),
(2, 1, 'Prime 2.0 Phantom', 'Ultra premium skin', 49.99, 15, '/images/primePhantom.png');

-- Sample Products for Valorant Agent Passes
INSERT INTO products (sub_category_id, game_id, name, description, price, quantity, image_url) VALUES
(3, 1, 'Valorant Battle Pass', 'Seasonal battle pass with rewards', 9.99, 500, '/images/valorantLogo.png');

-- Sample Products for CS:GO Skins
INSERT INTO products (sub_category_id, game_id, name, description, price, quantity, image_url) VALUES
(4, 2, 'Dragon Lore FN', 'Extremely rare Souvenir skin', 499.99, 3, '/images/dragonLore.png'),
(4, 2, 'Howl FT', 'Iconic StatTrak skin', 299.99, 5, '/images/howl.png');

-- Sample Products for CS:GO Knives
INSERT INTO products (sub_category_id, game_id, name, description, price, quantity, image_url) VALUES
(5, 2, 'Karambit Fade FN', 'Fade pattern karambit knife', 399.99, 8, '/images/karambitFade.png'),
(5, 2, 'M9 Bayonet CW MW', 'Classic M9 Bayonet Crimson Web', 279.99, 10, '/images/m9Bayonet.png');

-- Sample Products for CS:GO Keys
INSERT INTO products (sub_category_id, game_id, name, description, price, quantity, image_url) VALUES
(6, 2, 'Case Key', 'Standard case opening key', 2.99, 1000, '/images/caseKey.png');

-- Sample Products for Dota 2
INSERT INTO products (sub_category_id, game_id, name, description, price, quantity, image_url) VALUES
(7, 3, 'Earth Shaker Arcana Bundle', 'Premium earth shaker cosmetic bundle', 34.99, 30, '/images/earthShakerArcana.png'),
(8, 3, 'Battle Pass', 'The Dota 2 seasonal pass', 9.99, 200, '/images/battlepassDota2.png');

-- Insert sample reviews
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
(1, 2, 5, 'Great value for VP! Quick delivery.'),
(1, 3, 4, 'Good product, packaging could be better'),
(2, 2, 5, 'Exactly as described, highly recommended!'),
(5, 3, 5, 'Beautiful skin, worth every penny');

-- Update product ratings based on reviews
UPDATE products SET rating = 4.5, review_count = 2 WHERE id = 1;
UPDATE products SET rating = 5.0, review_count = 1 WHERE id = 2;
UPDATE products SET rating = 5.0, review_count = 1 WHERE id = 5;

COMMIT;
