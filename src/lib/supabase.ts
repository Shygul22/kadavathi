import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase first.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'customer' | 'delivery_partner' | 'restaurant_owner' | 'admin';
  address?: string;
  city?: string;
  postal_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  cuisine_type: string;
  address: string;
  city: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  image_url?: string;
  rating: number;
  total_reviews: number;
  delivery_fee: number;
  minimum_order: number;
  delivery_time_min: number;
  delivery_time_max: number;
  status: 'active' | 'inactive' | 'suspended';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  calories?: number;
  preparation_time: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  restaurant_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'cancelled';
  subtotal: number;
  delivery_fee: number;
  tax_amount: number;
  tip_amount: number;
  total_amount: number;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code?: string;
  customer_phone?: string;
  special_instructions?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  created_at: string;
  updated_at: string;
  restaurant?: Restaurant;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  created_at: string;
  menu_item?: MenuItem;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  special_instructions?: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  delivery_partner_id?: string;
  status: 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  pickup_time?: string;
  delivery_time?: string;
  delivery_fee: number;
  tip_amount: number;
  distance_km?: number;
  created_at: string;
  updated_at: string;
  order?: Order;
}

// API functions
export const restaurantApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('status', 'active')
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getRecommended: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase.rpc('get_recommended_restaurants', {
      p_user_id: user.id
    });

    if (error) {
      console.error('Error fetching recommended restaurants:', error);
      throw error;
    }
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  getMenuItems: async (restaurantId: string) => {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories (
          id,
          name,
          description
        )
      `)
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .order('sort_order');
    
    if (error) throw error;
    return data;
  },

  getMenuCategories: async (restaurantId: string) => {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw error;
    return data;
  }
};

export const orderApi = {
  create: async (orderData: {
    restaurant_id: string;
    items: { menu_item_id: string; quantity: number; special_instructions?: string }[];
    delivery_address: string;
    delivery_city: string;
    customer_phone?: string;
    special_instructions?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Calculate totals
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('id, price')
      .in('id', orderData.items.map(item => item.menu_item_id));

    if (!menuItems) throw new Error('Menu items not found');

    const subtotal = orderData.items.reduce((total, item) => {
      const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
      return total + (menuItem?.price || 0) * item.quantity;
    }, 0);

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('delivery_fee')
      .eq('id', orderData.restaurant_id)
      .single();

    const deliveryFee = restaurant?.delivery_fee || 0;
    const taxAmount = subtotal * 0.08; // 8% tax
    const totalAmount = subtotal + deliveryFee + taxAmount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: user.id,
        restaurant_id: orderData.restaurant_id,
        order_number: orderNumber,
        subtotal,
        delivery_fee: deliveryFee,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        delivery_address: orderData.delivery_address,
        delivery_city: orderData.delivery_city,
        customer_phone: orderData.customer_phone,
        special_instructions: orderData.special_instructions,
        estimated_delivery_time: new Date(Date.now() + 45 * 60000).toISOString() // 45 minutes from now
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
      return {
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: menuItem?.price || 0,
        total_price: (menuItem?.price || 0) * item.quantity,
        special_instructions: item.special_instructions
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  },

  getByCustomer: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurants (
          id,
          name,
          image_url
        ),
        order_items (
          *,
          menu_items (
            id,
            name,
            price
          )
        )
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getByRestaurant: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_customer_id_fkey (
          id,
          full_name,
          phone
        ),
        order_items (
          *,
          menu_items (
            id,
            name,
            price
          )
        )
      `)
      .eq('restaurants.owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};