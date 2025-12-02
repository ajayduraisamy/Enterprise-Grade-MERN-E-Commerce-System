import { Request, Response } from "express";
import {
    getAllUsersService,
    getUserByIdService,
    updateUserRoleService,
    deleteUserService
} from "../services/user.service";

// GET ALL USERS
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersService();
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// GET USER BY ID
export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await getUserByIdService(req.params.id);

        if (!user)
            return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE ROLE
export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;

        const user = await updateUserRoleService(
            req.params.id,
            role
        );

        if (!user)
            return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deleted = await deleteUserService(req.params.id);

        if (!deleted)
            return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
