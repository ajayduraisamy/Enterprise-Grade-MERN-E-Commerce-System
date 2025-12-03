type Props = {
    value: string;
    onChange: (v: string) => void;
};

export default function OTPInput({ value, onChange }: Props) {

    return (
        <input
            value={value}
            maxLength={6}
            onChange={(e) =>
                onChange(e.target.value.replace(/\D/g, ""))
            }
            className="
        text-center text-lg tracking-[0.5em]
        border border-gray-400
        px-4 py-2 rounded w-full
      "
        />
    );
}
