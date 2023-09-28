
export class CheckoutResponse {
    id: string;
    object: string;
    api_version: string;
    created: number;
    data: {
      object: EventData;
      previous_attributes?: {
        email: string | null;
        phone: string | null;
      };
    };
    livemode: boolean;
    pending_webhooks: number;
    request: {
      id: string;
      idempotency_key: string;
    }
    type: string;
  headers: any;
  }
  
  interface EventData {
    id: string;
    object: string;
    address: string | null;
    balance: number;
    created: number;
    currency: string | null;
    default_source: string | null;
    delinquent: boolean;
    description: string | null;
    discount: string | null;
    email: string | null;
    invoice_prefix: string;
    invoice_settings: any; // Puedes definir una interfaz específica aquí
    livemode: boolean;
    metadata: any; // Puedes definir una interfaz específica aquí
    name: string | null;
    next_invoice_sequence: number;
    phone: string | null;
    preferred_locales: string[];
    shipping: any; // Puedes definir una interfaz específica aquí
    tax_exempt: string;
    test_clock: string | null;
  }
  
  // Define las interfaces para otros tipos de eventos aquí, como 'customer.updated', 'charge.succeeded', etc.
  