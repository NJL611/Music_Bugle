import { NextRequest, NextResponse } from "next/server";
import { SUPPORT_PAYMENTS_ENABLED } from "@/lib/constants";

// Creates the Stripe PaymentIntent behind the /support form. Off with SUPPORT_PAYMENTS_ENABLED:
// an open endpoint taking any amount is a card-testing target, so it 404s until it validates input.

export async function POST(request: NextRequest) {
  if (!SUPPORT_PAYMENTS_ENABLED) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const secretKey = process.env.STRIPE_SECRET_KEY;
  // Init at request time, not module load: a missing key must 503, not crash the build.
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payments are not configured." },
      { status: 503 }
    );
  }
  const stripe = require("stripe")(secretKey);

  try {
    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
