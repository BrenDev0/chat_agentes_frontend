interface Props {
	name: string;
	className?: string;
}

export default function Badge({ name, className }: Props) {
	const bdname = name
		.split(" ")
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase();

	return (
		<div
			className={`w-10 h-10 rounded-lg p-2 font-semibold mr-2 z-10 flex items-center justify-center ${
				className ? className : "bg-[#007D22]/20 text-[#007D22] text-[16px] "
			}`}
		>
			{bdname}
		</div>
	);
}
