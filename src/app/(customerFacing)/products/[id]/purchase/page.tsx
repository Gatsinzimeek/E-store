import db from "@/db/db"
import { notFound } from "next/navigation";
import { Stripe } from "stripe";
import CheckOutForm from "./_Component/CheckOutForm";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const Purchasepage = async ({params: {id}}: {params: {id: string}}) => {
    const product = await db.product.findUnique({where: {id}});
    if(product === null) return notFound();

    const PaymentIntent = await stripe.paymentIntents.create({
      amount: product.priceInCents,
      currency: "USD",
      metadata: {productId: product.id}
    })

    if(PaymentIntent.client_secret == null) {
      throw Error("stripe not working Effectively");
    }
    return (
      <CheckOutForm  product={product} clientSecret={PaymentIntent.client_secret}/>
  )
}

export default Purchasepage
    