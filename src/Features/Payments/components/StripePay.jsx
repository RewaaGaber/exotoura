import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { useCreateIntent } from "../hooks/usePaymentApi";

const stripePromise = loadStripe(
  "pk_test_51Qw1EWGXC0CCGshRya6eh9YafZxjQRtFbcgImVz1Vmx7sc66sIBctHg1FJHB0XJI4LdbTWY61QzBPNYCKLB0WmZn00hGuGp62j"
);

const StripePayment = ({ activityType, id, expectedCaptureDate }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const hasInitialized = useRef(false);

  const {
    execute: createIntent,
    error: createIntentError,
    isError: isCreateIntentError,
    isLoading: isCreateIntentLoading,
    isSuccess: isCreateIntentSuccess,
  } = useCreateIntent();

  useEffect(() => {
    if (clientSecret || hasInitialized.current) return;

    const initializePayment = async () => {
      if (activityType && id && expectedCaptureDate) {
        hasInitialized.current = true;
        setError("");

        try {
          const { clientSecret } = await createIntent({
            activityType,
            id,
            expectedCaptureDate,
          });
          setClientSecret(clientSecret);
        } catch (err) {
          console.error("Error creating payment intent:", err);
          setError("Failed to initialize payment");
        }
      } else {
        setError("Missing required payment data");
      }
    };

    initializePayment();
  }, [activityType, id, expectedCaptureDate, clientSecret, createIntent]);

  // Handle createIntent error
  useEffect(() => {
    if (isCreateIntentError) {
      setError(createIntentError?.message || "Failed to initialize payment");
    }
  }, [isCreateIntentError, createIntentError]);

  if (isCreateIntentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load payment form</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Secure payment powered by Stripe</p>

          {/* Payment Details */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <p>
                <span className="font-medium">Activity:</span> {activityType}
              </p>
              <p>
                <span className="font-medium">ID:</span> {id}
              </p>
              <p>
                <span className="font-medium">Capture Date:</span> {expectedCaptureDate}
              </p>
            </div>
          </div>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#2563eb",
                colorBackground: "#ffffff",
                colorText: "#1f2937",
                colorDanger: "#ef4444",
                fontFamily: "system-ui, sans-serif",
                spacingUnit: "4px",
                borderRadius: "6px",
              },
            },
          }}
        >
          <PaymentForm />
        </Elements>
      </div>
    </div>
  );
};

export default StripePayment;
