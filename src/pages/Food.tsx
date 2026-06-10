import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Soup, Plus, Minus, ArrowRight, Clock, Play, X, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const STALLS = ['All Stalls', 'Kak Nab Nasi Lemak', 'Brotherhood Burgers', 'Zen Noodles', 'Uncle Lim Drinks'];

interface MenuItem {
  id: string;
  name: string;
  price: number;
  stall: string;
  category: string;
  desc: string;
  rating: number;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'F1',
    name: 'Nasi Lemak Ayam Goreng',
    price: 6.50,
    stall: 'Kak Nab Nasi Lemak',
    category: 'Mains',
    desc: 'Fragrant coconut milk rice, spicy house sambal, crispy fried chicken, cucumber & egg.',
    rating: 4.8
  },
  {
    id: 'F2',
    name: 'Teh Tarik Kaw-Kaw Ice',
    price: 2.50,
    stall: 'Uncle Lim Drinks',
    category: 'Drinks',
    desc: 'Foamy black tea with sweetened condensed milk, pulled to perfection and iced.',
    rating: 4.9
  },
  {
    id: 'F3',
    name: 'Supreme Double Cheese Burger',
    price: 8.50,
    stall: 'Brotherhood Burgers',
    category: 'Mains',
    desc: 'Two flame-grilled beef patties, cheddar slices, special burger sauce & pickles.',
    rating: 4.7
  },
  {
    id: 'F4',
    name: 'Spicy Chicken Ramen',
    price: 9.50,
    stall: 'Zen Noodles',
    category: 'Mains',
    desc: 'Springy ramen in hot rich chicken broth, grilled tender chicken breast & soft boiled egg.',
    rating: 4.6
  },
  {
    id: 'F5',
    name: 'Curly French Fries',
    price: 4.00,
    stall: 'Brotherhood Burgers',
    category: 'Snacks',
    desc: 'Seasoned spiral potatoes fried to golden crunchiness.',
    rating: 4.5
  },
  {
    id: 'F6',
    name: 'Fresh Iced Lemon Tea',
    price: 2.20,
    stall: 'Uncle Lim Drinks',
    category: 'Drinks',
    desc: 'House-brewed Ceylon tea infused with fresh citrus lemon wedges.',
    rating: 4.4
  }
];

