**Context**: We are developing a modular inventory management system using a **monorepo** architecture. The system consists of several apps, such as `sync-customer`, `sync-vendor`, and shared logic in the `packages` directory. Each app is isolated and has its own Prisma schema to manage database connections and structure, enabling scalability, flexibility, and independence of each subapp.

### **Folder Structure Overview**:

- **Apps**: Each app (`sync-customer`, `sync-vendor`) contains submodules for different features (e.g., `shoppingList`, `favoriteVendors`, `vendorList`, `stock`). Each of these submodules will have its own Prisma schema and dedicated server-side logic.
- **Packages**: Shared services, utilities, constants, helpers, and optionally, a shared Prisma logic that may be reused across apps.
- **Prisma**: Each submodule will have its own `prisma/schema.prisma` file and Prisma client, allowing independent database management for each feature.
- **Monorepo Tools**: Using `pnpm-workspace.yaml` for managing dependencies across the monorepo and `turbo.json` for managing the build and deployment process efficiently.

### **Structure to Follow**:

```plaintext
synsalez_Backend_repo/
├── apps/
│   ├── sync-customer/
│   │   ├── apps/
│   │   │   ├── shoppingList/
│   │   │   │   ├── src/
│   │   │   │   │   ├── shopping-list.module.ts
│   │   │   │   │   ├── shopping-list.service.ts
│   │   │   │   │   └── shopping-list.controller.ts
│   │   │   │   ├── prisma/
│   │   │   │   │   ├── schema.prisma
│   │   │   │   │   └── client.ts
│   │   │   │   ├── package.json
│   │   │   │   └── tsconfig.json
│   │   │   ├── favoriteVendors/
│   │   │   │   ├── src/
│   │   │   │   │   ├── favorite-vendors.module.ts
│   │   │   │   │   ├── favorite-vendors.service.ts
│   │   │   │   │   └── favorite-vendors.controller.ts
│   │   │   │   ├── prisma/
│   │   │   │   │   ├── schema.prisma
│   │   │   │   │   └── client.ts
│   │   │   │   ├── package.json
│   │   │   │   └── tsconfig.json
│   │   │   └── products/
│   │   │       ├── src/
│   │   │       │   ├── products.module.ts
│   │   │       │   ├── products.service.ts
│   │   │       │   └── products.controller.ts
│   │   │       ├── prisma/
│   │   │       │   ├── schema.prisma
│   │   │       │   └── client.ts
│   │   │       ├── package.json
│   │   │       └── tsconfig.json
│   ├── sync-vendor/
│   │   ├── apps/
│   │   │   ├── vendorList/
│   │   │   │   ├── src/
│   │   │   │   │   ├── vendor-list.module.ts
│   │   │   │   │   ├── vendor-list.service.ts
│   │   │   │   │   └── vendor-list.controller.ts
│   │   │   │   ├── prisma/
│   │   │   │   │   ├── schema.prisma
│   │   │   │   │   └── client.ts
│   │   │   │   ├── package.json
│   │   │   │   └── tsconfig.json
│   │   │   ├── stock/
│   │   │   │   ├── src/
│   │   │   │   │   ├── stock.module.ts
│   │   │   │   │   ├── stock.service.ts
│   │   │   │   │   └── stock.controller.ts
│   │   │   │   ├── prisma/
│   │   │   │   │   ├── schema.prisma
│   │   │   │   │   └── client.ts
│   │   │   │   ├── package.json
│   │   │   │   └── tsconfig.json
│   │   │   └── products/
│   │   │       ├── src/
│   │   │       │   ├── products.module.ts
│   │   │       │   ├── products.service.ts
│   │   │       │   └── products.controller.ts
│   │   │       ├── prisma/
│   │   │       │   ├── schema.prisma
│   │   │       │   └── client.ts
│   │   │       ├── package.json
│   │   │       └── tsconfig.json
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── constants.ts
│   │   │   ├── utils.ts
│   │   │   └── interfaces.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   ├── prisma/
│   │   ├── src/
│   │   │   ├── prisma-client.ts
│   │   │   ├── migrations/
│   │   │   └── schema.prisma
│   │   ├── package.json
│   │   └── tsconfig.json
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── tsconfig.json
```

---

### **Detailed Steps for Future Code Generation**:

- **Create Subapp**:

  - Define a new subapp within an existing app (`sync-customer` or `sync-vendor`) for the feature you want to build (e.g., `productManagement`, `orderTracking`, etc.).
  - Generate `src` code for the module, service, and controller files.
  - Create a `prisma` folder within the subapp for its schema (`schema.prisma`) and Prisma client (`client.ts`).
  - Write necessary database migration and entity models within the Prisma schema.

- **Handle Dependencies**:

  - Add any required dependencies to the subapp's `package.json`.
  - Ensure that the Prisma client is initialized correctly in each subapp's `client.ts`.

- **Use Shared Logic**:

  - For shared utilities like constants or functions, import them from the `packages/shared` folder.
  - Optionally, you can import shared Prisma logic (if necessary) from the `packages/prisma` folder.

- **Leverage Monorepo Tools**:
  - Use `pnpm` and `turbo` to manage shared dependencies, handle builds, and orchestrate deployment.
  - Use `pnpm-workspace.yaml` to define the monorepo structure and ensure smooth dependency management.

---

### **What Can Be Generated Using This Prompt**:

- Subapp modules (e.g., `shoppingList`, `stock`, `vendorList`) with full TypeScript-based code (module, service, controller).
- Independent Prisma setup for each subapp with its own schema and database management.
- Prisma client configuration for easy database communication within the subapp.
- Shared utility code (e.g., constants, helpers, database queries) in the `packages/shared` and `packages/prisma` directories.
- Full app and database migration setup for easy scalability and future-proofing.

---

### **Example Request to Generate Code**:

You can now use this as a base to create code for new submodules or apps. For instance:

**Prompt Example**: "Generate a `productManagement` subapp for the `sync-vendor` app. The `productManagement` module should have its own Prisma schema for managing vendor products, with dedicated product service and controller logic. The subapp should also use the shared `utils.ts` from the `shared` package for helper functions."

---

By using this prompt format, you can easily extend the architecture, generate independent microservice-like apps, and ensure each component is scalable and isolated, with shared logic when necessary.

Let me know if you need further adjustments or more detailed instructions!
