// Utility to update order status in Google Sheet via Apps Script
export async function updateOrderStatus(orderId: string, newStatus: string) {
  const GOOGLE_SHEET_ORDER_URL = "https://script.google.com/macros/s/AKfycbyCo4YqG4RwWBuIYX0bJ_AbzY2kTvfreQznAwBxlN7-TdMw8-JsSXkHM6Vry-z95PJL/exec";
  await fetch(GOOGLE_SHEET_ORDER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      orderId,
      status: newStatus,
      action: "updateStatus"
    }).toString()
  });
}
