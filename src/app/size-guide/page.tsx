export const metadata = { title: "Size Guide — MANDEM" };

const tops = [
  { size: "S", chest: "96-101", length: "68" },
  { size: "M", chest: "102-107", length: "70" },
  { size: "L", chest: "108-113", length: "72" },
  { size: "XL", chest: "114-119", length: "74" },
  { size: "XXL", chest: "120-126", length: "76" },
];

const bottoms = [
  { size: "28", waist: "71-74", hip: "92-95" },
  { size: "30", waist: "76-79", hip: "97-100" },
  { size: "32", waist: "81-84", hip: "102-105" },
  { size: "34", waist: "86-89", hip: "107-110" },
  { size: "36", waist: "91-94", hip: "112-115" },
];

export default function SizeGuidePage() {
  return (
    <div className="container-max px-4 md:px-6 py-12 md:py-16 max-w-3xl mx-auto">
      <h1 className="font-display uppercase text-3xl md:text-4xl tracking-tight mb-2">Size Guide</h1>
      <p className="text-concrete-600 mb-10">All measurements in centimeters. Still unsure? Message us and we&apos;ll help you pick a size.</p>

      <h2 className="font-display uppercase text-lg mb-4">Tees, Hoodies &amp; Outerwear</h2>
      <table className="w-full text-sm mb-10 border-collapse">
        <thead>
          <tr className="border-b border-ink">
            <th className="text-left py-2 font-display uppercase">Size</th>
            <th className="text-left py-2 font-display uppercase">Chest</th>
            <th className="text-left py-2 font-display uppercase">Length</th>
          </tr>
        </thead>
        <tbody>
          {tops.map((r) => (
            <tr key={r.size} className="border-b border-concrete-200">
              <td className="py-2">{r.size}</td>
              <td className="py-2">{r.chest}</td>
              <td className="py-2">{r.length}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-display uppercase text-lg mb-4">Bottoms</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-ink">
            <th className="text-left py-2 font-display uppercase">Size</th>
            <th className="text-left py-2 font-display uppercase">Waist</th>
            <th className="text-left py-2 font-display uppercase">Hip</th>
          </tr>
        </thead>
        <tbody>
          {bottoms.map((r) => (
            <tr key={r.size} className="border-b border-concrete-200">
              <td className="py-2">{r.size}</td>
              <td className="py-2">{r.waist}</td>
              <td className="py-2">{r.hip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
