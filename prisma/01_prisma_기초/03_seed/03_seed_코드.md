# seed 샘플 데이터

## 01

```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 깨끗이
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 상품 3개
  const [p1, p2, p3] = await Promise.all([
    prisma.product.create({
      data: { sku: 'SKU-APPLE', name: 'Apple', price: 1200 },
    }),
    prisma.product.create({
      data: { sku: 'SKU-BANANA', name: 'Banana', price: 800 },
    }),
    prisma.product.create({
      data: { sku: 'SKU-MILK', name: 'Milk', price: 2500 },
    }),
  ]);

  // 유저 + 주문 + 아이템을 **중첩 생성**
  const user = await prisma.user.create({
    data: {
      email: 'a@example.com',
      name: 'Alice',
      orders: {
        create: [
          {
            items: {
              create: [
                { productId: p1.id, qty: 2, unitPrice: p1.price },
                { productId: p3.id, qty: 1, unitPrice: p3.price },
              ],
            },
          },
          {
            items: {
              create: [{ productId: p2.id, qty: 5, unitPrice: p2.price }],
            },
          },
        ],
      },
    },
    include: { orders: { include: { items: true } } },
  });

  console.log('✅ seed done for user:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

_======================================================================================_
