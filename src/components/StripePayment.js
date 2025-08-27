import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";

const stripePromise = loadStripe("pk_test_votre_clé_publique");

const StripePayment = ({ cartItems, total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { data } = await axios.post(
        "/api/checkout/payment",
        {
          amount: total * 100,
          cartItems
        }
      );

      const { error } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (error) throw error;
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Payment failed!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="stripe-pay-button"
      >
        {isProcessing ? "Processing..." : `Pay $${total}`}
      </button>
    </form>
  );
};

export default function StripeContainer(props) {
  return (
    <Elements stripe={stripePromise}>
      <StripePayment {...props} />
    </Elements>
  );
}