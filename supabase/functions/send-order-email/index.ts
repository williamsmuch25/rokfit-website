import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  try {
    const { order, items } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");

    const itemList = items
      .map((i: any) => `${i.name} x${i.quantity}`)
      .join(", ");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ROKFit <orders@rokfit.fit>",
        to: ADMIN_EMAIL,
        subject: "🛒 New ROKFit Order",
        html: `
          <h2>New Order Received</h2>
          <p><strong>Name:</strong> ${order.full_name}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>State:</strong> ${order.state}</p>
          <p><strong>Total:</strong> ₦${order.total}</p>
          <p><strong>Items:</strong> ${itemList}</p>
          <p><strong>Reference:</strong> ${order.payment_ref}</p>
        `,
      }),
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
});
