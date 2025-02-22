import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Seed Users
  await prisma.user.createMany({
    data: [
      { username: 'manager1', password: '$2y$10$yalMDdaMAiGvBbKypnqY4OyeXWiGlLMpqtL6QoZV2DhUPyKELKeGG', email: 'emailmanager1@gmail.com', firstName: 'manager1firstname', lastName: 'manager1lastname', role: 'Manager' },
      { username: 'barista1', password: '$2y$10$uHZ.MtSDAYbWN7sARw8HGOfseWxLcsLYVp2CgJNJvQFWvrsN/nVui', email: 'emailbarista1@gmail.com', firstName: 'barista1firstname', lastName: 'barista1lastname', role: 'Barista' },
      { username: 'customer1', password: '$2y$10$ts0AXk.zC2LxiOgXlT.cN.Ks4moPoGptcNIKZkNeBVr/q2bZ.a4Z2', email: 'emailcustomer1@gmail.com', firstName: 'customer1firstname', lastName: 'customer1lastname', role: 'Customer' },
    ],
  })

  // Seed Suppliers
  await prisma.supplier.createMany({
    data: [
      { supplierName: 'Supplier 1', supplierContact: "0857901" },
      { supplierName: 'Supplier 2', supplierContact: "0857902" },
    ],
  })

  // Seed Items
  await prisma.item.createMany({
    data: [
      { barcodeItem: 909, itemName: 'Milk Bendera', netto: 1000, itemUnit: 'milliliters' },
      { barcodeItem: 910, itemName: 'Sugar Gulaku', netto: 500, itemUnit: 'gram' },
    ],
  })

  // Seed ItemIn
  await prisma.itemIn.createMany({
    data: [
      { barcodeItem: 909, totalItemReceived: 100, expired: new Date('2025-12-31'), pricePerItem: 10000, dateItemReceived: new Date('2025-02-21T10:00:00'), supplierId: 1, receiverId: 2 },
      { barcodeItem: 910, totalItemReceived: 50, expired: new Date('2025-12-30'), pricePerItem: 25000, dateItemReceived: new Date('2025-02-21T11:00:00'), supplierId: 2, receiverId: 1 },
      { barcodeItem: 909, totalItemReceived: 20, expired: new Date('2025-12-19'), pricePerItem: 9500, dateItemReceived: new Date('2025-02-20T10:00:00'), supplierId: 1, receiverId: 2 },
    ],
  })

  // Seed Inventory
  await prisma.inventory.createMany({
    data: [
      { barcodeItem: 909, itemName: 'Milk Bendera', itemInId: 1, expired: new Date('2025-12-31'), remainingItem: 100 },
      { barcodeItem: 910, itemName: 'Sugar Gulaku', itemInId: 2, expired: new Date('2025-12-30'), remainingItem: 50 },
      { barcodeItem: 909, itemName: 'Milk Bendera', itemInId: 3, expired: new Date('2025-12-19'), remainingItem: 20 },
    ],
  })
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

