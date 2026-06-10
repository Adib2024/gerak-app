import React, { createContext, useContext, useState, useEffect } from 'react';

// Definitions
export type ActivePage =
  | 'splash'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'transport'
  | 'jubah'
  | 'food'
  | 'profile'
  | 'notifications';

export interface UserSession {
  name: string;
  matricNo: string;
  email: string;
  balance: number;
  points: number;
  isLoggedIn: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'system' | 'transport' | 'jubah' | 'food';
}

export interface DriverDetails {
  name: string;
  rating: number;
  vehicle: string;
  plateNumber: string;
  phone: string;
  lat: number;
  lng: number;
}

export type TransportStep = 'idle' | 'searching' | 'assigned' | 'arriving' | 'active' | 'completed';

export interface RideBooking {
  id: string;
  pickup: string;
  destination: string;
  fare: number;
  date: string;
  driver?: DriverDetails;
  status: TransportStep;
}

export interface JubahBooking {
  fullName: string;
  icNumber: string;
  hpNumber: string;
  university: string;
  faculty: string;
  matricId: string;
  paymentMode: 'pickup' | 'postage';
  remark: 'Master' | 'PHD' | 'Degree' | 'Diploma';
  combinedFileName: string;
  cost: number;
  status: 'ordered' | 'cleaning' | 'packaging' | 'delivering' | 'delivered';
  returnScheduled: boolean;
  returnMethod?: 'self' | 'locker' | 'courier';
  returnDate?: string;
  returnTime?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stallName: string;
  image?: string;
}

export interface FoodOrder {
  id: string;
  items: CartItem[];
  total: number;
  status: 'placed' | 'preparing' | 'delivering' | 'completed';
  timeRemaining: number; // in seconds
  date: string;
}

interface AppContextType {
  // Navigation & Session
  currentPage: ActivePage;
  setCurrentPage: (page: ActivePage) => void;
  goBack: () => void;
  canGoBack: boolean;
  user: UserSession;
  login: (matricNo: string, name?: string) => boolean;
  register: (name: string, matricNo: string, email: string) => boolean;
  logout: () => void;
  topUpWallet: (amount: number) => void;
  deductWallet: (amount: number) => boolean;
  addPoints: (points: number) => void;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (title: string, description: string, type: NotificationItem['type']) => void;
  markAllNotificationsRead: () => void;

  // Transport Module
  activeRide: RideBooking | null;
  rideHistory: RideBooking[];
  bookRide: (pickup: string, destination: string, fare: number) => void;
  cancelRide: () => void;
  simulateRideProgress: () => void;

  // Jubah Delivery Module
  jubahBooking: JubahBooking | null;
  bookJubah: (fullName: string, icNumber: string, hpNumber: string, university: string, faculty: string, matricId: string, paymentMode: 'pickup' | 'postage', remark: 'Master' | 'PHD' | 'Degree' | 'Diploma', combinedFileName: string) => void;
  scheduleReturn: (method: 'self' | 'locker' | 'courier', date: string, time: string) => void;
  cancelJubahBooking: () => void;

  // Food Delivery Module
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  activeFoodOrder: FoodOrder | null;
  foodOrderHistory: FoodOrder[];
  checkoutFoodOrder: () => boolean;
  simulateFoodProgress: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Session
  const [currentPage, _setCurrentPage] = useState<ActivePage>('splash');
  const [pageHistory, setPageHistory] = useState<ActivePage[]>([]);

  const HISTORY_EXCLUDED: ActivePage[] = ['splash', 'login'];

  const setCurrentPage = (page: ActivePage) => {
    if (!HISTORY_EXCLUDED.includes(currentPage)) {
      setPageHistory(prev => [...prev, currentPage]);
    }
    _setCurrentPage(page);
  };

