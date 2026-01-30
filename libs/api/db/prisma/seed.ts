import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, ProductCategory } from '../src/generated/prisma/client'
import { ProductCreateInput, StoreCreateInput, StoreProductCreateInput } from '../src/generated/prisma/models'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const storeProductSeeds: Array<{
  store: StoreCreateInput
  storeProducts: Array<{
    product: ProductCreateInput
    storeProduct: Omit<StoreProductCreateInput, 'product' | 'store'>
  }>
}> = [
  {
    store: { name: 'My Store', location: 'New york' },
    storeProducts: [
      {
        product: { category: ProductCategory.Clothing, name: 'T-shirt' },
        storeProduct: { price: 3499, quantity: 5 },
      },
      {
        product: { category: ProductCategory.Clothing, name: 'Socks' },
        storeProduct: { price: 499, quantity: 2 },
      },
      {
        product: { category: ProductCategory.Electronics, name: 'Iphone' },
        storeProduct: { price: 9999, quantity: 25 },
      },
    ],
  },
  {
    store: { name: 'Your Store', location: 'Paris' },
    storeProducts: [
      {
        product: { category: ProductCategory.Toys, name: 'Teddybear' },
        storeProduct: { price: 499, quantity: 5 },
      },
      {
        product: { category: ProductCategory.Clothing, name: 'Glasses' },
        storeProduct: { price: 100000, quantity: 1 },
      },
      {
        product: { category: ProductCategory.Home, name: 'Table' },
        storeProduct: { price: 199, quantity: 3 },
      },
    ],
  },
  {
    store: { name: 'Nike', location: 'London' },
    storeProducts: [
      {
        product: { category: ProductCategory.Food, name: 'Bread' },
        storeProduct: { price: 99, quantity: 15 },
      },
      {
        product: { category: ProductCategory.Home, name: 'Broom' },
        storeProduct: { price: 4199, quantity: 2 },
      },
      {
        product: { category: ProductCategory.Toys, name: 'Bike' },
        storeProduct: { price: 20000, quantity: 2 },
      },
    ],
  },
  {
    store: { name: 'Apple', location: 'Berlin' },
    storeProducts: [
      {
        product: { category: ProductCategory.Home, name: 'Chair' },
        storeProduct: { price: 3499, quantity: 5 },
      },
      {
        product: { category: ProductCategory.Electronics, name: 'TV' },
        storeProduct: { price: 499, quantity: 2 },
      },
    ],
  },
]

const seed = async () => {
  try {
    console.log(`Seeding started 🌱`)

    const storesCount = await prisma.store.count()
    const alreadySeeded = storesCount > 0
    if (alreadySeeded) {
      console.log(`❌ Already seeded.`)
      return
    }

    for (const seed of storeProductSeeds) {
      await prisma.store.create({
        data: {
          ...seed.store,
          storeProducts: {
            create: seed.storeProducts.map((sp) => ({
              price: sp.storeProduct.price,
              quantity: sp.storeProduct.quantity,
              product: {
                connectOrCreate: {
                  where: {
                    name_category: {
                      name: sp.product.name,
                      category: sp.product.category,
                    },
                  },
                  create: sp.product,
                },
              },
            })),
          },
        },
      })
    }

    console.log(`Seeds created 🌱`)
  } catch (error) {
    console.error(`🔥`)
    console.warn(error)
  } finally {
    prisma.$disconnect()
  }
}

seed()
