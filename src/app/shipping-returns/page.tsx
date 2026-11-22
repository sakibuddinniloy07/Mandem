export const metadata = { title: "Shipping & Returns — MANDEM" };

export default function ShippingReturnsPage() {
  return (
    <div className="container-max px-4 md:px-6 py-12 md:py-16 max-w-2xl mx-auto space-y-10">
      <div>
        <h1 className="font-display uppercase text-3xl md:text-4xl tracking-tight mb-4">Shipping</h1>
        <ul className="list-disc list-inside space-y-2 text-concrete-800">
          <li>Inside Dhaka: ৳60 flat rate, delivered in 1&ndash;3 business days.</li>
          <li>Outside Dhaka: ৳120 flat rate, delivered in 3&ndash;5 business days.</li>
          <li>Free delivery nationwide on orders over ৳2,500.</li>
          <li>Pay by bKash at checkout, or Cash on Delivery.</li>
        </ul>
      </div>
      <div>
        <h2 className="font-display uppercase text-2xl tracking-tight mb-4">Returns &amp; Exchanges</h2>
        <ul className="list-disc list-inside space-y-2 text-concrete-800">
          <li>Unworn items with original tags can be exchanged within 7 days of delivery.</li>
          <li>Contact us with your order number to start an exchange.</li>
          <li>Sale items are final and cannot be returned or exchanged.</li>
        </ul>
      </div>
    </div>
  );
}
