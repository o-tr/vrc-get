"use client";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { TauriProject } from "@/lib/bindings";
import { commands } from "@/lib/bindings";
import { tc } from "@/lib/i18n";
import { ProjectGridItem } from "./-project-grid-item";
import {
	isSorting,
	type sortings,
	sortSearchProjects,
	useSetProjectSortingMutation,
} from "./-projects-list-card";

type SimpleSorting = (typeof sortings)[number];
type Sorting = SimpleSorting | `${SimpleSorting}Reversed`;

const sortingOptions: { key: SimpleSorting; label: string }[] = [
	{ key: "name", label: "general:name" },
	{ key: "type", label: "projects:type" },
	{ key: "unity", label: "projects:unity" },
	{ key: "lastModified", label: "general:last modified" },
];

export function ProjectsGridCard({
	projects,
	search,
	loading,
}: {
	projects: TauriProject[];
	search?: string;
	loading?: boolean;
}) {
	const sortingQuery = useQuery({
		initialData: "lastModified" as Sorting,
		queryKey: ["environmentGetProjectSorting"],
		queryFn: async () => {
			const newSorting = await commands.environmentGetProjectSorting();
			return !isSorting(newSorting) ? "lastModified" : newSorting;
		},
	});

	const setSortingStateMutation = useSetProjectSortingMutation();

	const currentKey = sortingQuery.data.replace(
		/Reversed$/,
		"",
	) as SimpleSorting;
	const isReversed = sortingQuery.data.endsWith("Reversed");

	const handleChangeSortingKey = (key: SimpleSorting) => {
		const newSorting = isReversed ? `${key}Reversed` : key;
		setSortingStateMutation.mutate({ sorting: newSorting as Sorting });
	};

	const toggleOrder = () => {
		const newSorting: Sorting = isReversed
			? currentKey
			: `${currentKey}Reversed`;
		setSortingStateMutation.mutate({ sorting: newSorting });
	};

	const projectsShown = useMemo(() => {
		return sortSearchProjects(projects, search ?? "", sortingQuery.data);
	}, [projects, search, sortingQuery.data]);

	return (
		<div className="flex flex-col h-full w-full overflow-hidden">
			<Card className="flex items-center mb-3 flex-wrap p-2 gap-2 compact:p-1 compact:gap-1">
				<p className="grow-0 whitespace-pre pl-2 leading-tight">
					{tc("projects:sort by")}
				</p>
				<Select
					value={currentKey}
					onValueChange={(value) =>
						handleChangeSortingKey(value as SimpleSorting)
					}
				>
					<SelectTrigger className="w-40">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{sortingOptions.map((option) => (
							<SelectItem key={option.key} value={option.key}>
								{tc(option.label)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Button variant="ghost" size="icon" onClick={toggleOrder}>
					{isReversed ? (
						<ArrowUp className="size-4" />
					) : (
						<ArrowDown className="size-4" />
					)}
				</Button>
			</Card>
			<ScrollArea
				type="auto"
				className="h-full w-full vrc-get-scrollable-card rounded-l-xl"
				scrollBarClassName="bg-background rounded-full border-l-0 p-[1.5px]"
			>
				<div
					className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 overflow-x-hidden mr-4
					compact:grid-cols-2 compact:lg:grid-cols-3 compact:2xl:grid-cols-4 compact:gap-1.5"
				>
					{projectsShown.map((project) => (
						<ProjectGridItem
							key={project.path}
							project={project}
							loading={loading}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
