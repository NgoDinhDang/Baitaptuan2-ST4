// Câu 1: Constructor function Product
function Product(id, name, price, quantity, category, isAvailable) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.isAvailable = isAvailable;
}

// Câu 2: Mảng products (ít nhất 6 sản phẩm, >= 2 danh mục)
const products = [
    new Product(1, "iPhone 15 Pro", 35000000, 10, "Phone", true),
    new Product(2, "Samsung S24", 28000000, 0, "Phone", true),
    new Product(3, "MacBook Pro", 52000000, 5, "Laptop", true),
    new Product(4, "Chuột Logitech", 1200000, 20, "Accessories", true),
    new Product(5, "Tai nghe Sony", 8000000, 0, "Accessories", false),
    new Product(6, "iPad Air", 18000000, 7, "Tablet", true)
];

// Câu 3: Mảng mới chỉ chứa name và price
const nameAndPrice = products.map(p => ({
    name: p.name,
    price: p.price
}));
console.log("Câu 3:", nameAndPrice);

// Câu 4: Lọc sản phẩm còn hàng (quantity > 0)
const inStockProducts = products.filter(p => p.quantity > 0);
console.log("Câu 4:", inStockProducts);

// Câu 5: Kiểm tra có sản phẩm giá > 30.000.000 không
const hasExpensiveProduct = products.some(p => p.price > 30000000);
console.log("Câu 5:", hasExpensiveProduct);

// Câu 6: Kiểm tra tất cả sản phẩm Accessories có đang bán không
const accessoriesAvailable = products
    .filter(p => p.category === "Accessories")
    .every(p => p.isAvailable === true);
console.log("Câu 6:", accessoriesAvailable);

// Câu 7: Tính tổng giá trị kho
const totalInventoryValue = products.reduce(
    (total, p) => total + p.price * p.quantity,
    0
);
console.log("Câu 7 - Tổng giá trị kho:", totalInventoryValue);

// Câu 8: for...of in thông tin
console.log("Câu 8:");
for (const p of products) {
    console.log(`Tên: ${p.name} | Danh mục: ${p.category} | Trạng thái: ${p.isAvailable}`);
}

// Câu 9: for...in in tên thuộc tính và giá trị
console.log("Câu 9:");
for (const key in products[0]) {
    console.log(`${key}: ${products[0][key]}`);
}

// Câu 10: Danh sách tên sản phẩm đang bán và còn hàng
const sellingAndInStock = products
    .filter(p => p.isAvailable && p.quantity > 0)
    .map(p => p.name);

console.log("Câu 10:", sellingAndInStock);
