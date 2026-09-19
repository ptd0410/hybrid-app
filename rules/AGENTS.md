# API Structure Rule

- API không thuộc về app nào, bất kể API được gọi từ **network, native, hoặc bất kỳ nguồn nào khác**.
- Tất cả API phải được **tách riêng** và đặt trực tiếp dưới `src/api`.
- Mỗi API có **một folder riêng**.
- Trong mỗi folder API phải có:
  - `<name>.api` — định nghĩa/implementation của API.
  - `<name>.type` — các type liên quan đến API đó.

## Structure

```text
src/
└── api/
    ├── user/
    │   ├── user.api
    │   └── user.type
    ├── device/
    │   ├── device.api
    │   └── device.type
    └── ...
```

Không đặt API bên trong các folder thuộc về app, feature, screen hoặc UI.
