import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, RestaurantTable, CustomerFeedback } from '../types';
import { MENU_ITEMS, INITIAL_TABLES, INITIAL_ORDERS, INITIAL_FEEDBACK } from '../data/mockData';

interface AppContextType {
  currentTable: string;
  setCurrentTable: (table: string) => void;
  cart: CartItem[];
  addToCart: (dish: MenuItem, quantity?: number, instructions?: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  removeFromCart: (dishId: string) => void;
  clearCart: () => void;
  updateInstructions: (dishId: string, instructions: string) => void;
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (paymentMethod?: string) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  tables: RestaurantTable[];
  updateTableStatus: (tableId: string, status: 'available' | 'occupied' | 'reserved') => void;
  feedbacks: CustomerFeedback[];
  addFeedback: (feedback: Omit<CustomerFeedback, 'id' | 'createdAt'>) => void;
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  activeExperience: 'customer' | 'kitchen' | 'admin';
  setActiveExperience: (mode: 'customer' | 'kitchen' | 'admin') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTable, setCurrentTable] = useState<string>(() => {
    return localStorage.getItem('auradine_table') || '04';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('auradine_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('auradine_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('auradine_active_order');
    return saved ? JSON.parse(saved) : null;
  });

  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    const saved = localStorage.getItem('auradine_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>(() => {
    const saved = localStorage.getItem('auradine_feedback');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('auradine_menu');
    return saved ? JSON.parse(saved) : MENU_ITEMS;
  });

  const [activeExperience, setActiveExperience] = useState<'customer' | 'kitchen' | 'admin'>('customer');

  useEffect(() => {
    localStorage.setItem('auradine_table', currentTable);
  }, [currentTable]);

  useEffect(() => {
    localStorage.setItem('auradine_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('auradine_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('auradine_active_order', JSON.stringify(activeOrder));
    }
  }, [activeOrder]);

  useEffect(() => {
    localStorage.setItem('auradine_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('auradine_feedback', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('auradine_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  const addToCart = (dish: MenuItem, quantity = 1, instructions = '') => {
    setCart(prev => {
      const existing = prev.find(item => item.dish.id === dish.id);
      if (existing) {
        return prev.map(item =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + quantity, specialInstructions: instructions || item.specialInstructions }
            : item
        );
      }
      return [...prev, { dish, quantity, specialInstructions: instructions }];
    });
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.dish.id === dishId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (dishId: string) => {
    setCart(prev => prev.filter(item => item.dish.id !== dishId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateInstructions = (dishId: string, instructions: string) => {
    setCart(prev =>
      prev.map(item =>
        item.dish.id === dishId ? { ...item, specialInstructions: instructions } : item
      )
    );
  };

  const placeOrder = (paymentMethod = 'Contactless NFC / UPI') => {
    const subtotal = cart.reduce((acc, curr) => acc + curr.dish.price * curr.quantity, 0);
    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber: currentTable,
      customerName: 'Guest Diner',
      createdAt: 'Just now',
      status: 'received',
      items: cart.map(item => ({
        id: item.dish.id,
        name: item.dish.name,
        quantity: item.quantity,
        price: item.dish.price,
        isVeg: item.dish.isVeg,
        specialInstructions: item.specialInstructions
      })),
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod,
      paymentStatus: 'paid'
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();

    setTables(prev =>
      prev.map(tbl =>
        tbl.tableNumber === currentTable
          ? { ...tbl, status: 'occupied', activeOrderId: newOrder.id, lastUpdated: 'Just now' }
          : tbl
      )
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const updateTableStatus = (tableId: string, status: 'available' | 'occupied' | 'reserved') => {
    setTables(prev =>
      prev.map(tbl => (tbl.id === tableId ? { ...tbl, status, lastUpdated: 'Just now' } : tbl))
    );
  };

  const addFeedback = (feedbackData: Omit<CustomerFeedback, 'id' | 'createdAt'>) => {
    const newFeedback: CustomerFeedback = {
      id: `fb-${Date.now()}`,
      createdAt: 'Just now',
      ...feedbackData
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [item, ...prev]);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(m => (m.id === item.id ? item : m)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentTable,
        setCurrentTable,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        updateInstructions,
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        updateOrderStatus,
        tables,
        updateTableStatus,
        feedbacks,
        addFeedback,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        activeExperience,
        setActiveExperience
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
