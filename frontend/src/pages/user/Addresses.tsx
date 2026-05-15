import { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { Skeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import type { IAddress } from "../../types";

const ADDRESSES_KEY = "user_addresses";

function loadAddresses(): IAddress[] {
  try {
    const data = localStorage.getItem(ADDRESSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveAddresses(addresses: IAddress[]) {
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
}

const defaultForm: IAddress = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function Addresses() {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<IAddress>(defaultForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof IAddress, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setAddresses(loadAddresses());
    setLoading(false);
  }, []);

  const validate = () => {
    const errors: Partial<Record<keyof IAddress, string>> = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required";
    if (!form.phone.trim()) errors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone)) errors.phone = "Enter valid 10-digit phone";
    if (!form.street.trim()) errors.street = "Street is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.state.trim()) errors.state = "State is required";
    if (!form.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode)) errors.pincode = "Enter valid 6-digit pincode";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAdd = () => {
    setForm({ ...defaultForm });
    setEditingIndex(null);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    setForm({ ...addresses[index] });
    setEditingIndex(index);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!validate()) return;

    let updated = [...addresses];

    if (form.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }

    if (editingIndex !== null) {
      updated[editingIndex] = { ...form };
    } else {
      if (updated.length === 0) form.isDefault = true;
      updated.push({ ...form });
    }

    saveAddresses(updated);
    setAddresses(updated);
    setModalOpen(false);
    showToast(editingIndex !== null ? "Address updated" : "Address added", "success");
  };

  const handleDelete = (index: number) => {
    let updated = addresses.filter((_, i) => i !== index);
    if (updated.length > 0 && addresses[index].isDefault) {
      updated[0].isDefault = true;
    }
    saveAddresses(updated);
    setAddresses(updated);
    setDeleteConfirm(null);
    showToast("Address deleted", "success");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <div className="grid gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Addresses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your saved addresses</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          <FiPlus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={<FiMapPin className="w-8 h-8" />}
          title="No addresses saved"
          description="Add a shipping address to make checkout faster."
          actionText="Add Address"
          onAction={openAdd}
        />
      ) : (
        <div className="grid gap-4">
          {addresses.map((addr, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 dark:text-white">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                      <FiStar className="w-3 h-3" /> Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{addr.phone}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(index)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                {deleteConfirm === index ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(index)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingIndex !== null ? "Edit Address" : "Add New Address"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                placeholder="John Doe"
              />
              {formErrors.fullName && <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                placeholder="9876543210"
              />
              {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street / Area</label>
            <input
              type="text"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
              placeholder="123 Main St, Apartment 4B"
            />
            {formErrors.street && <p className="text-xs text-red-500 mt-1">{formErrors.street}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                placeholder="Mumbai"
              />
              {formErrors.city && <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                placeholder="Maharashtra"
              />
              {formErrors.state && <p className="text-xs text-red-500 mt-1">{formErrors.state}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                placeholder="400001"
              />
              {formErrors.pincode && <p className="text-xs text-red-500 mt-1">{formErrors.pincode}</p>}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault || false}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Set as default address</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              {editingIndex !== null ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
