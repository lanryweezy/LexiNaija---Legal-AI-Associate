import { useLegalStore } from '../contexts/LegalStoreContext';
import PaystackPop from '@paystack/inline-js';

interface PaystackProps {
  amount: number;
  email: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  planName: string;
}

/**
 * Paystack Payment Hook
 * Integrates with Paystack for legal-tech subscription billing
 */
export const usePaystackPayment = () => {
  const { addCredits } = useLegalStore();

  const initializePayment = (config: PaystackProps) => {
    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
      email: config.email,
      amount: config.amount * 100, // Convert to kobo (NGN)
      currency: 'NGN',
      ref: `LX-${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Plan",
            variable_name: "plan",
            value: config.planName
          }
        ]
      },
      onSuccess: (transaction: any) => {
        // Payment success callback - reference returned: transaction.reference
        config.onSuccess(transaction.reference);
      },
      onCancel: () => {
        config.onClose();
      }
    });
  };

  return { initializePayment };
};
