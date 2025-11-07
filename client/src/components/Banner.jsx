import React from 'react';
import {cva} from "class-variance-authority";
import {cn} from "@/lib/utils.js";
import {AlertTriangle, CheckCircleIcon} from "lucide-react";

const bannerVariants = cva(
	"border text-center p-4 text-sm flex items-center w-full",
	{
		variants: {
			variant: {
				warning: "bg-yellow-200/20 border-yellow-30 text-primary",
				success: "bg-emerald-700 border-emerald-800 text-secondary"
			}
		},
		defaultVariants: {
			variant: "warning"
		}
	}
)

const iconMap = {
	warning: AlertTriangle,
	success: CheckCircleIcon
}

const Banner = ({label, variant}) => {
	const Icon = iconMap[variant || "warning"]
	
	return (
		<div className={cn(bannerVariants({variant}))}>
			<Icon className={"w-4 h-4 mr-2"} />
			{label}
		</div>
	);
};

export default Banner;