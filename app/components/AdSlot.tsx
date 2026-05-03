interface AdSlotProps {
  width?: number;
  height?: number;
  label?: string;
  className?: string;
}

export default function AdSlot({ width = 728, height = 90, label = "Advertisement", className = "" }: AdSlotProps) {
  return (
    <aside aria-label={label}
      className={`flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 mx-auto my-4 ${className}`}
      style={{ width: "100%", maxWidth: width, minHeight: height }}>
      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">{label}</span>
      <span className="text-[10px] text-gray-300 mt-0.5">{width} × {height}</span>
    </aside>
  );
}