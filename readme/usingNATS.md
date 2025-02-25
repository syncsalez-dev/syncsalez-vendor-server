To set everything up, we need to follow a few steps. These steps will involve creating Docker images for your microservices, setting up the environment, and ensuring proper configuration for NATS and Prisma integration. Below, I’ll walk you through the process step by step.

### 1. **Set Up the Services and Prisma**

Start by setting up the core services for the **sync-customer** and **sync-vendor** applications, ensuring that each service has its own Prisma client for interacting with the database.

---

#### **Step 1: Set Up Prisma in Each Service**

1. **Prisma Client Setup**:

   Each service (e.g., `sync-vendor`, `sync-customer`) needs a `prisma/client.ts` file to interact with the database. Let’s create the `prisma` setup.

##### Example: Prisma Client Setup for **sync-vendor**

`apps/sync-vendor/prisma/client.ts`

```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

This file will allow the service to interact with the database by using Prisma queries.

2. **Define Database Models in `schema.prisma`**:

Define the models in the `schema.prisma` file for each service to manage database tables. Here’s a sample for the `sync-vendor` service.

##### Example: Prisma Schema for **sync-vendor**

`apps/sync-vendor/prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id        String   @id @default(cuid())
  name      String
  stock     Int
  price     Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

#### **Step 2: Set Up NATS**

We will set up NATS as a service and connect our microservices to it. You will need to set up a **NATS client** to handle publishing and subscribing to events.

1. **Install NATS Client** in your app:

   Install the **NATS** client in each microservice.

   ```bash
   npm install nats
   ```

2. **NATS Service (Publishing & Subscribing)**:

   Create a `NatsService` to handle communication with the NATS server. This will be used for both publishing and subscribing to events.

##### Example: NATS Service Setup

`apps/sync-vendor/nats/nats.service.ts`

```typescript
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { connect, NatsConnection, StringCodec } from 'nats';

@Injectable()
export class NatsService implements OnModuleDestroy {
  private natsClient: NatsConnection;
  private sc: StringCodec;
  private natsServer = process.env.NATS_SERVER || 'nats://localhost:4222';

  constructor() {
    this.sc = StringCodec();
    this.connect();
  }

  private async connect() {
    try {
      this.natsClient = await connect({ servers: this.natsServer });
      console.log('Connected to NATS');
    } catch (error) {
      console.error('Failed to connect to NATS', error);
    }
  }

  // Publish an event
  async publish(subject: string, message: string) {
    try {
      const encodedMessage = this.sc.encode(message);
      this.natsClient.publish(subject, encodedMessage);
    } catch (error) {
      console.error('Failed to publish message', error);
    }
  }

  // Subscribe to an event
  async subscribe(subject: string, callback: (msg: string) => void) {
    try {
      const subscription = this.natsClient.subscribe(subject);
      for await (const msg of subscription) {
        callback(this.sc.decode(msg.data));
      }
    } catch (error) {
      console.error('Failed to subscribe to event', error);
    }
  }

  // Graceful shutdown of NATS client
  onModuleDestroy() {
    this.natsClient.close();
    console.log('NATS connection closed');
  }
}
```

---

#### **Step 3: Create Dockerfile for Each Service**

To containerize the services, each service needs a `Dockerfile`. Below is an example of a Dockerfile for the **sync-vendor** service.

##### Example: `Dockerfile` for **sync-vendor**

```dockerfile
# Base image with Node.js
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Set environment variable for Prisma
ENV DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db

# Start the application
CMD ["npm", "run", "start:prod"]
```

Repeat this process for each service (`sync-customer`, `sync-vendor`, etc.).

---

#### **Step 4: Docker Compose Configuration**

Next, we will create a `docker-compose.yml` file to define all the services and dependencies, including NATS and PostgreSQL.

##### Example: `docker-compose.yml`

