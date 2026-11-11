export default function AppLogo() {
    return (
        <div className="flex items-center gap-3 w-full py-1">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#221e1f] border border-[#c9ae7e]/30 shadow-xs">
                <img
                    src="/images/landing/mono-gold.png"
                    alt="Kothari 1937 Monogram"
                    className="h-5 w-auto object-contain"
                />
            </div>
            <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden overflow-hidden">
                <span
                    className="truncate text-[13px] tracking-[0.22em] uppercase text-[#ede7d6] font-normal"
                    style={{ fontFamily: 'Cinzel, Georgia, serif' }}
                >
                    Kothari 1937
                </span>
                <span className="truncate text-[9.5px] tracking-[0.18em] uppercase text-[#c9ae7e]/90 font-medium">
                    Fine Jewellery
                </span>
            </div>
        </div>
    );
}
