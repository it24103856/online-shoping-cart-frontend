import toast from "react-hot-toast";

// Get the current cart from Local Storage
export function getCart() {
    const cartString = localStorage.getItem("cart");
    if (cartString == null) {
        localStorage.setItem("cart", "[]");
        return [];
    } else {
        return JSON.parse(cartString);
    }
}

// Add a product to the cart or update its quantity
export function addToCart(product, quantity) {
    const cart = getCart();
    
    // Check if the product already exists in the cart using its ID
    const productID = product.productId || product.productID;
    const index = cart.findIndex((item) => item.productID == productID);

    if (index === -1) {
        // If it's a new product, push it to the cart array
        cart.push({
            productID: productID,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image ? (Array.isArray(product.image) ? product.image[0] : product.image) : null
        });
        toast.success(`${product.name} added to cart`);
      
    } else {
        // If product exists, update the quantity
        const newQty = cart[index].quantity + quantity;
        
        if (newQty <= 0) {
            // Remove item if quantity becomes zero or less
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQty;
            toast.success(`Updated ${product.name} quantity to ${newQty}`);
        }
    }

    // Save the changes to Local Storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Notify other components (like Header) that the cart has changed
    window.dispatchEvent(new Event("cartUpdate"));
}

// Remove a specific product from the cart
export function removeFromCart(productID) {
    const cart = getCart();
    const index = cart.findIndex((item) => item.productID == productID);
    
    if (index !== -1) {
        const productName = cart[index].name;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        toast.success(`${productName} removed from cart`);

        // Notify Header to update the count
        window.dispatchEvent(new Event("cartUpdate"));
    }
}

// Clear the entire cart
export function emptyCart() {
    localStorage.setItem("cart", "[]");
    window.dispatchEvent(new Event("cartUpdate"));
}

// Calculate the total price of all items in the cart
export function getCartTotal() {
    let total = 0;
    const cart = getCart();

    cart.forEach((item) => {
        total += item.price * item.quantity;
    });
    return total;
}

// Update quantity for a specific product
export function updateCartQuantity(productID, newQuantity) {
    const cart = getCart();
    const index = cart.findIndex((item) => item.productID == productID);
    
    if (index !== -1) {
        if (newQuantity <= 0) {
            removeFromCart(productID);
        } else {
            cart[index].quantity = newQuantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            window.dispatchEvent(new Event("cartUpdate"));
        }
    }
}

// Get total item count in cart
export function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}