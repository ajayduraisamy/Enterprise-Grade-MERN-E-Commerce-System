import { Request, Response } from "express";

import {
    getDashboardStats,
    getAllOrdersService,
    getOrdersByStatusService
} from "../services/admin.service";

/* =============================
   GET DASHBOARD METRICS
   GET /api/admin/dashboard
============================== */
export const adminDashboardStats = async (req: Request, res: Response) => {
    try {
        const stats = await getDashboardStats();
        res.json(stats);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};


/* =============================
   GET ALL ORDERS
   GET /api/admin/orders
============================== */
export const adminGetAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await getAllOrdersService();
        res.json(orders);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};


/* =============================
   FILTER BY STATUS
   GET /api/admin/orders/:status
============================== */
export const adminOrdersByStatus = async (
    req: Request,
    res: Response
) => {

    try {

        const { status } = req.params;

        const orders = await getOrdersByStatusService(status);

        res.json(orders);

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }

};
