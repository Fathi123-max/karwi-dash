import { createClient } from "@supabase/supabase-js";

// Use service role key for full access
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function seedProductData() {
  console.log("=== Seeding Product Data ===");

  // 1. Create product categories
  console.log("Creating product categories...");
  const categories = [
    { name: "Cleaning Supplies", description: "Essential cleaning products for car wash services" },
    { name: "Waxes & Polishes", description: "Premium waxes and polishes for vehicle protection" },
    { name: "Interior Care", description: "Products for maintaining vehicle interiors" },
    { name: "Exterior Care", description: "Products for maintaining vehicle exteriors" },
    { name: "Tools & Equipment", description: "Professional tools and equipment for car wash services" },
  ];

  const { data: createdCategories, error: categoriesError } = await supabase
    .from("product_categories")
    .insert(categories)
    .select();

  if (categoriesError) {
    console.error("Error creating categories:", categoriesError);
    return;
  }

  console.log(`Created ${createdCategories.length} categories`);
  const categoryIds = createdCategories.map((cat) => cat.id);

  // 2. Create products
  console.log("Creating products...");
  const products = [
    {
      name: "Premium Car Wash Shampoo",
      description: "High-quality shampoo for safe and effective vehicle cleaning",
      price: 12.99,
      stock_quantity: 100,
      category_id: categoryIds[0],
    },
    {
      name: "Microfiber Cleaning Cloths (Pack of 12)",
      description: "Ultra-soft microfiber cloths for scratch-free cleaning",
      price: 19.99,
      stock_quantity: 50,
      category_id: categoryIds[0],
    },
    {
      name: "Carnauba Wax - 16oz",
      description: "Premium carnauba wax for superior shine and protection",
      price: 24.99,
      stock_quantity: 75,
      category_id: categoryIds[1],
    },
    {
      name: "Interior Protectant Spray",
      description: "UV protectant for vinyl, rubber, and plastic surfaces",
      price: 14.99,
      stock_quantity: 60,
      category_id: categoryIds[2],
    },
    {
      name: "Tire Shine Gel",
      description: "Long-lasting tire shine that won't sling",
      price: 9.99,
      stock_quantity: 80,
      category_id: categoryIds[3],
    },
    {
      name: "Professional Buffer Kit",
      description: "Complete buffer kit for professional detailing",
      price: 149.99,
      stock_quantity: 15,
      category_id: categoryIds[4],
    },
  ];

  const { data: createdProducts, error: productsError } = await supabase.from("products").insert(products).select();

  if (productsError) {
    console.error("Error creating products:", productsError);
    return;
  }

  console.log(`Created ${createdProducts.length} products`);
  const productIds = createdProducts.map((prod) => prod.id);

  // 3. Get existing franchises
  console.log("Fetching franchises...");
  const { data: franchises, error: franchisesError } = await supabase.from("franchises").select("id, name");

  if (franchisesError) {
    console.error("Error fetching franchises:", franchisesError);
    return;
  }

  console.log(`Found ${franchises.length} franchises`);
  const franchiseIds = franchises.map((f) => f.id);

  // 4. Create sample product orders
  console.log("Creating sample product orders...");
  const sampleOrders = [
    {
      franchise_id: franchiseIds[0],
      total_amount: 154.95,
      status: "pending",
    },
    {
      franchise_id: franchiseIds[Math.min(1, franchiseIds.length - 1)],
      total_amount: 89.97,
      status: "processing",
    },
    {
      franchise_id: franchiseIds[Math.min(2, franchiseIds.length - 1)],
      total_amount: 219.94,
      status: "shipped",
    },
    {
      franchise_id: franchiseIds[Math.min(0, franchiseIds.length - 1)],
      total_amount: 44.97,
      status: "delivered",
    },
    {
      franchise_id: franchiseIds[Math.min(1, franchiseIds.length - 1)],
      total_amount: 189.96,
      status: "cancelled",
    },
  ];

  const { data: createdOrders, error: createOrdersError } = await supabase
    .from("product_orders")
    .insert(sampleOrders)
    .select();

  if (createOrdersError) {
    console.error("Error creating orders:", createOrdersError);
    return;
  }

  console.log(`Created ${createdOrders.length} orders`);

  // 5. Create order items for each order
  console.log("Creating order items...");
  for (let i = 0; i < createdOrders.length; i++) {
    const order = createdOrders[i];
    const orderItems = [];

    // Create different items for each order
    switch (i) {
      case 0:
        orderItems.push(
          { order_id: order.id, product_id: productIds[0], quantity: 3, price_per_unit: 12.99 },
          { order_id: order.id, product_id: productIds[2], quantity: 2, price_per_unit: 24.99 },
          { order_id: order.id, product_id: productIds[5], quantity: 1, price_per_unit: 149.99 },
        );
        break;
      case 1:
        orderItems.push(
          { order_id: order.id, product_id: productIds[1], quantity: 2, price_per_unit: 19.99 },
          { order_id: order.id, product_id: productIds[3], quantity: 3, price_per_unit: 14.99 },
        );
        break;
      case 2:
        orderItems.push(
          { order_id: order.id, product_id: productIds[0], quantity: 5, price_per_unit: 12.99 },
          { order_id: order.id, product_id: productIds[4], quantity: 4, price_per_unit: 9.99 },
          { order_id: order.id, product_id: productIds[2], quantity: 3, price_per_unit: 24.99 },
        );
        break;
      case 3:
        orderItems.push(
          { order_id: order.id, product_id: productIds[3], quantity: 1, price_per_unit: 14.99 },
          { order_id: order.id, product_id: productIds[4], quantity: 3, price_per_unit: 9.99 },
        );
        break;
      case 4:
        orderItems.push(
          { order_id: order.id, product_id: productIds[1], quantity: 4, price_per_unit: 19.99 },
          { order_id: order.id, product_id: productIds[2], quantity: 2, price_per_unit: 24.99 },
          { order_id: order.id, product_id: productIds[5], quantity: 1, price_per_unit: 149.99 },
        );
        break;
    }

    const { error: createItemsError } = await supabase.from("order_items").insert(orderItems);

    if (createItemsError) {
      console.error(`Error creating order items for order ${order.id}:`, createItemsError);
    } else {
      console.log(`Created ${orderItems.length} items for order ${order.id}`);
    }
  }

  console.log("=== Product data seeding completed successfully! ===");
}

seedProductData().catch(console.error);
