import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  X,
  Package,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';

export default function Marketplace() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState(null);
  const [orderErr, setOrderErr] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('shop'); // shop or orders

  const categories = ['Seeds', 'Fertilizers', 'Organic Manure', 'Plant Protection', 'Farming Tools', 'Irrigation Accessories'];

  useEffect(() => {
    fetchProducts();
    if (user) fetchOrders();
  }, [selectedCat, user]);

  const fetchProducts = () => {
    setLoading(true);
    api.getProducts(selectedCat)
      .then(res => {
        if (res.success) setProducts(res.products);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchOrders = () => {
    api.getOrderHistory()
      .then(res => {
        if (res.success) setMyOrders(res.orders);
      })
      .catch(err => console.error(err));
  };

  const handleCheckout = () => {
    if (!user) {
      setOrderErr('ऑर्डर करण्यासाठी कृपया प्रथम लॉगिन करा.');
      return;
    }
    if (cart.length === 0) return;

    setOrderErr(null);

    const payload = {
      items: cart,
      total_amount: totalAmount,
      shipping_address: user.location || 'Nashik, Maharashtra',
      payment_method: 'Cash on Delivery (पेमेंट डिलिव्हरीच्या वेळी)'
    };

    api.placeOrder(payload)
      .then(res => {
        if (res.success) {
          setOrderSuccessMsg(res.message);
          clearCart();
          fetchOrders();
          setTimeout(() => {
            setOrderSuccessMsg(null);
            setIsCartOpen(false);
            setActiveTab('orders');
          }, 2000);
        } else {
          setOrderErr(res.message);
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-agri-800 bg-agri-100 px-3 py-1 rounded-full border border-agri-200">
              <ShoppingBag className="w-3.5 h-3.5 text-agri-600" />
              <span>गुणवत्तापूर्ण कृषी साहित्य दुकान</span>
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
              कृषी दुकान (Farming Materials Marketplace)
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              उत्कृष्ट प्रतीची बियाणे, खते, औषधे आणि तुषार सिंचन साहित्य रास्त दरात उपलब्ध.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab(activeTab === 'shop' ? 'orders' : 'shop')}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-800 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors"
            >
              {activeTab === 'shop' ? `माझ्या ऑर्डर्स (${myOrders.length})` : 'दुकान पहा'}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-5 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>कार्ट (₹{totalAmount})</span>
              {totalItems > 0 && (
                <span className="bg-white text-agri-900 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'shop' ? (
          <div className="space-y-6">
            
            {/* Category Chips */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2">
              <button
                onClick={() => setSelectedCat('')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${selectedCat === '' ? 'bg-agri-700 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
              >
                सर्व साहित्‍य (All Products)
              </button>
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCat(c)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${selectedCat === c ? 'bg-agri-700 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full bg-white p-12 rounded-3xl text-center text-gray-500 animate-pulse">
                  साहित्य लोड होत आहे...
                </div>
              ) : (
                products.map(item => (
                  <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative">
                        <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-gray-100">
                          {item.category}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-amber-600 font-bold flex items-center">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-500 mr-1" /> {item.rating} / 5.0
                          </span>
                          <span className="text-[11px] text-green-700 font-bold">स्टॉक उपलब्ध ({item.stock})</span>
                        </div>

                        <h3 className="text-base font-bold text-gray-900 leading-snug">{item.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                      </div>
                    </div>

                    <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 block">{item.unit}</span>
                        <span className="text-lg font-extrabold text-agri-900">₹{item.price}</span>
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="px-4 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        <span>कार्टमध्ये जोडा</span>
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        ) : (
          /* Orders History Tab */
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Package className="w-5 h-5 text-agri-700 mr-2" /> माझ्या ऑर्डर्सचा इतिहास (My Order History)
            </h2>

            {myOrders.length === 0 ? (
              <p className="text-xs text-gray-500 py-8 text-center">तुमची अजून कोणतीही ऑर्डर झालेली नाही.</p>
            ) : (
              <div className="space-y-4">
                {myOrders.map(order => (
                  <div key={order.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-extrabold text-gray-900 text-sm">ऑर्डर #{order.id}</span>
                      <span className="bg-green-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-gray-700">
                          <span>{it.name} x {it.quantity}</span>
                          <span className="font-bold">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                      <span className="text-gray-500">पत्ता: {order.shipping_address}</span>
                      <span className="font-extrabold text-agri-800 text-sm">एकूण रक्कम: ₹{order.total_amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cart Drawer Slide Over */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
            <div className="bg-white max-w-md w-full h-full p-6 space-y-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <ShoppingCart className="w-5 h-5 text-agri-700 mr-2" /> खरेदी कार्ट (Shopping Cart)
                  </h3>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {orderSuccessMsg && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    <span>{orderSuccessMsg}</span>
                  </div>
                )}

                {orderErr && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
                    {orderErr}
                  </div>
                )}

                {cart.length === 0 ? (
                  <div className="text-center py-16 text-xs text-gray-400">
                    तुमचे कार्ट रिकामे आहे.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 my-4">
                    {cart.map(item => (
                      <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="max-w-[180px]">
                          <span className="font-bold text-gray-900 block truncate">{item.name}</span>
                          <span className="text-[10px] text-gray-400">₹{item.price} / {item.unit}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded">
                            <Minus className="w-3.5 h-3.5 text-gray-700" />
                          </button>
                          <span className="font-bold text-gray-900 px-1">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded">
                            <Plus className="w-3.5 h-3.5 text-gray-700" />
                          </button>
                          <button onClick={() => removeFromCart(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded ml-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="flex justify-between items-center text-sm font-extrabold">
                    <span>एकूण रक्कम (Total Amount):</span>
                    <span className="text-lg text-agri-800">₹{totalAmount}</span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1">
                    <span className="font-bold text-gray-800 flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-600 mr-1" /> कॅश ऑन डिलिव्हरी (Cash on Delivery)
                    </span>
                    <p>घरपोच डिलिव्हरीच्या वेळी रोख रक्कम भरा.</p>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-sm rounded-xl shadow transition-colors"
                  >
                    ऑर्डर निश्चित करा (Place Order)
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
