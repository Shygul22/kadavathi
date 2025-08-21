/*
  # Food Delivery Platform - Complete Database Schema

  ## Overview
  Multi-stakeholder food delivery platform with:
  1. User profiles with role-based access (customer, delivery_partner, restaurant_owner, admin)
  2. Restaurant management with menus and items
  3. Order processing with real-time status tracking
  4. Delivery assignment and tracking
  5. Reviews and ratings system
  6. Financial tracking and analytics

  ## Tables Created
  - `profiles` - User profiles with roles
  - `restaurants` - Restaurant information and settings
  - `menu_categories` - Menu organization
  - `menu_items` - Individual food items
  - `orders` - Order management
  - `order_items` - Items within orders
  - `deliveries` - Delivery assignments and tracking
  - `reviews` - Customer reviews and ratings
  - `earnings` - Financial tracking for partners

  ## Security
  - Row Level Security enabled on all tables
  - Role-based access policies
  - Users can only access their own data and relevant business data
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'delivery_partner', 'restaurant_owner', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'delivered', 'cancelled');
CREATE TYPE delivery_status AS ENUM ('assigned', 'picked_up', 'delivered', 'cancelled');
CREATE TYPE restaurant_status AS ENUM ('active', 'inactive', 'suspended');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  role user_role DEFAULT 'customer',
  address text,
  city text,
  postal_code text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  cuisine_type text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  postal_code text,
  phone text,
  email text,
  image_url text,
  rating numeric(3,2) DEFAULT 0.0,
  total_reviews integer DEFAULT 0,
  delivery_fee numeric(10,2) DEFAULT 0.0,
  minimum_order numeric(10,2) DEFAULT 0.0,
  delivery_time_min integer DEFAULT 30,
  delivery_time_max integer DEFAULT 45,
  status restaurant_status DEFAULT 'active',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Menu categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id uuid REFERENCES menu_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  is_available boolean DEFAULT true,
  is_vegetarian boolean DEFAULT false,
  is_vegan boolean DEFAULT false,
  is_gluten_free boolean DEFAULT false,
  calories integer,
  preparation_time integer DEFAULT 15,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status order_status DEFAULT 'pending',
  subtotal numeric(10,2) NOT NULL,
  delivery_fee numeric(10,2) DEFAULT 0.0,
  tax_amount numeric(10,2) DEFAULT 0.0,
  tip_amount numeric(10,2) DEFAULT 0.0,
  total_amount numeric(10,2) NOT NULL,
  delivery_address text NOT NULL,
  delivery_city text NOT NULL,
  delivery_postal_code text,
  customer_phone text,
  special_instructions text,
  estimated_delivery_time timestamptz,
  actual_delivery_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  special_instructions text,
  created_at timestamptz DEFAULT now()
);

-- Deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  delivery_partner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status delivery_status DEFAULT 'assigned',
  pickup_time timestamptz,
  delivery_time timestamptz,
  delivery_fee numeric(10,2) DEFAULT 0.0,
  tip_amount numeric(10,2) DEFAULT 0.0,
  distance_km numeric(5,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  delivery_partner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  restaurant_rating integer CHECK (restaurant_rating >= 1 AND restaurant_rating <= 5),
  delivery_rating integer CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  restaurant_review text,
  delivery_review text,
  created_at timestamptz DEFAULT now()
);

-- Earnings table for financial tracking
CREATE TABLE IF NOT EXISTS earnings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  type text NOT NULL, -- 'delivery_fee', 'tip', 'commission', etc.
  status text DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_partner ON deliveries(delivery_partner_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Restaurants: Public read, owners can manage their restaurants
CREATE POLICY "Anyone can view active restaurants" ON restaurants
  FOR SELECT USING (status = 'active');

CREATE POLICY "Restaurant owners can manage their restaurants" ON restaurants
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all restaurants" ON restaurants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Menu categories: Public read, restaurant owners can manage
CREATE POLICY "Anyone can view menu categories" ON menu_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE id = restaurant_id AND status = 'active'
    )
  );

CREATE POLICY "Restaurant owners can manage menu categories" ON menu_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE id = restaurant_id AND owner_id = auth.uid()
    )
  );

-- Menu items: Public read, restaurant owners can manage
CREATE POLICY "Anyone can view available menu items" ON menu_items
  FOR SELECT USING (
    is_available = true AND
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE id = restaurant_id AND status = 'active'
    )
  );

CREATE POLICY "Restaurant owners can manage menu items" ON menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE id = restaurant_id AND owner_id = auth.uid()
    )
  );

-- Orders: Customers see their orders, restaurants see their orders, delivery partners see assigned orders
CREATE POLICY "Customers can view their orders" ON orders
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers can create orders" ON orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Restaurant owners can view their orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE id = restaurant_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can update their orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE id = restaurant_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Delivery partners can view assigned orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM deliveries 
      WHERE order_id = orders.id AND delivery_partner_id = auth.uid()
    )
  );

-- Order items: Follow order permissions
CREATE POLICY "Order items follow order permissions" ON order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_id AND (
        customer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM restaurants 
          WHERE id = orders.restaurant_id AND owner_id = auth.uid()
        ) OR
        EXISTS (
          SELECT 1 FROM deliveries 
          WHERE order_id = orders.id AND delivery_partner_id = auth.uid()
        )
      )
    )
  );

-- Deliveries: Delivery partners can see their deliveries, restaurants can see their deliveries
CREATE POLICY "Delivery partners can view their deliveries" ON deliveries
  FOR SELECT USING (delivery_partner_id = auth.uid());

CREATE POLICY "Delivery partners can update their deliveries" ON deliveries
  FOR UPDATE USING (delivery_partner_id = auth.uid());

CREATE POLICY "Restaurant owners can view deliveries for their orders" ON deliveries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = order_id AND r.owner_id = auth.uid()
    )
  );

-- Reviews: Public read, customers can create reviews for their orders
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews for their orders" ON reviews
  FOR INSERT WITH CHECK (
    customer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_id AND customer_id = auth.uid()
    )
  );

-- Earnings: Users can view their own earnings
CREATE POLICY "Users can view their own earnings" ON earnings
  FOR SELECT USING (user_id = auth.uid());

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update restaurant ratings
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE restaurants 
  SET 
    rating = (
      SELECT COALESCE(AVG(restaurant_rating::numeric), 0)
      FROM reviews 
      WHERE restaurant_id = NEW.restaurant_id AND restaurant_rating IS NOT NULL
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews 
      WHERE restaurant_id = NEW.restaurant_id AND restaurant_rating IS NOT NULL
    )
  WHERE id = NEW.restaurant_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update restaurant ratings when reviews are added
CREATE TRIGGER update_restaurant_rating_trigger
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_restaurant_rating();