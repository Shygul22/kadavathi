/*
  # Seed Data for Food Delivery Platform

  This migration adds sample data for testing and demonstration:
  - Sample restaurants with different cuisines
  - Menu categories and items for each restaurant
  - Sample customer profiles
  - Demo orders and reviews
*/

-- Insert sample restaurants (these will be created by restaurant owners)
INSERT INTO restaurants (id, name, description, cuisine_type, address, city, postal_code, phone, email, image_url, delivery_fee, minimum_order, delivery_time_min, delivery_time_max, is_featured) VALUES
  (
    uuid_generate_v4(),
    'Bella Italia',
    'Authentic Italian cuisine with fresh ingredients and traditional recipes',
    'Italian',
    '123 Main Street',
    'Downtown',
    '12345',
    '+1-555-0101',
    'orders@bellaitalia.com',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    2.99,
    15.00,
    25,
    35,
    true
  ),
  (
    uuid_generate_v4(),
    'Sushi Zen',
    'Fresh sushi and Japanese delicacies prepared by master chefs',
    'Japanese',
    '456 Oak Avenue',
    'Midtown',
    '12346',
    '+1-555-0102',
    'info@sushizen.com',
    'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
    3.99,
    20.00,
    30,
    40,
    true
  ),
  (
    uuid_generate_v4(),
    'Burger Palace',
    'Gourmet burgers made with premium ingredients and artisan buns',
    'American',
    '789 Pine Road',
    'Westside',
    '12347',
    '+1-555-0103',
    'orders@burgerpalace.com',
    'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400',
    1.99,
    12.00,
    20,
    30,
    false
  ),
  (
    uuid_generate_v4(),
    'Spice Garden',
    'Aromatic Indian dishes with authentic spices and traditional cooking methods',
    'Indian',
    '321 Elm Street',
    'Eastside',
    '12348',
    '+1-555-0104',
    'contact@spicegarden.com',
    'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400',
    2.49,
    18.00,
    35,
    45,
    true
  ),
  (
    uuid_generate_v4(),
    'Dragon Wok',
    'Traditional Chinese cuisine with modern presentation and fresh ingredients',
    'Chinese',
    '654 Maple Drive',
    'Northside',
    '12349',
    '+1-555-0105',
    'orders@dragonwok.com',
    'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400',
    2.75,
    16.00,
    25,
    35,
    false
  );

-- Get restaurant IDs for menu creation
DO $$
DECLARE
  bella_italia_id uuid;
  sushi_zen_id uuid;
  burger_palace_id uuid;
  spice_garden_id uuid;
  dragon_wok_id uuid;