export const Food: React.FC = () => {
  const { 
    cart, 
    addToCart, 
    updateCartQuantity, 
    clearCart,
    activeFoodOrder, 
    checkoutFoodOrder,
    simulateFoodProgress,
    user 
  } = useApp();

  const [selectedStall, setSelectedStall] = useState('All Stalls');
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 3.00 : 0.00;
  const grandTotal = subtotal + deliveryFee;

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      stallName: item.stall
    });
    // Tiny confetti trigger for physical interaction feel
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { y: 0.8 }
    });
  };

  const handleCheckout = () => {
    if (user.balance < grandTotal) {
      alert('Insufficient GerakPay balance. Please top up.');
      return;
    }
    const success = checkoutFoodOrder();
    if (success) {
      setShowCartDrawer(false);
      // Celebratory standard screen explosion
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const filteredItems = selectedStall === 'All Stalls' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.stall === selectedStall);

  return (
    <div className="flex-grow bg-slate-50/50 overflow-y-auto no-scrollbar pb-16 px-4 animate-fade-in flex flex-col gap-4">
      
      {!activeFoodOrder ? (
        /* BROWSE AND ORDER FOOD */
        <>
          {/* A. Dynamic Stall Banners Category filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 mt-4">
            {STALLS.map((stall) => (
              <button
                key={stall}
                onClick={() => setSelectedStall(stall)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition select-none ${
                  selectedStall === stall 
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                    : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                }`}
              >
                {stall}
              </button>
            ))}
          </div>

          {/* B. Grid listing of items */}
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-100 rounded-3xl p-4 flex gap-4 shadow-sm relative overflow-hidden group hover:shadow-md transition"
              >
                {/* Visual placeholder box representation */}
                <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition duration-300">
                  <Soup className="w-8 h-8" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase">{item.stall}</span>
                      <span className="text-[9px] font-bold text-amber-500 flex items-center gap-0.5">★ {item.rating}</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-800 m-0 leading-tight mt-1">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                    <span className="text-xs font-black text-slate-800">RM{item.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-primary hover:bg-primary-hover active:scale-90 text-white rounded-lg p-1.5 shadow-md shadow-primary/10 transition"
                      aria-label="Add to cart"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* C. Bottom Floating Cart Bar */}
          {cart.length > 0 && (
            <div 
              onClick={() => setShowCartDrawer(true)}
              className="absolute bottom-18 left-4 right-4 bg-primary text-white rounded-2xl p-4 shadow-xl flex items-center justify-between cursor-pointer animate-slide-up hover:bg-primary-hover hover:scale-[1.02] transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2 relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 bg-danger text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-primary animate-bounce">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black m-0">View College Cart</h4>
                  <p className="text-[9px] text-emerald-100 font-semibold mt-0.5">Flat RM3.00 Delivery Applied</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black">RM{grandTotal.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}
        </>
      ) : (
        /* ACTIVE ORDER TRACKER SCREEN */
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-lg flex flex-col gap-4 animate-slide-up mt-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div>
              <span className="bg-amber-100 text-amber-600 border border-amber-200 rounded-md px-1.5 py-0.5 text-[8px] font-extrabold tracking-widest uppercase">
                {activeFoodOrder.status.toUpperCase()}
              </span>
              <h3 className="text-sm font-black text-slate-800 m-0 mt-1.5">
                Order {activeFoodOrder.id} Active
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold bg-slate-50 border border-slate-100 rounded-xl px-2 py-1">
              <Clock className="w-4 h-4 text-amber-500 animate-spin" />
              <span>~{activeFoodOrder.timeRemaining / 60} min left</span>
            </div>
          </div>

          {/* Stepper tracking visuals */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
            {['placed', 'preparing', 'delivering'].map((step, idx) => {
              const steps = ['placed', 'preparing', 'delivering', 'completed'];
              const currentIdx = steps.indexOf(activeFoodOrder.status);
              const isPast = currentIdx >= idx;

              return (
                <div key={step} className="flex flex-col items-center gap-1">
                  <div className={`h-1.5 w-full rounded-full transition duration-300 ${
                    isPast ? 'bg-amber-500' : 'bg-slate-200'
                  }`} />
                  <span className={`text-[8px] font-bold uppercase tracking-wider ${
                    isPast ? 'text-amber-600' : 'text-slate-400'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Items Summary in the current order */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2">
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Items Ordered</h4>
            {activeFoodOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">
                  {item.quantity}x <span className="text-slate-800 font-bold">{item.name}</span>
                </span>
                <span className="text-slate-700 font-bold">RM{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-2 mt-1 flex justify-between items-center text-xs font-black">
              <span>Total Paid</span>
              <span className="text-primary text-sm">RM{activeFoodOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Simulation Tools */}
          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Play className="w-3.5 h-3.5 text-amber-500" />
              Demo Testing Controls
            </div>
            <button
              onClick={simulateFoodProgress}
              className="w-full bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-extrabold py-2 px-3 rounded-xl text-[10px] transition uppercase tracking-wider"
            >
              Advance Delivery Stage ➔
            </button>
            <p className="text-[8px] text-slate-400 leading-normal">
              Food delivery automatically updates stages in 8-second intervals. Press "Advance Delivery Stage" to speed it up.
            </p>
          </div>
        </div>
      )}

      {/* D. Bottom Drawer sliding modal representing Cart contents */}
      {showCartDrawer && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-fade-in">
          <div 
            className="w-full bg-white rounded-t-3xl p-6 shadow-2xl animate-slide-up flex flex-col max-h-[80%] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Selected Campus Menu
              </h3>
              <button 
                onClick={() => setShowCartDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Items list */}
            <div className="flex-grow overflow-y-auto no-scrollbar flex flex-col gap-3 py-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-3">
                  <div className="flex-1">
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase">{item.stallName}</span>
                    <h4 className="text-xs font-bold text-slate-800 m-0 leading-tight mt-0.5">{item.name}</h4>
                    <span className="text-xs font-black text-slate-500 mt-1 block">RM{item.price.toFixed(2)}</span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-slate-400 hover:text-slate-600 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-extrabold text-slate-700 min-w-[14px] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-primary hover:text-primary-hover transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations & Order Button */}
            <div className="border-t border-slate-100 pt-4 mt-4 flex flex-col gap-3">
              <div className="text-xs flex flex-col gap-1.5 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Subtotal</span>
                  <span className="text-slate-600 font-bold">RM{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Dorm Flat Delivery</span>
                  <span className="text-slate-600 font-bold">RM{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 mt-0.5 text-sm font-black">
                  <span>Grand Total</span>
                  <span className="text-primary text-base">RM{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Balance Warning */}
              {user.balance < grandTotal && (
                <div className="bg-danger/10 border border-danger/20 text-danger rounded-xl p-2.5 text-[10px] font-bold text-center">
                  Insufficient GerakPay balance. Please top up.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="bg-slate-100 hover:bg-slate-100 hover:text-danger rounded-xl p-3 text-slate-500 transition active:scale-95"
                  title="Clear all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={user.balance < grandTotal}
                  className="flex-1 bg-primary hover:bg-primary-hover active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition flex items-center justify-center gap-1.5"
                >
                  Checkout with GerakPay
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
