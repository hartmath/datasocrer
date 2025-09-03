import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CartItem, Dataset } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load cart from localStorage for non-authenticated users
  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem('cart_items');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error('Error loading local cart:', error);
      return [];
    }
  };

  // Save cart to localStorage
  const saveLocalCart = (items: CartItem[]) => {
    try {
      localStorage.setItem('cart_items', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  };

  const fetchCartItems = async () => {
    setLoading(true);
    
    if (!user) {
      // Load from localStorage for non-authenticated users
      const localCartItems = loadLocalCart();
      setCartItems(localCartItems);
      setLoading(false);
      return;
    }

    if (!supabase) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          dataset:datasets(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      // Set empty cart on error to prevent UI issues
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (datasetId: string, price: number) => {
    if (!user) {
      // Handle cart for non-authenticated users using localStorage
      try {
        // Get dataset details from database for local cart
        if (!supabase) {
          throw new Error('Database not available');
        }

        const { data: dataset, error } = await supabase
          .from('datasets')
          .select('*')
          .eq('id', datasetId)
          .single();

        if (error) throw error;

        const currentItems = loadLocalCart();
        const existingIndex = currentItems.findIndex((item: CartItem) => item.dataset.id === datasetId);
        
        if (existingIndex >= 0) {
          // Update quantity if item already exists
          currentItems[existingIndex].quantity += 1;
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            dataset: {
              id: dataset.id,
              title: dataset.title,
              price_cents: dataset.price_cents,
              slug: dataset.slug,
              description: dataset.description,
              provider: dataset.provider
            },
            price: dataset.price_cents,
            quantity: 1,
            user_id: 'local',
            dataset_id: datasetId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          currentItems.push(newItem);
        }
        
        saveLocalCart(currentItems);
        setCartItems(currentItems);
        return currentItems;
      } catch (error) {
        console.error('Error adding to local cart:', error);
        throw error;
      }
    }
    
    if (!supabase) {
      throw new Error('Database not available');
    }

    try {
      console.log('Adding to cart for authenticated user:', user.id, 'dataset:', datasetId, 'price:', price);
      
      // First check if item already exists
      const { data: existingItems, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('dataset_id', datasetId);

      if (checkError) {
        console.error('Error checking existing items:', checkError);
        console.error('Error details:', JSON.stringify(checkError, null, 2));
        throw new Error(`Failed to check existing cart items: ${checkError.message}`);
      }
      
      console.log('Existing items found:', existingItems?.length || 0);

      if (existingItems && existingItems.length > 0) {
        // Update existing item quantity
        const existingItem = existingItems[0];
        console.log('Updating existing item:', existingItem.id);
        const { data, error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + 1,
            price: price // Update price in case it changed
          })
          .eq('id', existingItem.id)
          .select();

        if (error) {
          console.error('Error updating cart item:', error);
          console.error('Update error details:', JSON.stringify(error, null, 2));
          throw new Error(`Failed to update cart item: ${error.message}`);
        }
        console.log('Successfully updated cart item');
      } else {
        // Insert new item
        console.log('Inserting new cart item with data:', {
          user_id: user.id,
          dataset_id: datasetId,
          price: price,
          quantity: 1
        });
        
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            dataset_id: datasetId,
            price: price,
          quantity: 1
        })
        .select();

        if (error) {
          console.error('Error inserting cart item:', error);
          console.error('Insert error details:', JSON.stringify(error, null, 2));
          throw new Error(`Failed to insert cart item: ${error.message}`);
        }
        console.log('Successfully inserted cart item:', data);
      }

      await fetchCartItems();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) {
      // Handle local cart removal
      const currentItems = loadLocalCart();
      const filteredItems = currentItems.filter((item: CartItem) => item.id !== itemId);
      saveLocalCart(filteredItems);
      setCartItems(filteredItems);
      return;
    }

    if (!supabase) {
      throw new Error('Database not available');
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) {
      // Clear local cart
      saveLocalCart([]);
      setCartItems([]);
      return;
    }

    if (!supabase) {
      throw new Error('Database not configured. Please connect to Supabase.');
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((total, item) => {
      // Use dataset.price_cents if available, otherwise use item.price (which should also be in cents)
      const itemPrice = item.dataset?.price_cents || item.price;
      const itemTotal = itemPrice * item.quantity;
      console.log(`Item: ${item.dataset?.title || item.dataset_id}, Price: ${itemPrice}, Qty: ${item.quantity}, Total: ${itemTotal}`);
      return total + itemTotal;
    }, 0);
    
    console.log('Cart total calculation:', total);
    return total;
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    refetch: fetchCartItems
  };
};