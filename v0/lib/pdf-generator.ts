// Types for order data
export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  sku?: string
  image?: string
}

export interface ShippingInfo {
  address: string
  city: string
  state: string
  zip: string
  country: string
  carrier?: string
  trackingNumber?: string
  estimatedDelivery?: string
  shippingMethod?: string
  shippingCost?: number
}

export interface PaymentInfo {
  method: string
  cardLast4?: string
  transactionId?: string
  datePaid?: string
  refundId?: string
  dateRefunded?: string
  amount?: number
}

export interface OrderData {
  id: string
  customer: string
  email: string
  date: string
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  items: OrderItem[]
  shipping: ShippingInfo
  payment: PaymentInfo
  notes?: string
  subtotal?: number
  tax?: number
  discount?: number
  discountCode?: string
}

// Generate Invoice HTML
export function generateInvoiceHTML(order: OrderData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${order.id}</title>
      <style>
        * { box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          margin: 0; 
          padding: 20px; 
          color: #333;
          line-height: 1.6;
        }
        .container { max-width: 800px; margin: 0 auto; background: white; }
        .header { text-align: center; margin-bottom: 40px; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
        .company-name { font-size: 32px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
        .company-tagline { color: #6b7280; font-size: 14px; }
        .invoice-title { 
          font-size: 36px; 
          font-weight: 300; 
          margin: 30px 0; 
          text-align: center; 
          color: #1f2937;
          letter-spacing: 2px;
        }
        .invoice-details { 
          background: #f9fafb; 
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .invoice-details-grid {
          display: flex;
          justify-content: space-between;
        }
        .address-section {
          display: flex;
          justify-content: space-between;
          margin: 30px 0;
          gap: 40px;
        }
        .address-block {
          flex: 1;
        }
        .address-block h3 {
          color: #2563eb;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 30px 0; 
        }
        th { 
          background-color: #2563eb; 
          color: white; 
          padding: 12px; 
          text-align: left; 
          font-weight: 500;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        td { 
          padding: 12px; 
          border-bottom: 1px solid #e5e7eb; 
        }
        tr:hover { background-color: #f9fafb; }
        .totals-section {
          margin-left: auto;
          width: 350px;
          margin-top: 30px;
        }
        .totals-table {
          width: 100%;
        }
        .totals-table td {
          padding: 8px 12px;
          border: none;
        }
        .totals-table tr:last-child {
          border-top: 2px solid #2563eb;
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
        }
        .footer { 
          text-align: center; 
          margin-top: 60px; 
          padding-top: 30px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280; 
          font-size: 14px;
        }
        .footer p { margin: 5px 0; }
        .print-button {
          padding: 12px 24px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          margin: 20px auto;
          display: block;
        }
        .print-button:hover {
          background: #1d4ed8;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .print-button { display: none; }
          .header { border-bottom: 2px solid #ddd; }
        }
        @media (max-width: 600px) {
          .address-section { flex-direction: column; gap: 20px; }
          .invoice-details-grid { flex-direction: column; gap: 10px; }
          .totals-section { width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="company-name">PRANA AIR</div>
          <div class="company-tagline">Premium Air Quality Solutions</div>
        </div>
        
        <div class="invoice-title">INVOICE</div>
        
        <div class="invoice-details">
          <div class="invoice-details-grid">
            <div>
              <strong>Invoice Number:</strong> INV-${order.id.replace("ORD-", "")}<br>
              <strong>Invoice Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div style="text-align: right;">
              <strong>Order ID:</strong> ${order.id}<br>
              <strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>
        
        <div class="address-section">
          <div class="address-block">
            <h3>Bill To</h3>
            <strong>${order.customer}</strong><br>
            ${order.email}<br>
            ${order.shipping?.address || "Address not provided"}<br>
            ${order.shipping?.city || ""}, ${order.shipping?.state || ""} ${order.shipping?.zip || ""}<br>
            ${order.shipping?.country || ""}
          </div>
          <div class="address-block" style="text-align: right;">
            <h3>Payment Information</h3>
            <strong>Method:</strong> ${order.payment?.method || "N/A"}<br>
            ${order.payment?.cardLast4 ? `Card: **** **** **** ${order.payment.cardLast4}<br>` : ""}
            ${order.payment?.transactionId ? `Transaction ID: ${order.payment.transactionId}<br>` : ""}
            ${order.payment?.datePaid ? `Paid on: ${new Date(order.payment.datePaid).toLocaleDateString()}` : ""}
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Item Description</th>
              <th style="width: 15%; text-align: center;">Quantity</th>
              <th style="width: 15%; text-align: right;">Unit Price</th>
              <th style="width: 20%; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td>
                  <strong>${item.name}</strong>
                  ${item.sku ? `<br><small style="color: #6b7280;">SKU: ${item.sku}</small>` : ""}
                </td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="text-align: right;"><strong>$${(item.price * item.quantity).toFixed(2)}</strong></td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="totals-section">
          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td style="text-align: right;">$${(order.subtotal || order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Shipping:</td>
              <td style="text-align: right;">$${(order.shipping?.shippingCost || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Tax:</td>
              <td style="text-align: right;">$${(order.tax || 0).toFixed(2)}</td>
            </tr>
            ${
              order.discount
                ? `
              <tr style="color: #059669;">
                <td>Discount${order.discountCode ? ` (${order.discountCode})` : ""}:</td>
                <td style="text-align: right;">-$${order.discount.toFixed(2)}</td>
              </tr>
            `
                : ""
            }
            <tr>
              <td>Total Due:</td>
              <td style="text-align: right;">$${order.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for your business!</strong></p>
          <p>For questions about this invoice, please contact us at support@pranaair.com</p>
          <p>Payment is due within 30 days of invoice date.</p>
        </div>
        
        <button class="print-button" onclick="window.print()">
          Print Invoice
        </button>
      </div>
    </body>
    </html>
  `
}

// Generate Packing Slip HTML
export function generatePackingSlipHTML(order: OrderData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Packing Slip ${order.id}</title>
      <style>
        * { box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          margin: 0; 
          padding: 20px; 
          color: #333;
          line-height: 1.6;
        }
        .container { max-width: 800px; margin: 0 auto; background: white; }
        .header { text-align: center; margin-bottom: 40px; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
        .company-name { font-size: 32px; font-weight: bold; color: #8b5cf6; margin-bottom: 5px; }
        .company-tagline { color: #6b7280; font-size: 14px; }
        .slip-title { 
          font-size: 36px; 
          font-weight: 300; 
          margin: 30px 0; 
          text-align: center; 
          color: #1f2937;
          letter-spacing: 2px;
        }
        .order-details { 
          background: #f9fafb; 
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .order-details-grid {
          display: flex;
          justify-content: space-between;
        }
        .address-section {
          display: flex;
          justify-content: space-between;
          margin: 30px 0;
          gap: 40px;
        }
        .address-block {
          flex: 1;
        }
        .address-block h3 {
          color: #8b5cf6;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 30px 0; 
        }
        th { 
          background-color: #8b5cf6; 
          color: white; 
          padding: 12px; 
          text-align: left; 
          font-weight: 500;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        td { 
          padding: 12px; 
          border-bottom: 1px solid #e5e7eb; 
        }
        tr:hover { background-color: #f9fafb; }
        .checkbox { 
          width: 20px; 
          height: 20px; 
          border: 2px solid #6b7280; 
          display: inline-block; 
          border-radius: 3px;
          vertical-align: middle;
        }
        .instructions { 
          background: #fef3c7; 
          padding: 20px; 
          margin: 30px 0; 
          border-radius: 8px;
          border: 1px solid #fcd34d;
        }
        .instructions h3 {
          color: #92400e;
          margin-top: 0;
        }
        .quality-check { 
          background: #f3f4f6; 
          padding: 30px; 
          margin: 30px 0; 
          text-align: center; 
          border-radius: 8px;
        }
        .signature-line { 
          border-bottom: 1px solid #6b7280; 
          width: 250px; 
          display: inline-block; 
          margin: 0 10px; 
        }
        .signature-section {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
        }
        .signature-block {
          text-align: center;
        }
        .print-button {
          padding: 12px 24px;
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          margin: 20px auto;
          display: block;
        }
        .print-button:hover {
          background: #7c3aed;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .print-button { display: none; }
          .header { border-bottom: 2px solid #ddd; }
        }
        @media (max-width: 600px) {
          .address-section { flex-direction: column; gap: 20px; }
          .order-details-grid { flex-direction: column; gap: 10px; }
          .signature-section { flex-direction: column; gap: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="company-name">PRANA AIR</div>
          <div class="company-tagline">Premium Air Quality Solutions</div>
        </div>
        
        <div class="slip-title">PACKING SLIP</div>
        
        <div class="order-details">
          <div class="order-details-grid">
            <div>
              <strong>Order ID:</strong> ${order.id}<br>
              <strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div style="text-align: right;">
              <strong>Customer:</strong> ${order.customer}<br>
              <strong>Packed Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>
        
        <div class="address-section">
          <div class="address-block">
            <h3>Ship To</h3>
            <strong>${order.customer}</strong><br>
            ${order.shipping?.address || "Address not provided"}<br>
            ${order.shipping?.city || ""}, ${order.shipping?.state || ""} ${order.shipping?.zip || ""}<br>
            ${order.shipping?.country || ""}
          </div>
          <div class="address-block" style="text-align: right;">
            <h3>Shipping Information</h3>
            <strong>Method:</strong> ${order.shipping?.shippingMethod || "Standard Shipping"}<br>
            <strong>Carrier:</strong> ${order.shipping?.carrier || "To be determined"}<br>
            ${order.shipping?.trackingNumber ? `<strong>Tracking:</strong> ${order.shipping.trackingNumber}<br>` : ""}
            ${order.shipping?.estimatedDelivery ? `<strong>Est. Delivery:</strong> ${new Date(order.shipping.estimatedDelivery).toLocaleDateString()}` : ""}
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Item to Pack</th>
              <th style="width: 15%;">SKU</th>
              <th style="width: 15%; text-align: center;">Quantity</th>
              <th style="width: 20%; text-align: center;">Packed</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td>
                  <strong>${item.name}</strong>
                </td>
                <td>${item.sku || "N/A"}</td>
                <td style="text-align: center;"><strong>${item.quantity}</strong></td>
                <td style="text-align: center;">
                  <div class="checkbox"></div>
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        ${
          order.notes
            ? `
          <div class="instructions">
            <h3>Special Instructions</h3>
            <p>${order.notes}</p>
          </div>
        `
            : ""
        }
        
        <div class="quality-check">
          <h3>Quality Control Checklist</h3>
          <div style="text-align: left; max-width: 400px; margin: 20px auto;">
            <p><span class="checkbox"></span> All items packed correctly</p>
            <p><span class="checkbox"></span> Items inspected for damage</p>
            <p><span class="checkbox"></span> Packaging secure and sealed</p>
            <p><span class="checkbox"></span> Shipping label attached</p>
            <p><span class="checkbox"></span> Invoice/receipt included</p>
          </div>
          
          <div class="signature-section">
            <div class="signature-block">
              <p>Packed by:</p>
              <div class="signature-line"></div>
              <p style="margin-top: 5px;">Date: _______________</p>
            </div>
            <div class="signature-block">
              <p>Checked by:</p>
              <div class="signature-line"></div>
              <p style="margin-top: 5px;">Date: _______________</p>
            </div>
          </div>
        </div>
        
        <button class="print-button" onclick="window.print()">
          Print Packing Slip
        </button>
      </div>
    </body>
    </html>
  `
}

// Helper function to download HTML as file
export function downloadHTMLAsPDF(htmlContent: string, filename: string): void {
  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
