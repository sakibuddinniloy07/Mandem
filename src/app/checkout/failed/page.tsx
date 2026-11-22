import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function CheckoutFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  return (
    <div className="container-max px-4 md:px-6 py-20 md:py-28 text-center max-w-xl mx-auto">
      <XCircle size={56} className="mx-auto mb-6" />
      <h1 className="font-display uppercase text-3xl md:text-4xl tracking-tight mb-3">Payment Failed</h1>
      <p className="text-concrete-600 mb-8">
        {order ? (
          <>Your order <span className="font-display text-ink">#{order}</span> could not be paid for. </>
        ) : null}
        No charge was made. Please try again, or choose Cash on Delivery at checkout.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button href="/checkout">Try Again</Button>
        <Button href="/contact" variant="secondary">
          Contact Support
        </Button>
      </div>
    </div>
  );
}
