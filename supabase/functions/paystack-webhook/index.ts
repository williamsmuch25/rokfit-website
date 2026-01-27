import { serve } from "https://deno.land/std/http/server.ts";
import crypto from "node:crypto";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const signature = req.headers.get("x-paystack-signature");
  const body = await req.text();

  const secret = Deno.env.get("PAYSTACK_SECRET_KEY")!;
  const hash = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const data = event.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // prevent duplicates
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("payment_ref", data.reference)
      .single();

    if (!existing) {
      const { data: order } = await supabase
        .from("orders")
        .insert({
          full_name: data.metadata.full_name,
          phone: data.metadata.phone,
          address: data.metadata.address,
          state: data.metadata.state,
          delivery_type: data.metadata.delivery_type,
          delivery_fee: data.metadata.delivery_fee,
          total: data.amount / 100,
          payment_ref: data.reference,
          status: "paid",
        })
        .select()
        .single();

      await supabase.from("order_items").insert(
        data.metadata.cart.map((item: any) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.qty,
          price: item.price,
        }))
      );
    }
  }

  return new Response("OK", { status: 200 });
});
