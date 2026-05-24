import WhatsAppCTA from "./WhatsAppCTA";

export default function FloatingWhatsapp() {
  return (
    <WhatsAppCTA
      ariaLabel="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50"
    >
      <span className="wa-pulse relative inline-flex w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 grid place-items-center shadow-2xl">
        <svg
          className="w-7 h-7 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.52 3.48A12 12 0 003.45 20.42L2 22l1.66-1.42a12 12 0 0016.86-17.1zM12 20a8 8 0 01-4.07-1.11l-.29-.17-3 .8.8-2.92-.18-.3A8 8 0 1112 20zm4.45-5.6c-.24-.12-1.42-.7-1.64-.78s-.38-.12-.55.12-.62.78-.76.94-.28.18-.52.06a6.6 6.6 0 01-1.93-1.2 7.36 7.36 0 01-1.34-1.66c-.14-.24 0-.36.1-.48s.24-.28.36-.42a1.6 1.6 0 00.24-.4.45.45 0 000-.42c-.06-.12-.55-1.32-.75-1.8s-.4-.4-.55-.4h-.46a.9.9 0 00-.65.3 2.7 2.7 0 00-.85 2c0 1.18.86 2.32.98 2.48s1.7 2.6 4.13 3.64a14.2 14.2 0 001.42.52 3.4 3.4 0 001.55.1 2.55 2.55 0 001.66-1.18 2.06 2.06 0 00.14-1.18c-.06-.1-.22-.16-.46-.28z" />
        </svg>
      </span>
    </WhatsAppCTA>
  );
}
