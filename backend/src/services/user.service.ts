import User from "../models/User";

export const getAllUsersService = async () => {
    return await User.find().select("-password");
};

export const getUserByIdService = async (id: string) => {
    return await User.findById(id).select("-password");
};

export const updateUserRoleService = async (
    id: string,
    role: "user" | "admin"
) => {
    return await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
    ).select("-password");
};

export const deleteUserService = async (id: string) => {
    return await User.findByIdAndDelete(id);
};
