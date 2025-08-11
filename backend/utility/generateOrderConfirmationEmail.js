import formatCurrency from "../../src/utilities/Money.js";

export function generateOrderConfirmationEmail(order) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0;">${item.product.name}</td>
        <td style="padding: 8px 0;">${item.quantity}</td>
        <td style="padding: 8px 0;">${formatCurrency(
          item.product.priceCents
        )} €</td>
        <td style="padding: 8px 0;">${item.deliveryDate}</td>
      </tr>`
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
      <h2 style="color: #4CAF50;">Thank you for your order!</h2>
      <p>Your order <strong>#${
        order._id
      }</strong> has been placed successfully.</p>

      <h3>Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #ccc;">
            <th align="left">Product</th>
            <th align="left">Qty</th>
            <th align="left">Price</th>
            <th align="left">Delivery Date</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <p style="margin-top: 20px;"><strong>Total Cost: ${formatCurrency(
        order.totalCostCents
      )} €</strong></p>

      <p>If you have any questions, reply to this email or contact our support team.</p>

      <p style="margin-top: 30px;">Best regards,<br/>Amazon Team</p>
    </div>
  `;
}