```yaml
version: '3.8'

services:
  app-sync-customer:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3001:3000'
    depends_on:
      - nats
      - db
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/inventory_db
      - NATS_SERVER=nats://nats:4222

  app-sync-vendor:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3002:3000'
    depends_on:
      - nats
      - db
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/inventory_db
      - NATS_SERVER=nats://nats:4222

  nats:
    image: nats:latest
    ports:
      - '4222:4222'
    restart: always
    container_name: nats

  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: inventory_db
    ports:
      - '5432:5432'
    restart: always
    container_name: db
```

- The **app-sync-customer** and **app-sync-vendor** services depend on **NATS** and **PostgreSQL** (running on the same Docker network).
- **NATS** listens on port 4222.
- **PostgreSQL** is configured with a basic user, password, and database, as required by Prisma.

---

#### **Step 5: Running the Services with Docker**

Now that everything is set up, we can start the services.

1. **Build and start the services**:

   In the root of your repository, run:

   ```bash
   docker-compose up --build
   ```

   This will:

   - Build the Docker images for all services.
   - Start the containers for **NATS**, **PostgreSQL**, and your app services (`sync-customer`, `sync-vendor`).

2. **Access your services**:
   - **sync-customer** will be available on port `3001`.
   - **sync-vendor** will be available on port `3002`.
   - **NATS** will be running on port `4222`.

---

### 2. **Summary of the Setup**

1. **Each Service** has:

   - Prisma Client for database interaction.
   - NATS Client for event-driven communication.
   - Dockerfile for containerization.

2. **Docker Compose**:

   - NATS as the message broker.
   - PostgreSQL for persistent storage.
   - Two services (`sync-customer` and `sync-vendor`) each running independently, communicating through NATS.

3. **Flow**:
   - Product sale events are published via NATS.
   - **StockService** and **TransactionService** listen for those events and perform operations like updating stock and logging transactions.

By following this structure, you have a clean and scalable **microservices architecture** with independent services that can scale independently, using **NATS** for communication and **Prisma** for database management.

---

---

Let’s dive deeper into how **NATS** can be used effectively with your existing folder structure. This will include:

1. **Handling Events with NATS** in multiple services.
2. **Communicating across different microservices** using NATS.
3. **Containerizing the entire application** using Docker.
4. **Gracefully handling NATS disconnections** and error handling.

---

### **1. Full Example for Event Handling with NATS**

You might want to handle events like **`shopping-list.updated`** or **`product.created`**. Here's how you can set it up across different services in your microservices architecture.

#### **a. NATS Service** (`apps/sync-customer/nats/nats.service.ts`)

The **NATS Service** will connect to NATS, publish, and subscribe to events across microservices.

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, NatsConnection, StringCodec } from 'nats';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private connection: NatsConnection;
  private codec = StringCodec();

  async onModuleInit() {
    try {
      this.connection = await connect({
        servers: ['nats://localhost:4222'], // Or use NATS Cloud URL
      });
      console.log('Connected to NATS');
    } catch (error) {
      console.error('Failed to connect to NATS', error);
    }
  }

  async publish(subject: string, message: string) {
    if (!this.connection) {
      console.error('NATS connection not established');
      return;
    }

    const encodedMessage = this.codec.encode(message);
    this.connection.publish(subject, encodedMessage);
    console.log(`Message published to ${subject}: ${message}`);
  }

  async subscribe(subject: string, callback: (message: string) => void) {
    if (!this.connection) {
      console.error('NATS connection not established');
      return;
    }

    const subscription = this.connection.subscribe(subject);
    for await (const msg of subscription) {
      callback(this.codec.decode(msg.data));
    }
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
      console.log('NATS connection closed');
    }
  }
}
```

- **onModuleInit**: Establishes the connection to NATS when the module starts.
- **publish**: Publishes an event to a specified subject.
- **subscribe**: Subscribes to a subject and listens for messages.
- **onModuleDestroy**: Ensures that the NATS connection is closed when the module is destroyed.

#### **b. NATS Module** (`apps/sync-customer/nats/nats.module.ts`)

This module will import and provide the `NatsService` for use across your microservices.

```typescript
import { Module } from '@nestjs/common';
import { NatsService } from './nats.service';

