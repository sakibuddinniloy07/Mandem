// Social profiles shown as icons in the footer, the mobile menu and the
// Contact page. Paste each full URL between the quotes. While a url is empty
// its icon is still shown but isn't clickable.
//
// WhatsApp: use https://wa.me/ followed by the number with country code and
// no "+", spaces or dashes, e.g. https://wa.me/8801712345678

export type SocialId = "instagram" | "facebook" | "tiktok" | "whatsapp";

export const socialLinks: { id: SocialId; label: string; url: string }[] = [
  { id: "instagram", label: "Instagram", url: "" },
  { id: "facebook", label: "Facebook", url: "" },
  { id: "tiktok", label: "TikTok", url: "" },
  { id: "whatsapp", label: "WhatsApp", url: "" },
];
