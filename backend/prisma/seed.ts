import { PrismaClient, Role, IsBan, ItemUnit, MenuStatus } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Seed Users
  await prisma.user.createMany({
    data: [
      { username: 'manager1', password: '$2y$10$yalMDdaMAiGvBbKypnqY4OyeXWiGlLMpqtL6QoZV2DhUPyKELKeGG', email: 'emailmanager1@gmail.com', firstName: 'manager1firstname', lastName: 'manager1lastname', role: Role.Manager },
      { username: 'barista1', password: '$2y$10$uHZ.MtSDAYbWN7sARw8HGOfseWxLcsLYVp2CgJNJvQFWvrsN/nVui', email: 'emailbarista1@gmail.com', firstName: 'barista1firstname', lastName: 'barista1lastname', role: Role.Barista },
      { username: 'customer1', password: '$2y$10$ts0AXk.zC2LxiOgXlT.cN.Ks4moPoGptcNIKZkNeBVr/q2bZ.a4Z2', email: 'emailcustomer1@gmail.com', firstName: 'customer1firstname', lastName: 'customer1lastname', role: Role.Customer },
    ],
  })

  // Seed Suppliers
  await prisma.supplier.createMany({
    data: [
      { supplierName: 'Supplier 1', supplierContact: "0857901", isBan: IsBan.false },
      { supplierName: 'Supplier 2', supplierContact: "0857902", isBan: IsBan.false },
    ],
  })

  // Seed Items (coffee ingredients)
  await prisma.item.createMany({
    data: [
      { barcodeItem: 909, itemName: 'Milk Bendera', netto: 1000, itemUnit: ItemUnit.milliliters },
      { barcodeItem: 910, itemName: 'Sugar Gulaku', netto: 500, itemUnit: ItemUnit.gram },
      { barcodeItem: 911, itemName: 'Arabica Coffee Beans', netto: 1000, itemUnit: ItemUnit.gram },
      { barcodeItem: 912, itemName: 'Vanilla Syrup', netto: 500, itemUnit: ItemUnit.milliliters },
      { barcodeItem: 913, itemName: 'Caramel Syrup', netto: 500, itemUnit: ItemUnit.milliliters },
    ],
  })

  // Seed ItemIn
  await prisma.itemIn.createMany({
    data: [
      { barcodeItem: 909, totalItemReceived: 100, expired: new Date('2025-12-31'), pricePerItem: 10000, dateItemReceived: new Date('2025-02-21T10:00:00'), supplierId: 1, receiverId: 2 },
      { barcodeItem: 910, totalItemReceived: 50, expired: new Date('2025-12-30'), pricePerItem: 25000, dateItemReceived: new Date('2025-02-21T11:00:00'), supplierId: 2, receiverId: 1 },
      { barcodeItem: 911, totalItemReceived: 20, expired: new Date('2025-12-19'), pricePerItem: 9500, dateItemReceived: new Date('2025-02-20T10:00:00'), supplierId: 1, receiverId: 2 },
      { barcodeItem: 912, totalItemReceived: 30, expired: new Date('2025-12-25'), pricePerItem: 15000, dateItemReceived: new Date('2025-02-22T09:00:00'), supplierId: 2, receiverId: 1 },
      { barcodeItem: 913, totalItemReceived: 40, expired: new Date('2025-12-28'), pricePerItem: 18000, dateItemReceived: new Date('2025-02-22T10:00:00'), supplierId: 1, receiverId: 2 },
    ],
  })

  // Seed Inventory
  await prisma.inventory.createMany({
    data: [
      { barcodeItem: 909, itemName: 'Milk Bendera', itemInId: 1, expired: new Date('2025-12-31'), remainingItem: 100 },
      { barcodeItem: 910, itemName: 'Sugar Gulaku', itemInId: 2, expired: new Date('2025-12-30'), remainingItem: 50 },
      { barcodeItem: 911, itemName: 'Arabica Coffee Beans', itemInId: 3, expired: new Date('2025-12-19'), remainingItem: 20 },
      { barcodeItem: 912, itemName: 'Vanilla Syrup', itemInId: 4, expired: new Date('2025-12-25'), remainingItem: 30 },
      { barcodeItem: 913, itemName: 'Caramel Syrup', itemInId: 5, expired: new Date('2025-12-28'), remainingItem: 40 },
    ],
  })

  // Seed Coffee Beverage Menus
  const menu1 = await prisma.menu.create({
    data: {
      menuName: 'Espresso',
      menuDescription: 'Strong black coffee made by forcing steam through ground coffee beans',
      price: 800, // Price in cents (e.g., $8.00)
      status: MenuStatus.available,
      Recipe: {
        create: [
          { barcodeItem: 911, quantity: 20.0, itemUnit: ItemUnit.gram }, // Coffee Beans
        ],
      },
    },
  });

  const menu2 = await prisma.menu.create({
    data: {
      menuName: 'Cappuccino',
      menuDescription: 'Espresso mixed with steamed milk and topped with foamed milk',
      price: 1200, // Price in cents (e.g., $12.00)
      status: MenuStatus.available,
      Recipe: {
        create: [
          { barcodeItem: 911, quantity: 20.0, itemUnit: ItemUnit.gram }, // Coffee Beans
          { barcodeItem: 909, quantity: 100.0, itemUnit: ItemUnit.milliliters }, // Milk
        ],
      },
    },
  });

  const menu3 = await prisma.menu.create({
    data: {
      menuName: 'Vanilla Latte',
      menuDescription: 'Espresso with steamed milk and vanilla syrup',
      price: 1500, // Price in cents (e.g., $15.00)
      status: MenuStatus.available,
      Recipe: {
        create: [
          { barcodeItem: 911, quantity: 20.0, itemUnit: ItemUnit.gram }, // Coffee Beans
          { barcodeItem: 909, quantity: 100.0, itemUnit: ItemUnit.milliliters }, // Milk
          { barcodeItem: 912, quantity: 10.0, itemUnit: ItemUnit.milliliters }, // Vanilla Syrup
        ],
      },
    },
  });

  const menu4 = await prisma.menu.create({
    data: {
      menuName: 'Caramel Macchiato',
      menuDescription: 'Espresso with steamed milk, caramel syrup, and a drizzle of caramel',
      price: 1600, // Price in cents (e.g., $16.00)
      status: MenuStatus.available,
      Recipe: {
        create: [
          { barcodeItem: 911, quantity: 20.0, itemUnit: ItemUnit.gram }, // Coffee Beans
          { barcodeItem: 909, quantity: 100.0, itemUnit: ItemUnit.milliliters }, // Milk
          { barcodeItem: 913, quantity: 10.0, itemUnit: ItemUnit.milliliters }, // Caramel Syrup
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    }
    )