@Module({
  providers: [NatsService],
  exports: [NatsService],
})
export class NatsModule {}
```

---

### **2. Service Handling NATS Events**

Each service (like **`shoppingList.service.ts`**) in your microservice will interact with NATS via the `NatsService`.

#### **a. Shopping List Service** (`apps/sync-customer/shoppingList/shopping-list.service.ts`)

Let’s say when a shopping list is updated, we want to publish an event and let other services (like **sync-vendor**) listen for this event.

```typescript
import { Injectable } from '@nestjs/common';
import { NatsService } from '@apps/sync-customer/nats/nats.service';

@Injectable()
export class ShoppingListService {
  constructor(private readonly natsService: NatsService) {}

  async updateShoppingList(listId: string) {
    // Simulate update to shopping list in database (Not shown)

    // Publish event to NATS
    await this.natsService.publish(
      'shopping-list.updated',
      `Shopping list ${listId} updated`,
    );
  }
}
```

This service will **publish** the event to NATS whenever a shopping list is updated.

---

#### **b. Sync Vendor Service** (`apps/sync-vendor/stock/stock.service.ts`)

Now, in **`sync-vendor`**, we might want to **subscribe** to the `shopping-list.updated` event to update the stock, for instance.

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NatsService } from '@apps/sync-vendor/nats/nats.service';

@Injectable()
export class StockService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly natsService: NatsService) {}

  async onModuleInit() {
    // Subscribe to the 'shopping-list.updated' event
    this.natsService.subscribe('shopping-list.updated', (message) => {
      console.log('Received shopping list update event:', message);
      // Process the message (e.g., update the stock)
    });
  }

  async onModuleDestroy() {
    // Clean up NATS subscriptions if needed
  }
}
```

The **StockService** listens for the **`shopping-list.updated`** event published from **sync-customer** and processes the message.

---

### **3. Docker Configuration**

To run your application with **Docker** and **NATS**, you'll need the following configurations:

#### **a. Dockerfile for Application**

This Dockerfile is for building and running the NestJS application inside a Docker container.

```Dockerfile
# Use Node.js image as a base
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the app code
COPY . .

# Expose the app port
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "start:prod"]
```

#### **b. Docker Compose for App and NATS**

The **docker-compose.yml** file defines the application container and a **NATS** container, allowing both to run together.

```yaml
version: '3'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    depends_on:
      - nats
    environment:
      - NODE_ENV=production
      - NATS_SERVER=nats://nats:4222 # Use internal network for NATS

  nats:
    image: nats:latest
    ports:
      - '4222:4222'
    restart: always
    container_name: nats
    expose:
      - '4222' # Exposing NATS service for communication between apps
```

- **NATS Server** is set up with the default port `4222` and exposed for communication with your apps.
- The **app** container depends on the **NATS** container.

#### **c. Docker Network for Communication**

In Docker, containers communicate through an internal network. **NATS** and your app use `nats://nats:4222`, where `nats` is the service name defined in the `docker-compose.yml`.

---

### **4. Graceful Shutdown**

When working with **NATS**, it’s crucial to handle graceful shutdowns for disconnections and cleanup.

Here’s how to gracefully shut down the NATS connection:

```typescript
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { NatsService } from '@apps/sync-customer/nats/nats.service';

@Injectable()
export class NatsGracefulShutdownService implements OnModuleDestroy {
  constructor(private readonly natsService: NatsService) {}

  async onModuleDestroy() {
    // Ensure all NATS connections are closed properly
    await this.natsService.close();
    console.log('NATS connection gracefully closed');
  }
}
```

Add this service to your **NatsModule** or app-level providers to ensure that the connection is cleaned up properly when the application shuts down.

---

### **5. Error Handling and Retries**

Sometimes, network failures may occur when connecting to **NATS**. It’s good to implement error handling with retries:

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { NatsService } from '@apps/sync-customer/nats/nats.service';
import { connect, NatsConnection, StringCodec, ConnectionOptions } from 'nats';

@Injectable()
export class NatsServiceWithRetry implements OnModuleInit {
  private connection: NatsConnection;
  private codec = StringCodec();

  async onModuleInit() {
    try {
      // Retry logic for NATS connection
      await this.retryConnect({ retries: 5, delay: 1000 });
      console.log('Connected to NATS');
    } catch (error) {
      console.error('Failed to connect to NATS after retries', error);
    }
  }

  private async retryConnect(options: { retries: number; delay: number }) {
    const { retries, delay } = options;
    let attempts = 0;
    let connected = false;

    while (attempts < retries && !connected) {
      try {
        this.connection = await connect({
          servers: ['nats://localhost:4222'],
        });
        connected = true;
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed. Retrying...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (!connected) throw new Error('Unable to connect to NATS');
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
      console.log('NATS connection closed');
    }
  }
}
```

---

### Conclusion

With this setup:

1. **Event-driven communication** across microservices using **NATS**.
2. **Docker** to containerize the whole stack.
3. **Graceful shutdown** and **retry logic** for reliable communication.

You can scale your services and manage communication across multiple instances in a robust way. Let me know if you need more details on any part!

---

## Internal Usage

When we think about managing a **product sale** and impacting **stock**, **transactions**, or any other related operations within the **sync-vendor** service, we need to define the flow of events and operations that will be executed. Let’s break down the typical flow:

1. **Product Sale Event**: When a product is sold (for example, a sale is made through an API), we will **publish an event** to **NATS** so other services can react to it (e.g., updating stock, logging a transaction).

2. **Stock Update**: Once the **product sale** event is published, the **StockService** within **sync-vendor** should listen for this event and reduce the stock accordingly.

3. **Transaction Logging**: Similarly, when a product is sold, the **TransactionService** can listen for the event and log the transaction for record-keeping.

---

### Scenario

Let’s assume the following flow when a product is sold:

- A **sale** happens.
- We want to:
  1. **Update Stock** for the product sold.
  2. **Log the Transaction** to track the sale.
  3. **Notify Other Services** via NATS if necessary.

---

### **1. Sale Event Published (ProductSaleService)**

The **ProductSaleService** will publish a `product.sold` event to NATS, which contains the details of the sale like the product ID, quantity, and the transaction ID.

#### **Product Sale Service** (Handling Sale and Publishing Event)

```typescript
import { Injectable } from '@nestjs/common';
import { NatsService } from '@apps/sync-vendor/nats/nats.service';
import { PrismaService } from '@apps/sync-vendor/prisma/client';

@Injectable()
export class ProductSaleService {
  constructor(
    private readonly natsService: NatsService,
    private readonly prismaService: PrismaService,
  ) {}

  async handleProductSale(productId: string, quantity: number, price: number) {
    // 1. Create the transaction entry
    const transaction = await this.prismaService.transaction.create({
      data: {
        productId,
        quantity,
        totalAmount: quantity * price,
      },
    });

    // 2. Publish the sale event to NATS (e.g., product.sold)
    const saleEvent = {
      transactionId: transaction.id,
      productId,
      quantity,
      price,
      totalAmount: quantity * price,
    };

    await this.natsService.publish('product.sold', JSON.stringify(saleEvent));

    console.log(`Product sale published: ${JSON.stringify(saleEvent)}`);
  }
}
```

- **handleProductSale** creates a **transaction** entry in the database using **Prisma** (which is your ORM).
- Then, the **sale event** is published to the NATS subject **`product.sold`** with the sale details.

---

### **2. Stock Update (StockService)**

The **StockService** in **sync-vendor** subscribes to the `product.sold` event to reduce the stock of the sold product.

#### **Stock Service** (Updating the Stock)

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { NatsService } from '@apps/sync-vendor/nats/nats.service';
import { PrismaService } from '@apps/sync-vendor/prisma/client';

@Injectable()
export class StockService implements OnModuleInit {
  constructor(
    private readonly natsService: NatsService,
    private readonly prismaService: PrismaService,
  ) {}

  async onModuleInit() {
    // Subscribe to product.sold event to handle stock updates
    this.natsService.subscribe('product.sold', async (message) => {
      const saleEvent = JSON.parse(message);
      const { productId, quantity } = saleEvent;

      // Fetch the current stock of the product
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        console.error('Product not found');
        return;
      }

      // Deduct stock based on the quantity sold
      const newStock = product.stock - quantity;

      if (newStock < 0) {
        console.error('Insufficient stock for the product');
        return;
      }

      // Update the stock in the database
      await this.prismaService.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      console.log(
        `Stock updated for product ${productId}: New stock is ${newStock}`,
      );
    });
  }
}
```

- **onModuleInit** subscribes to the `product.sold` event.
- When the event is received, it fetches the product from the database, checks if there is enough stock, and reduces it accordingly.

---

### **3. Transaction Logging (TransactionService)**

The **TransactionService** will also listen to the same event to log the transaction details into a separate transaction log (or a database table).

#### **Transaction Service** (Logging the Sale Transaction)

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { NatsService } from '@apps/sync-vendor/nats/nats.service';
import { PrismaService } from '@apps/sync-vendor/prisma/client';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    private readonly natsService: NatsService,
    private readonly prismaService: PrismaService,
  ) {}

  async onModuleInit() {
    // Subscribe to the product.sold event to log the transaction
    this.natsService.subscribe('product.sold', async (message) => {
      const saleEvent = JSON.parse(message);
      const { transactionId, productId, quantity, totalAmount } = saleEvent;

      // Log the transaction into a transaction log
      await this.prismaService.transactionLog.create({
        data: {
          transactionId,
          productId,
          quantity,
          totalAmount,
          createdAt: new Date(),
        },
      });

      console.log(`Transaction logged: ${JSON.stringify(saleEvent)}`);
    });
  }
}
```

- This service subscribes to the `product.sold` event and logs the sale transaction into a **transaction log**.
- It keeps track of the `transactionId`, `productId`, `quantity`, and `totalAmount`.

---

### **4. Docker Configuration**

Now, if you're using Docker, here's how you can run both **NATS** and your microservices in separate containers.

#### **docker-compose.yml** (with NATS and your Application)

```yaml
version: '3'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    depends_on:
      - nats
    environment:
      - NODE_ENV=production
      - NATS_SERVER=nats://nats:4222

  nats:
    image: nats:latest
    ports:
      - '4222:4222'
    restart: always
    container_name: nats
    expose:
      - '4222'

  # Optionally, you can have a database container for Prisma if needed
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: inventory_db
    ports:
      - '5432:5432'
    restart: always
```

- **NATS** container is set up on port `4222`.
- Your application (`app`) container will depend on NATS and will connect to it internally.

---

### **5. Summary of the Flow**

1. **ProductSaleService**:
   - Creates a **transaction** in the database.
   - Publishes a `product.sold` event to **NATS**.
2. **StockService**:

   - Subscribes to the `product.sold` event.
   - Reduces the **stock** for the sold product.

3. **TransactionService**:

   - Subscribes to the `product.sold` event.
   - Logs the **transaction** in a separate table or log.

4. **Docker**:
   - You use Docker to run both **NATS** and your application services, ensuring they can communicate seamlessly.

---

### **6. Scaling & Reliability**

- This approach can be **easily scaled** as the NATS service can handle millions of messages per second, and each microservice can scale independently by adding more instances.
- The **event-driven nature** ensures that each service handles its responsibilities independently, so the system is more resilient to failures in specific services.
- If needed, you can use **NATS Clustering** for high availability and reliability, which ensures that messages are not lost and the system is fault-tolerant.

---

This flow ensures that your **inventory system** is well-structured, scalable, and resilient. Each service is responsible for a specific action (stock update, transaction logging) while maintaining loose coupling via NATS messages.