  const goBack = () => {
    setPageHistory(prev => {
      if (prev.length === 0) return prev;
      _setCurrentPage(prev[prev.length - 1]);
      return prev.slice(0, -1);
    });
  };
  const [user, setUser] = useState<UserSession>({
    name: 'Ahmad Faiz',
    matricNo: 'WIF210045',
    email: 'faiz.ahmad@student.um.edu.my',
    balance: 55.50,
    points: 340,
    isLoggedIn: false,
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Welcome to gerak!',
      description: 'Your Smart Campus Service Platform is ready. Check out Transport, Jubah, or Food services.',
      time: 'Just now',
      isRead: false,
      type: 'system',
    },
    {
      id: '2',
      title: 'Graduation Notice 2026',
      description: 'Convocation robe booking is now open. Book early via Jubah Delivery to secure your sizes.',
      time: '2 hours ago',
      isRead: true,
      type: 'jubah',
    }
  ]);

  // Transport Module
  const [activeRide, setActiveRide] = useState<RideBooking | null>(null);
  const [rideHistory, setRideHistory] = useState<RideBooking[]>([
    {
      id: 'TX-8902',
      pickup: 'Kolej Kediaman Pertama (KK1)',
      destination: 'Dewan Peperiksaan Utama',
      fare: 4.50,
      date: 'Yesterday, 2:40 PM',
      status: 'completed',
    },
    {
      id: 'TX-7231',
      pickup: 'Fakulti Sains Komputer & Teknologi Maklumat',
      destination: 'Pusat Sukan',
      fare: 3.50,
      date: '24 May 2026',
      status: 'completed',
    }
  ]);

  // Jubah Delivery
  const [jubahBooking, setJubahBooking] = useState<JubahBooking | null>(null);

  // Food Delivery
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeFoodOrder, setActiveFoodOrder] = useState<FoodOrder | null>(null);
  const [foodOrderHistory, setFoodOrderHistory] = useState<FoodOrder[]>([]);

  // Simulation Interval References
  const [rideTimer, setRideTimer] = useState<number | null>(null);
  const [foodTimer, setFoodTimer] = useState<number | null>(null);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (rideTimer) clearInterval(rideTimer);
      if (foodTimer) clearInterval(foodTimer);
    };
  }, [rideTimer, foodTimer]);

  // 1. Session Operations
  const login = (matricNo: string, name?: string): boolean => {
    if (matricNo.trim().length < 5) return false;
    setUser(prev => ({
      ...prev,
      matricNo: matricNo.toUpperCase(),
      name: name || 'Student Gerak',
      isLoggedIn: true
    }));
    addNotification('Login Successful', 'Welcome back to gerak. Stay fast, stay mobile!', 'system');
    return true;
  };

  const register = (name: string, matricNo: string, email: string): boolean => {
    if (!name || !matricNo || !email) return false;
    setUser({
      name,
      matricNo: matricNo.toUpperCase(),
      email,
      balance: 10.00, // free starter credit
      points: 100,
      isLoggedIn: true
    });
    addNotification('Account Created', 'Welcome to gerak! You have been gifted RM10.00 wallet credit.', 'system');
    return true;
  };

  const logout = () => {
    setPageHistory([]);
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setActiveRide(null);
    setJubahBooking(null);
    setCart([]);
    setActiveFoodOrder(null);
    _setCurrentPage('login');
  };

  const topUpWallet = (amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount,
      points: prev.points + Math.floor(amount * 2)
    }));
    addNotification('Wallet Top-Up', `RM${amount.toFixed(2)} loaded successfully to GerakPay.`, 'system');
  };

  const deductWallet = (amount: number): boolean => {
    if (user.balance < amount) return false;
    setUser(prev => ({ ...prev, balance: prev.balance - amount }));
    return true;
  };

  const addPoints = (points: number) => {
    setUser(prev => ({ ...prev, points: prev.points + points }));
  };

  // 2. Notification Operations
  const addNotification = (title: string, description: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: Date.now().toString(),
      title,
      description,
      time: 'Just now',
      isRead: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // 3. Transport Simulation
  const bookRide = (pickup: string, destination: string, fare: number) => {
    if (user.balance < fare) {
      addNotification('Booking Failed', 'Insufficient wallet balance. Please top up GerakPay.', 'system');
      return;
    }

    const mockDriver: DriverDetails = {
      name: 'Khairul Anwar',
      rating: 4.9,
      vehicle: 'Proton Saga (Forest Green)',
      plateNumber: 'VBY 8439',
      phone: '+6012-3456789',
      lat: 0.1,
      lng: 0.1
    };

    const newBooking: RideBooking = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      pickup,
      destination,
      fare,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'searching',
      driver: mockDriver
    };

    deductWallet(fare);
    addPoints(Math.floor(fare * 5));
    setActiveRide(newBooking);
      if (currentPage !== 'transport') {
        setCurrentPage('transport');
      }

    // Start simulation steps
    let currentStep: TransportStep = 'searching';
    const intervalId = window.setInterval(() => {
      if (currentStep === 'searching') {
        currentStep = 'assigned';
        setActiveRide(prev => prev ? { ...prev, status: 'assigned' } : null);
        addNotification('Driver Found', 'Your driver Khairul Anwar (VBY 8439) has been assigned.', 'transport');
      } else if (currentStep === 'assigned') {
        currentStep = 'arriving';
        setActiveRide(prev => prev ? { ...prev, status: 'arriving' } : null);
      } else if (currentStep === 'arriving') {
        currentStep = 'active';
        setActiveRide(prev => prev ? { ...prev, status: 'active' } : null);
        addNotification('Trip Started', 'You have entered the vehicle. Driving to destination.', 'transport');
      } else if (currentStep === 'active') {
        currentStep = 'completed';
        setActiveRide(prev => {
          if (prev) {
            const completedRide = { ...prev, status: 'completed' as TransportStep };
            setRideHistory(history => [completedRide, ...history]);
            return null;
          }
          return null;
        });
        addNotification('Trip Completed', `You have arrived at ${destination}. Thank you for riding gerak.`, 'transport');
        clearInterval(intervalId);
        setRideTimer(null);
      }
    }, 6000); // changes stages every 6 seconds for test drive speed

    setRideTimer(intervalId);
  };

  const cancelRide = () => {
    if (activeRide) {
      if (rideTimer) {
        clearInterval(rideTimer);
        setRideTimer(null);
      }
      // refund
      topUpWallet(activeRide.fare);
      addNotification('Ride Cancelled', 'Your booking was cancelled. RM' + activeRide.fare.toFixed(2) + ' refunded.', 'transport');
      setActiveRide(null);
    }
  };

  const simulateRideProgress = () => {
    // manual advance shortcut for user testing
    if (!activeRide) return;
    if (rideTimer) {
      clearInterval(rideTimer);
      setRideTimer(null);
    }
    const stages: TransportStep[] = ['searching', 'assigned', 'arriving', 'active', 'completed'];
    const currentIndex = stages.indexOf(activeRide.status);
    if (currentIndex < stages.length - 1) {
      const nextStatus = stages[currentIndex + 1];
      if (nextStatus === 'completed') {
        const completedRide = { ...activeRide, status: 'completed' as TransportStep };
        setRideHistory(history => [completedRide, ...history]);
        setActiveRide(null);
        addNotification('Trip Completed', `Arrived at ${activeRide.destination}.`, 'transport');
      } else {
        setActiveRide(prev => prev ? { ...prev, status: nextStatus } : null);
        addNotification('Trip Stage Updated', `Ride is now: ${nextStatus.toUpperCase()}`, 'transport');
      }
    }
  };

  // 4. Jubah Delivery Operations
  const bookJubah = (
    fullName: string,
    icNumber: string,
    hpNumber: string,
    university: string,
    faculty: string,
    matricId: string,
    paymentMode: 'pickup' | 'postage',
    remark: 'Master' | 'PHD' | 'Degree' | 'Diploma',
    combinedFileName: string,
  ) => {
    const cost = paymentMode === 'postage' ? 80.00 : 55.00;

    if (user.balance < cost) {
      addNotification('Booking Failed', `Insufficient funds (RM${cost.toFixed(2)} required).`, 'system');
      return;
    }

    deductWallet(cost);
    addPoints(paymentMode === 'postage' ? 200 : 150);

    const newBooking: JubahBooking = {
      fullName,
      icNumber,
      hpNumber,
      university,
      faculty,
      matricId,
      paymentMode,
      remark,
      combinedFileName,
      cost,
      status: 'ordered',
      returnScheduled: false,
    };

    setJubahBooking(newBooking);
    addNotification('Robe Booking Confirmed', `Booking for ${fullName} (${remark}) confirmed. Payment: RM${cost.toFixed(2)}.`, 'jubah');

    setTimeout(() => setJubahBooking(prev => prev ? { ...prev, status: 'cleaning' } : null), 15000);
    setTimeout(() => setJubahBooking(prev => prev ? { ...prev, status: 'packaging' } : null), 30000);
    setTimeout(() => {
      setJubahBooking(prev => prev ? { ...prev, status: paymentMode === 'postage' ? 'delivering' : 'delivered' } : null);
      addNotification(
        paymentMode === 'postage' ? 'Robe Out for Delivery' : 'Robe Ready for Collection',
        paymentMode === 'postage' ? 'Rider is on the way with your package.' : 'Visit the collection counter to pick up your robe.',
        'jubah'
      );
    }, 45000);
    if (paymentMode === 'postage') {
      setTimeout(() => {
        setJubahBooking(prev => prev ? { ...prev, status: 'delivered' } : null);
        addNotification('Robe Delivered', 'Your convocation bundle has been delivered.', 'jubah');
      }, 60000);
    }
  };

  const scheduleReturn = (method: 'self' | 'locker' | 'courier', date: string, time: string) => {
    if (!jubahBooking) return;
    setJubahBooking(prev => prev ? {
      ...prev,
      returnScheduled: true,
      returnMethod: method,
      returnDate: date,
      returnTime: time
    } : null);
    addNotification('Return Scheduled', `Robe return booking via ${method.toUpperCase()} set for ${date} at ${time}.`, 'jubah');
  };

  const cancelJubahBooking = () => {
    if (jubahBooking) {
      topUpWallet(jubahBooking.cost);
      setJubahBooking(null);
      addNotification('Booking Cancelled', `Convocation robe order cancelled. RM${jubahBooking.cost.toFixed(2)} refunded.`, 'jubah');
    }
  };

  // 5. Food Delivery Operations
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkoutFoodOrder = (): boolean => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 3.00;
    const totalCost = subtotal + deliveryFee;

    if (user.balance < totalCost) {
      addNotification('Checkout Failed', 'Insufficient wallet balance for food order.', 'food');
      return false;
    }

    deductWallet(totalCost);
    addPoints(Math.floor(totalCost * 3));

    const newOrder: FoodOrder = {
      id: `FD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      total: totalCost,
      status: 'placed',
      timeRemaining: 180, // 3 minutes simulated
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setActiveFoodOrder(newOrder);
    setCart([]);
    addNotification('Food Order Placed', `Order ${newOrder.id} submitted. Preparing food.`, 'food');
    setCurrentPage('food');

    // Simulate order progress
    let currentStep: FoodOrder['status'] = 'placed';
    const timerId = window.setInterval(() => {
      if (currentStep === 'placed') {
        currentStep = 'preparing';
        setActiveFoodOrder(prev => prev ? { ...prev, status: 'preparing', timeRemaining: 120 } : null);
        addNotification('Kitchen Preparing', 'The cook is preparing your delicious meal.', 'food');
      } else if (currentStep === 'preparing') {
        currentStep = 'delivering';
        setActiveFoodOrder(prev => prev ? { ...prev, status: 'delivering', timeRemaining: 60 } : null);
        addNotification('Order Out for Delivery', 'Rider is picking up and heading your way.', 'food');
      } else if (currentStep === 'delivering') {
        currentStep = 'completed';
        setActiveFoodOrder(prev => {
          if (prev) {
            const finished = { ...prev, status: 'completed' as const, timeRemaining: 0 };
            setFoodOrderHistory(history => [finished, ...history]);
            return null;
          }
          return null;
        });
        addNotification('Food Delivered', 'Enjoy your meal! Your rider has arrived.', 'food');
        clearInterval(timerId);
        setFoodTimer(null);
      }
    }, 8000); // 8 seconds per stage for fast demonstration

    setFoodTimer(timerId);
    return true;
  };

  const simulateFoodProgress = () => {
    if (!activeFoodOrder) return;
    if (foodTimer) {
      clearInterval(foodTimer);
      setFoodTimer(null);
    }
    const stages: FoodOrder['status'][] = ['placed', 'preparing', 'delivering', 'completed'];
    const currentIndex = stages.indexOf(activeFoodOrder.status);
    if (currentIndex < stages.length - 1) {
      const nextStatus = stages[currentIndex + 1];
      if (nextStatus === 'completed') {
        const finished = { ...activeFoodOrder, status: 'completed' as const, timeRemaining: 0 };
        setFoodOrderHistory(history => [finished, ...history]);
        setActiveFoodOrder(null);
        addNotification('Food Delivered', 'Enjoy your meal!', 'food');
      } else {
        setActiveFoodOrder(prev => prev ? { ...prev, status: nextStatus, timeRemaining: nextStatus === 'preparing' ? 120 : 60 } : null);
        addNotification('Food Stage Updated', `Order status is: ${nextStatus.toUpperCase()}`, 'food');
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        goBack,
        canGoBack: pageHistory.length > 0,
        user,
        login,
        register,
        logout,
        topUpWallet,
        deductWallet,
        addPoints,
        notifications,
        addNotification,
        markAllNotificationsRead,
        activeRide,
        rideHistory,
        bookRide,
        cancelRide,
        simulateRideProgress,
        jubahBooking,
        bookJubah,
        scheduleReturn,
        cancelJubahBooking,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        activeFoodOrder,
        foodOrderHistory,
        checkoutFoodOrder,
        simulateFoodProgress
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
