-- ============================================
-- ФЕРМЕРСКОЕ ХОЗЯЙСТВО - СОЗДАНИЕ ТАБЛИЦ
-- 5 таблиц: животные, корма, продукция, прививки, покупатели
-- ============================================

-- 1. Таблица: ЖИВОТНЫЕ
CREATE TABLE IF NOT EXISTS animals (
    id SERIAL PRIMARY KEY,
    tag_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    animal_type VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    birth_date DATE,
    gender VARCHAR(10)
);

-- 2. Таблица: КОРМА
CREATE TABLE IF NOT EXISTS feeds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    feed_type VARCHAR(50),
    unit VARCHAR(20),
    stock_quantity DECIMAL(10,2) DEFAULT 0
);

-- 3. Таблица: ПРОДУКЦИЯ (молоко, яйца, мясо)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER REFERENCES animals(id) ON DELETE CASCADE,
    product_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    production_date DATE DEFAULT CURRENT_DATE
);

-- 4. Таблица: ПРИВИВКИ
CREATE TABLE IF NOT EXISTS vaccinations (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER REFERENCES animals(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(100) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_date DATE,
    vet_name VARCHAR(100)
);

-- 5. Таблица: ПОКУПАТЕЛИ
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT
);

-- Показать список созданных таблиц
\dt