type Props = {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit";
    color?:
    | "brand"
    | "secondary"
    | "accent"
    | "admin"
    | "user"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "pink"
    | "orange"
    | "teal"
    | "lime"
    | "rose";
};

export default function Button({
    text,
    onClick,
    type = "button",
    color = "brand"
}: Props) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`
        bg-${color}
        hover:opacity-90
        text-white
        px-4
        py-2
        rounded
        font-semibold
        transition
      `}
        >
            {text}
        </button>
    );
}
