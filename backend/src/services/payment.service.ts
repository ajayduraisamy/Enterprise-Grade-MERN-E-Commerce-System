import Order from "../models/Order";
import { deleteCache } from "../utils/cache";

const ADMIN_DASHBOARD_CACHE_KEY = "admin:dashboard";

// ===================== PAYMENT GATEWAY INTERFACE =====================

interface PaymentGateway {
    name: string;
    processPayment(orderId: string, amount: number): Promise<{ success: boolean; paymentId: string; }>;
    verifyPayment(paymentId: string, orderId: string, signature?: string): Promise<boolean>;
    processRefund(paymentId: string, amount: number): Promise<boolean>;
}

// ===================== MOCK PAYMENT GATEWAY =====================

class MockPaymentGateway implements PaymentGateway {
    name = "MOCK";

    async processPayment(orderId: string, amount: number) {
        return {
            success: true,
            paymentId: `MOCK_${Date.now()}`
        };
    }

    async verifyPayment(paymentId: string, orderId: string) {
        return true;
    }

    async processRefund(paymentId: string, amount: number) {
        return true;
    }
}

// ===================== GATEWAY REGISTRY =====================

const gateways = new Map<string, PaymentGateway>();
gateways.set("MOCK", new MockPaymentGateway());

export function registerGateway(name: string, gateway: PaymentGateway) {
    gateways.set(name, gateway);
}

// ===================== PAYMENT PROCESSING =====================

export const processMockPayment = async (orderId: string, gatewayName = "MOCK") => {
    const order: any = await Order.findById(orderId).populate("user", "name email");
    if (!order) throw new Error("Order not found");
    if (order.status === "CANCELLED") throw new Error("Cannot process payment for cancelled order");
    if (order.paymentStatus === "PAID") return order;

    const gateway = gateways.get(gatewayName);
    if (!gateway) throw new Error(`Payment gateway ${gatewayName} not found`);

    const result = await gateway.processPayment(orderId, order.totalAmount);

    order.paymentStatus = "PAID";
    order.paymentId = result.paymentId;
    order.paidAt = new Date();
    order.paymentMethod = gatewayName === "MOCK" ? "UPI" : gatewayName;

    const paidOrder = await order.save();
    await deleteCache(ADMIN_DASHBOARD_CACHE_KEY);

    return paidOrder;
};

export const verifyPayment = async (paymentId: string, orderId: string, gatewayName = "MOCK", signature?: string) => {
    const gateway = gateways.get(gatewayName);
    if (!gateway) throw new Error(`Payment gateway ${gatewayName} not found`);
    return gateway.verifyPayment(paymentId, orderId, signature);
};