BEGIN
  -- Get restaurant IDs
  SELECT id INTO bella_italia_id FROM restaurants WHERE name = 'Bella Italia';
  SELECT id INTO sushi_zen_id FROM restaurants WHERE name = 'Sushi Zen';
  SELECT id INTO burger_palace_id FROM restaurants WHERE name = 'Burger Palace';
  SELECT id INTO spice_garden_id FROM restaurants WHERE name = 'Spice Garden';
  SELECT id INTO dragon_wok_id FROM restaurants WHERE name = 'Dragon Wok';

  -- Bella Italia Menu
  INSERT INTO menu_categories (restaurant_id, name, description, sort_order) VALUES
    (bella_italia_id, 'Appetizers', 'Start your meal with our delicious appetizers', 1),
    (bella_italia_id, 'Pizza', 'Wood-fired pizzas with fresh toppings', 2),
    (bella_italia_id, 'Pasta', 'Homemade pasta with traditional sauces', 3),
    (bella_italia_id, 'Desserts', 'Sweet endings to your Italian feast', 4);

  -- Bella Italia Menu Items
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_vegetarian, preparation_time) VALUES
    (bella_italia_id, (SELECT id FROM menu_categories WHERE restaurant_id = bella_italia_id AND name = 'Pizza'), 'Margherita Pizza', 'Classic tomato sauce, fresh mozzarella, and basil', 18.99, true, 15),
    (bella_italia_id, (SELECT id FROM menu_categories WHERE restaurant_id = bella_italia_id AND name = 'Pizza'), 'Pepperoni Pizza', 'Tomato sauce, mozzarella, and premium pepperoni', 21.99, false, 15),
    (bella_italia_id, (SELECT id FROM menu_categories WHERE restaurant_id = bella_italia_id AND name = 'Pasta'), 'Spaghetti Carbonara', 'Creamy pasta with pancetta, eggs, and parmesan', 16.99, false, 12),
    (bella_italia_id, (SELECT id FROM menu_categories WHERE restaurant_id = bella_italia_id AND name = 'Pasta'), 'Penne Arrabbiata', 'Spicy tomato sauce with garlic and red peppers', 14.99, true, 10);

  -- Sushi Zen Menu
  INSERT INTO menu_categories (restaurant_id, name, description, sort_order) VALUES
    (sushi_zen_id, 'Sushi Rolls', 'Fresh sushi rolls made to order', 1),
    (sushi_zen_id, 'Sashimi', 'Premium fresh fish sliced to perfection', 2),
    (sushi_zen_id, 'Appetizers', 'Japanese starters and small plates', 3),
    (sushi_zen_id, 'Bento Boxes', 'Complete meals in traditional boxes', 4);

  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, preparation_time) VALUES
    (sushi_zen_id, (SELECT id FROM menu_categories WHERE restaurant_id = sushi_zen_id AND name = 'Sushi Rolls'), 'California Roll', 'Crab, avocado, and cucumber with sesame seeds', 12.99, 8),
    (sushi_zen_id, (SELECT id FROM menu_categories WHERE restaurant_id = sushi_zen_id AND name = 'Sushi Rolls'), 'Spicy Tuna Roll', 'Fresh tuna with spicy mayo and scallions', 14.99, 8),
    (sushi_zen_id, (SELECT id FROM menu_categories WHERE restaurant_id = sushi_zen_id AND name = 'Sashimi'), 'Salmon Sashimi', 'Fresh Atlantic salmon, 6 pieces', 18.99, 5),
    (sushi_zen_id, (SELECT id FROM menu_categories WHERE restaurant_id = sushi_zen_id AND name = 'Bento Boxes'), 'Teriyaki Chicken Bento', 'Grilled chicken with rice, salad, and miso soup', 16.99, 15);

  -- Burger Palace Menu
  INSERT INTO menu_categories (restaurant_id, name, description, sort_order) VALUES
    (burger_palace_id, 'Burgers', 'Gourmet burgers with premium ingredients', 1),
    (burger_palace_id, 'Sides', 'Perfect accompaniments to your meal', 2),
    (burger_palace_id, 'Beverages', 'Refreshing drinks and shakes', 3);

  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, preparation_time) VALUES
    (burger_palace_id, (SELECT id FROM menu_categories WHERE restaurant_id = burger_palace_id AND name = 'Burgers'), 'Classic Cheeseburger', 'Beef patty with cheese, lettuce, tomato, and special sauce', 13.99, 12),
    (burger_palace_id, (SELECT id FROM menu_categories WHERE restaurant_id = burger_palace_id AND name = 'Burgers'), 'BBQ Bacon Burger', 'Beef patty with bacon, BBQ sauce, and onion rings', 16.99, 15),
    (burger_palace_id, (SELECT id FROM menu_categories WHERE restaurant_id = burger_palace_id AND name = 'Sides'), 'Truffle Fries', 'Crispy fries with truffle oil and parmesan', 8.99, 8),
    (burger_palace_id, (SELECT id FROM menu_categories WHERE restaurant_id = burger_palace_id AND name = 'Beverages'), 'Vanilla Milkshake', 'Creamy vanilla milkshake with whipped cream', 5.99, 3);

  -- Spice Garden Menu
  INSERT INTO menu_categories (restaurant_id, name, description, sort_order) VALUES
    (spice_garden_id, 'Curries', 'Rich and flavorful curry dishes', 1),
    (spice_garden_id, 'Tandoor', 'Clay oven specialties', 2),
    (spice_garden_id, 'Rice & Breads', 'Basmati rice and fresh naan', 3),
    (spice_garden_id, 'Appetizers', 'Traditional Indian starters', 4);

  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_vegetarian, preparation_time) VALUES
    (spice_garden_id, (SELECT id FROM menu_categories WHERE restaurant_id = spice_garden_id AND name = 'Curries'), 'Butter Chicken', 'Tender chicken in creamy tomato curry sauce', 17.99, false, 18),
    (spice_garden_id, (SELECT id FROM menu_categories WHERE restaurant_id = spice_garden_id AND name = 'Curries'), 'Palak Paneer', 'Fresh spinach curry with cottage cheese', 15.99, true, 15),
    (spice_garden_id, (SELECT id FROM menu_categories WHERE restaurant_id = spice_garden_id AND name = 'Tandoor'), 'Chicken Tikka', 'Marinated chicken grilled in clay oven', 19.99, false, 20),
    (spice_garden_id, (SELECT id FROM menu_categories WHERE restaurant_id = spice_garden_id AND name = 'Rice & Breads'), 'Garlic Naan', 'Fresh bread with garlic and herbs', 4.99, true, 8);

END $$;