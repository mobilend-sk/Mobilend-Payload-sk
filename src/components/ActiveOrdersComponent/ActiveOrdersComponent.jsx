'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import AccountImage from "@/app/(frontend)/_assets/Icons/account.svg"
import "./ActiveOrdersComponent.scss";

const ActiveOrdersComponent = ({
  className = "",
  headerSelector = ".header",
  activeHeaderClass = "header--orders-active",
  apiUrl = "/api/offer"  // 👈 Змінено з /api/orders на /api/offer
}) => {
  // 🔍 Debug: перевіряємо що приходить в apiUrl
  useEffect(() => {
    console.log('ActiveOrdersComponent apiUrl:', apiUrl);
  }, [apiUrl]);

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'verify' | 'orders'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const emailInputRef = useRef(null);
  const codeInputRef = useRef(null);

  // Завантажуємо збережений email при монтуванні та автоматично завантажуємо замовлення
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const verifiedTimestamp = localStorage.getItem('emailVerifiedAt');
    const VERIFICATION_VALIDITY = 24 * 60 * 60 * 1000; // 24 години

    if (storedEmail && verifiedTimestamp) {
      const isVerificationValid = Date.now() - parseInt(verifiedTimestamp) < VERIFICATION_VALIDITY;

      if (isVerificationValid) {
        setEmail(storedEmail);
        // Якщо модалка відкрита - автоматично завантажуємо замовлення
        if (isOpen) {
          fetchOrdersDirectly(storedEmail);
        }
      } else {
        // Верифікація застаріла - очищаємо
        localStorage.removeItem('emailVerifiedAt');
        setStep("email")
      }
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setStep("email")
    }
  }, [isOpen]);

  // Функція для прямого завантаження замовлень (без верифікації)
  const fetchOrdersDirectly = async (emailToFetch) => {
    setLoading(true);
    setError(null);

    try {
      const ordersResponse = await fetch(
        `${apiUrl}/active?email=${encodeURIComponent(emailToFetch)}`
      );

      if (!ordersResponse.ok) {
        if (ordersResponse.status === 401 || ordersResponse.status === 403) {
          localStorage.removeItem('emailVerifiedAt');
          setStep('email');
        }
        throw new Error('Unauthorized or fetch failed');
      }

      const ordersData = await ordersResponse.json();

      setOrders(ordersData.data.orders || []);
      setStep('orders');

    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(null); // або кастомне повідомлення
      setStep('email'); // 🔥 КЛЮЧОВЕ
    } finally {
      setLoading(false);
    }
  };


  // Управління класом хедера
  useEffect(() => {
    const headerElement = document.querySelector(headerSelector);

    if (headerElement) {
      if (isOpen) {
        headerElement.classList.add(activeHeaderClass);
        document.body.classList.add('orders-modal-open');
      } else {
        headerElement.classList.remove(activeHeaderClass);
        document.body.classList.remove('orders-modal-open');
      }
    }

    return () => {
      if (headerElement) {
        headerElement.classList.remove(activeHeaderClass);
      }
      document.body.classList.remove('orders-modal-open');
    };
  }, [isOpen, headerSelector, activeHeaderClass]);

  // Фокус на інпуті
  useEffect(() => {
    if (isOpen) {
      if (step === 'email' && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (step === 'verify' && codeInputRef.current) {
        codeInputRef.current.focus();
      }
    }
  }, [isOpen, step]);

  // Закриття при Escape
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // Countdown для resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const sendVerificationCode = async (emailToSend) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToSend })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Chyba pri odoslaní kódu');
      }

      setStep('verify');
      setCountdown(60);
      setCanResend(false);

    } catch (err) {
      console.error('Send verification error:', err);
      setError(err.message || 'Nepodarilo sa odoslať kód');
    } finally {
      setLoading(false);
    }
  };

  const verifyCodeAndFetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {

      // Верифікація коду
      const verifyResponse = await fetch(`${apiUrl}/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          code: verificationCode.trim()
        })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'Nesprávny kód');
      }

      localStorage.setItem('userEmail', email.trim());
      localStorage.setItem('emailVerifiedAt', Date.now().toString());

      // Завантаження замовлень
      const ordersResponse = await fetch(`${apiUrl}/active?email=${encodeURIComponent(email.trim())}`);
      const ordersData = await ordersResponse.json();

      if (!ordersResponse.ok) {
        throw new Error(ordersData.message || 'Chyba pri načítaní objednávok');
      }

      setOrders(ordersData.data.orders || []);
      setStep('orders');

    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Nepodarilo sa overiť kód');
    } finally {
      setLoading(false);
    }
  };

  const handleOrdersClick = () => {
    setIsOpen(true);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (trimmedEmail && isValidEmail(trimmedEmail)) {
      sendVerificationCode(trimmedEmail);
    }
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (verificationCode.trim().length === 6) {
      verifyCodeAndFetchOrders();
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      sendVerificationCode(email.trim());
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    // ❌ НЕ очищаємо email - він збережений в localStorage
    // setEmail('');
    setVerificationCode('');
    setOrders([]);
  };

  const handleBack = () => {
    setStep('email');
    setVerificationCode('');
    setError(null);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: 'Čaká sa',
      paid: 'Zaplatené',
      shipped: 'Odoslané',
      delivered: 'Doručené',
      cancelled: 'Zrušené'
    };
    return statusLabels[status] || status;
  };

  const getStatusClass = (status) => {
    return `order-status--${status}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className={`active-orders-component ${className}`}>
      {!isOpen ? (
        <button
          onClick={handleOrdersClick}
          className="orders-btn"
          aria-label="Moje objednávky"
        >
          <Image
            src={AccountImage}
            alt="logo"
            width={28}
            height={28}
            className="logoImage"
            priority
          />
        </button>
      ) : (
        <div className="orders__wrapper">
          <div
            className="orders-component_blur"
            onClick={handleClose}
          />

          <div className="orders-modal">
            <div className="orders-modal__header">
              <h2 className="orders-modal__title">
                {step === 'email' && 'Moje objednávky'}
                {step === 'verify' && 'Overenie emailu'}
                {step === 'orders' && 'Vaše objednávky'}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="orders-close"
                aria-label="Zavrieť"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m18 6-12 12" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Email Step */}
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="orders-form">
                <div className="verification-info">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <p>Na overenie identity vám pošleme 6-miestny kód na email</p>
                </div>
                <div className="orders-input-wrapper">
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="Zadajte váš email..."
                    className="orders-input"
                    required
                  />
                  <button
                    type="submit"
                    className="orders-submit"
                    disabled={!email.trim() || !isValidEmail(email.trim()) || loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-small"></div>
                        Odosielam...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m22 2-7 20-4-9-9-4Z" />
                          <path d="M22 2 11 13" />
                        </svg>
                        Odoslať kód
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Verification Step */}
            {step === 'verify' && (
              <form onSubmit={handleVerifySubmit} className="orders-form">
                <div className="verification-sent">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <p>Kód bol odoslaný na <strong>{email}</strong></p>
                  <button type="button" onClick={handleBack} className="link-button">
                    Zmeniť email
                  </button>
                </div>
                <div className="orders-input-wrapper">
                  <input
                    ref={codeInputRef}
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerificationCode(value);
                      setError(null);
                    }}
                    placeholder="Zadajte 6-miestny kód..."
                    className="orders-input orders-input--code"
                    maxLength="6"
                    required
                  />
                  <button
                    type="submit"
                    className="orders-submit"
                    disabled={verificationCode.length !== 6 || loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-small"></div>
                        Overujem...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        Overiť
                      </>
                    )}
                  </button>
                </div>
                <div className="resend-section">
                  {canResend ? (
                    <button type="button" onClick={handleResendCode} className="link-button">
                      Znovu poslať kód
                    </button>
                  ) : (
                    <p className="resend-timer">
                      Znovu poslať kód za {countdown}s
                    </p>
                  )}
                </div>
              </form>
            )}

            {/* Orders Display */}
            <div className="orders-content">
              {error && (
                <div className="orders-error">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p>{error}</p>
                </div>
              )}

              {step === 'orders' && !loading && !error && orders.length === 0 && (
                <div className="orders-empty">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <p>Nenašli sa žiadne aktívne objednávky</p>
                </div>
              )}

              {step === 'orders' && !loading && !error && orders.length > 0 && (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-card__header">
                        <div className="order-card__number">
                          <span className="order-label">Objednávka:</span>
                          <span className="order-value">
                            {order.order?.orderNo || order.orderNumber}
                          </span>
                        </div>
                        <div className={`order-status ${getStatusClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </div>
                      </div>

                      <div className="order-card__info">
                        <div className="order-info-item">
                          <span className="order-label">Dátum:</span>
                          <span className="order-value">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div className="order-info-item">
                          <span className="order-label">Celková suma:</span>
                          <span className="order-value order-value--price">
                            {formatPrice(order.basePayment.amountValue)}
                          </span>
                        </div>
                      </div>

                      {order.order?.orderItems && order.order.orderItems.length > 0 && (
                        <div className="order-card__items">
                          <div className="order-items-header">Položky:</div>
                          <ul className="order-items-list">
                            {order.order.orderItems.map((item, index) => (
                              <li key={index} className="order-item">
                                <span className="order-item__name">
                                  {item.itemDetail?.itemDetailSK?.itemName || 'Produkt'}
                                </span>
                                <span className="order-item__quantity">
                                  {item.quantity}× {formatPrice(item.totalItemPrice / item.quantity)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="order-card__contact">
                        <div className="order-contact-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          {order.userData.firstName} {order.userData.lastName}
                        </div>
                        <div className="order-contact-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          {order.userData.phone}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveOrdersComponent;