# Prisma Schema 샘플 데이터

## 01

```prisma
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  name     String
  orders   Order[]  // 1:N (User -> Order)
  createdAt DateTime @default(now())
}

model Order {
  id         Int         @id @default(autoincrement())
  userId     Int
  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  items      OrderItem[] // N:M의 중간(조인) 테이블
  createdAt  DateTime    @default(now())
}

model Product {
  id         Int         @id @default(autoincrement())
  sku        String      @unique
  name       String
  price      Int         // 원 단위 가정
  items      OrderItem[] // 주문들과의 연결
  createdAt  DateTime    @default(now())
}

model OrderItem {
  id        Int      @id @default(autoincrement())
  orderId   Int
  productId Int
  qty       Int
  unitPrice Int

  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Restrict)

  @@unique([orderId, productId]) // 같은 주문에 같은 상품 중복 방지
}
```

_======================================================================================_
