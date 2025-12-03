src/
│
├── api/
│   ├── axios.ts
│   └── auth.api.ts
│
├── auth/
│   ├── AuthContext.tsx
│   └── auth.service.ts
│
├── routes/
│   └── ProtectedRoute.tsx
│
├── layouts/
│   ├── AdminLayout.tsx
│   └── UserLayout.tsx
│
├── pages/
│
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── VerifyOtp.tsx
│
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── UsersTable.tsx
│   │   ├── OrdersTable.tsx
│   │   ├── ProductsTable.tsx
│   │   ├── CreateProduct.tsx
│   │   └── UpdateOrderStatus.tsx
│
│   ├── user/
│   │   ├── Dashboard.tsx
│   │   ├── Orders.tsx
│   │   ├── Profile.tsx
│   │   └── Checkout.tsx
│
│   └── Contact.tsx
│
├── components/
│
│   ├── tables/
│   │   ├── DataTable.tsx        # reusable table
│   │   ├── UsersTable.tsx
│   │   ├── OrdersTable.tsx
│   │   └── ProductsTable.tsx
│
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ProductForm.tsx
│   │   ├── OrderStatusForm.tsx
│   │   └── OTPForm.tsx
│
│   ├── inputs/
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── PasswordInput.tsx
│
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Loader.tsx
│   │   └── Card.tsx
│
│   ├── Navbar.tsx
│   └── Footer.tsx
│
├── hooks/
│   └── useAuth.ts
│
├── store/
│   └── cart.store.ts
│
├── utils/
│   ├── validation.ts     ✅ sanitization
│   └── format.ts
│
├── types/
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── product.types.ts
│   └── order.types.ts
│
├── App.tsx
├── main.tsx
└── index.css
