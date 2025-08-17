"use client";

import type React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function VStack({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div className={`flex flex-col w-full gap-3 ${className}`}>{children}</div>
	);
}

export function HNavBar({
	className,
	leading,
	trailing,
	commonClassName,
	leadingClassName,
	trailingClassName,
}: {
	className?: string;
	leading: React.ReactNode;
	trailing?: React.ReactNode;
	commonClassName?: string;
	leadingClassName?: string;
	trailingClassName?: string;
}) {
	return (
		<Card className={`${className} mx-auto px-4 py-2 w-full`}>
			<div className="mx-auto flex flex-grow items-center justify-between text-primary gap-2">
				<div
					className={cn(
						"flex items-center gap-2 me-auto grow shrink",
						commonClassName,
						leadingClassName,
					)}
				>
					{leading}
				</div>
				<div
					className={cn(
						"flex items-center gap-2 ms-auto flex-wrap justify-end",
						commonClassName,
						trailingClassName,
					)}
				>
					{trailing}
				</div>
			</div>
		</Card>
	);
}
