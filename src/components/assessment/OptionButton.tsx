type OptionButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export default function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-lg border p-4 text-left text-lg leading-relaxed transition ${
        selected
          ? "border-deep-green bg-new-growth text-dark-gray"
          : "border-mid-gray bg-off-white text-dark-gray hover:border-bark"
      }`}
    >
      {label}
    </button>
  );
}
