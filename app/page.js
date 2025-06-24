"use client"
import "./styles.css"
import { useState } from "react"
import { useCart } from "@/context/CartProvider"

export default function Home() {
  // State for hero section video modal
  const [showVideo, setShowVideo] = useState(false)

  const openVideo = () => {
    setShowVideo(true)
  }

  const closeVideo = () => {
    setShowVideo(false)
  }

  // State for products section
  const [activeTab, setActiveTab] = useState("Handheld")

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // Product data
  const products = [
    {
      id: 1,
      name: "Pocket CO2 Monitor",
      price: "5,990.00",
      rating: 3,
      connectivity: "WiFi",
      battery: "400 mAh",
      image: "https://www.pranaair.com/wp-content/uploads/2024/03/Pocket-Co2.png",
      category: "Handheld",
    },
    {
      id: 2,
      name: "Pocket PM2.5 Monitor",
      price: "3,990.00",
      rating: 3,
      connectivity: "WiFi",
      battery: "450 mAh",
      image: "https://www.pranaair.com/wp-content/uploads/2024/03/Pocket-Co2.png",
      category: "Handheld",
    },
    {
      id: 3,
      name: "OxyCO Monitor",
      price: "29,990.00",
      rating: 3,
      connectivity: "WiFi",
      battery: "450 mAh",
      image: "https://www.pranaair.com/wp-content/uploads/2024/03/Pocket-Co2.png",
      category: "Handheld",
    },
    {
      id: 4,
      name: "Nano CO Monitor",
      price: "8,990.00",
      rating: 3,
      connectivity: "NA",
      battery: "1000 mAh",
      image: "https://www.pranaair.com/wp-content/uploads/2024/03/Pocket-Co2.png",
      category: "Handheld",
    },
    {
      id: 5,
      name: "Nano CO2 Monitor",
      price: "2,490.00",
      rating: 3,
      connectivity: "NA",
      battery: "700 mAh",
      image: "https://www.pranaair.com/wp-content/uploads/2024/03/Pocket-Co2.png",
      category: "Handheld",
    },
    {
      id: 6,
      name: "Nano TVOC Monitor",
      price: "4,990.00",
      rating: 3,
      connectivity: "NA",
      battery: "1000 mAh",
      image: "https://www.pranaair.com/wp-content/uploads/2024/03/Pocket-Co2.png",
      category: "Handheld",
    },
  ]

  const filteredProducts = products.filter((product) => product.category === activeTab)

  return (
    <div>
      {/* SECTION 1: Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="hero-content">
                <h1 className="hero-title">
                  Measure Air Pollution With
                  <span className="brand-name"> Prana Air </span>
                  Smart Air Quality Monitors
                </h1>
                <p className="hero-subtitle">
                  Monitor, Analyze, And Control Your Air Quality With Precision Technology.
                </p>
                <button className="contact-button">
                  Contact Us <span className="arrow">→</span>
                </button>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="video-thumbnail" onClick={openVideo}>
                <div className="play-button-wrapper">
                  <div className="play-icon">▶</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showVideo && (
          <div className="video-modal">
            <div className="video-modal-content">
              <button className="close-video-btn" onClick={closeVideo}>
                ×
              </button>
              <div className="video-container">
                <iframe
                  src="https://www.youtube.com/embed/vKTDgUu1K_E?si=B4ZUhBiZLE7-uDBS&autoplay=1"
                  title="Prana Air SQUAIR Indoor Air Quality Monitor"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <div className="section-header">
                <span className="section-label">Explore</span>
                <h2 className="section-title">Air Quality Monitoring Devices</h2>
                <p className="section-subtitle">For Every Space: Home, Office, & Industrial Use</p>
              </div>
            </div>
            <div className="col-md-5">
              <div className="category-tabs">
                <div
                  className={`tab-item ${activeTab === "Handheld" ? "active" : ""}`}
                  onClick={() => handleTabChange("Handheld")}
                >
                  Handheld
                </div>
                <div
                  className={`tab-item ${activeTab === "Indoor" ? "active" : ""}`}
                  onClick={() => handleTabChange("Indoor")}
                >
                  Indoor
                </div>
                <div
                  className={`tab-item ${activeTab === "Outdoor" ? "active" : ""}`}
                  onClick={() => handleTabChange("Outdoor")}
                >
                  Outdoor
                </div>
              </div>
            </div>
          </div>

          <div className="row product-grid">
            {filteredProducts.map((product) => (
              <div className="col-lg-4 col-md-6 mb-4" key={product.id}>
                <div className="product-card">
                  <div className="product-image-container">
                    <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
                    <span className="product-category">{product.category}</span>
                    <button className="quick-view-btn">
                      <img src="https://www.pranaair.com/wp-content/uploads/2024/02/card-arrow.png" alt="Quick view" />
                    </button>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">₹ {product.price}</div>
                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < product.rating ? "filled" : ""}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="product-details">
                      <div className="detail-item">
                        <span className="detail-label">Connectivity :</span>
                        <span className="detail-value">{product.connectivity}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Battery :</span>
                        <span className="detail-value">{product.battery}</span>
                      </div>
                    </div>
                    <BuyNowButton product={product} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Why Choose Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-8">
              <h2 className="why-choose-title">
                Why Should You Choose <span className="brand-text">Prana Air's Air Pollution Monitors?</span>
              </h2>
            </div>
            <div className="col-lg-4">
              <div className="compliance-badge">
                Compliance with
                <div className="compliance-text">
                  <span className="leed">LEED</span>, <span className="well">WELL</span>, &{" "}
                  <span className="ashrae">ASHRAE</span>
                </div>
                Standards
              </div>
            </div>
          </div>

          <div className="features-grid">
            <div className="row mb-4">
              <div className="col-lg-6">
                <div className="feature-card large">
                  <div className="feature-icon">
                    <img
                      src="https://www.pranaair.com/wp-content/uploads/2024/09/Low-cost-and-Highly-Reliable-Datas.png"
                      alt="Low-cost and Highly Reliable Data"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Low-cost and Highly Reliable Data</h3>
                    <p className="feature-description">
                      Cost-effective solutions without compromising on accuracy, using high-end sensors for measuring.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="feature-card large">
                  <div className="feature-icon">
                    <img
                      src="https://www.pranaair.com/wp-content/uploads/2024/09/Remote-Data-at-Your-Fingertip.png"
                      alt="Remote Data at Your Fingertips"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Remote Data at Your Fingertips</h3>
                    <p className="feature-description">
                      Monitor air quality anytime, anywhere through the AQI mobile app, TV app or web dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-lg-4">
                <div className="feature-card small">
                  <div className="feature-icon">
                    <img
                      src="https://www.pranaair.com/wp-content/uploads/2024/09/Tailored-Air-Quality-Monitorings.png"
                      alt="Personalized Air Quality Monitoring"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Personalized Air Quality Monitoring</h3>
                    <p className="feature-description">
                      Customized solutions for various industries, offering clear, detailed data views.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="feature-card small">
                  <div className="feature-icon">
                    <img
                      src="https://www.pranaair.com/wp-content/uploads/2024/09/Hassle-Free-Precisions.png"
                      alt="Perfect for every application"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Perfect for every application</h3>
                    <p className="feature-description">
                      Accurate, real-time pollutant tracking with compact, easy-to-use devices.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="feature-card small">
                  <div className="feature-icon">
                    <img
                      src="https://www.pranaair.com/wp-content/uploads/2024/09/Versatile-Connect.png"
                      alt="Versatile Connectivity"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Versatile Connectivity</h3>
                    <p className="feature-description">
                      Connect via Wi-Fi, GSM, or RS-485 and integrate with BMS for 24/7 real-time monitoring.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row trust-section align-items-center">
            <div className="col-lg-3">
              <div className="counter-box">
                <div className="counter">150</div>
                <div className="counter-text">Construction Sites Covered</div>
              </div>
            </div>
            <div className="col-lg-9">
              <p className="trust-text">
                We are trusted by the best in the business as our air quality monitors installed in over 150
                construction sites, leading hotels, banking, R&D teams, Smart Cities projects, Smart Campuses, Forest
                and Climate Change Department, top educational institutions. Industry giants like Tata Steel, Lodha,
                Emaar, Mahindra, Renault, Ola, L&T, and Marriott, as well as top institutions such as IITs, CSIR, CII,
                DAE, and many more, rely on our technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="how-it-works-title">
              How Does An Air Quality Monitoring
              <br />
              System Work?
            </h2>
          </div>

          <div className="how-it-works-grid">
            <div className="row">
              <div className="col-lg-6 mb-4">
                <div className="work-card">
                  <div className="work-card-inner">
                    <div className="work-image">
                      <img
                        src="https://www.pranaair.com/wp-content/uploads/2025/03/pcb-embedded-or-platform.webp"
                        alt="PCB – Embedded or Platform"
                      />
                    </div>
                    <div className="work-content">
                      <div className="work-number">01</div>
                      <h3 className="work-title">PCB – Embedded or Platform</h3>
                      <p className="work-description">
                        The PCB manages power, processing, and communication. It converts analogue to digital output,
                        supports BMS (Battery Management System), and enables data logging and communication via Wi-Fi,
                        Bluetooth, or LoRa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mb-4">
                <div className="work-card">
                  <div className="work-card-inner">
                    <div className="work-image">
                      <img
                        src="https://www.pranaair.com/wp-content/uploads/2025/01/pcb-monitor-function.webp"
                        alt="Sensors – For Air Quality Detection"
                      />
                    </div>
                    <div className="work-content">
                      <div className="work-number">02</div>
                      <h3 className="work-title">Sensors – For Air Quality Detection</h3>
                      <p className="work-description">
                        Sensors detect pollutants and undergo calibration for accuracy. Automation helps them adjust to
                        factors like temperature and humidity. Bisynking ensures multiple sensors cross-verify data for
                        reliability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="center-box">
              <div className="center-content">
                <h3 className="center-title">From Sensor to Data:</h3>
                <p className="center-text">From Sensor to Data: How Air Quality Monitors Work</p>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6 mb-4">
                <div className="work-card">
                  <div className="work-card-inner">
                    <div className="work-image">
                      <img
                        src="https://www.pranaair.com/wp-content/uploads/2025/03/Housing-Protecting-the-System.webp"
                        alt="Housing – Protecting the System"
                      />
                    </div>
                    <div className="work-content">
                      <div className="work-number">03</div>
                      <h3 className="work-title">Housing – Protecting the System</h3>
                      <p className="work-description">
                        The housing ensures proper sampling of air for precise readings. A perfection-oriented design
                        reduces interference. Weatherproofing protects against environmental damage, while a robust
                        structure ensures durability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mb-4">
                <div className="work-card">
                  <div className="work-card-inner">
                    <div className="work-image">
                      <img
                        src="https://www.pranaair.com/wp-content/uploads/2025/03/Dashboard-Analyzing-and-Visualizing-Data.webp"
                        alt="Dashboard – Analyzing and Visualizing Data"
                      />
                    </div>
                    <div className="work-content">
                      <div className="work-number">04</div>
                      <h3 className="work-title">Dashboard – Analyzing and Visualizing Data</h3>
                      <p className="work-description">
                        The dashboard processes and displays air quality data. The backend (server) handles data storage
                        and processing, while the frontend presents graphs, alerts, and insights for easy monitoring.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Cart notification styles */}
      <style jsx global>{`
        .product-buttons {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .add-to-cart-btn {
          flex: 1;
          background-color: #f8f9fa;
          color: #374151;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 8px 15px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        
        .add-to-cart-btn:hover {
          background-color: #e9ecef;
          border-color: #dee2e6;
        }
        
        .buy-now-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        
        .cart-notification {
          position: fixed;
          top: 80px;
          right: 20px;
          background-color: #7ab261;
          color: white;
          padding: 12px 20px;
          border-radius: 4px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1050;
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .cart-notification.fade-out {
          animation: fadeOut 0.5s ease-out forwards;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

function BuyNowButton({ product }) {
  const { addToCart } = useCart()

  const handleBuyNow = () => {
    if (product.name === "Pocket CO2 Monitor") {
      if (addToCart) {
        addToCart(product, 1)
      }
      window.location.href = "/air-quality-monitor/handheld/pocket-monitor"
    } else {
      window.location.href = `/air-quality-monitor/handheld/${product.name.toLowerCase().replace(/\s+/g, "-")}`
    }
  }

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product, 1)
      // Show a subtle notification
      const notification = document.createElement("div")
      notification.className = "cart-notification"
      notification.textContent = `${product.name} added to cart!`
      document.body.appendChild(notification)

      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.classList.add("fade-out")
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 500)
      }, 2500)
    }
  }

  return (
    <div className="product-buttons">
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to Cart <span className="cart-icon">🛒</span>
      </button>
      <button className="buy-now-btn" onClick={handleBuyNow}>
        Buy Now <img src="https://www.pranaair.com/wp-content/uploads/2024/02/card-arrow.png" alt="Arrow" />
      </button>
    </div>
  )
}
