import React, {useEffect, useState} from 'react';
import {
	DragDropContext,
	Droppable,
	Draggable,
	// DropResult
} from "@hello-pangea/dnd";

import {cn} from "@/lib/utils.js";
import {Grip, Pencil} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";

const LessonsList = ({items, onEdit, onReorder}) => {
	const [isMounted, setIsMounted] = useState(false)
	const [lessons, setLessons] = useState(items)
	
	useEffect(() => {
		setIsMounted(true)
	}, [])
	
	useEffect(() => {
		setLessons(items)
	}, [items])
	
	const onDragEnd = (result) => {
		if (!result.destination) return;
		
		const items = Array.from(lessons)
		
		const [reorderItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderItem)
		
		const startIndex = Math.min(result.source.index, result.destination.index)
		const endIndex = Math.max(result.source.index, result.destination.index)
		
		const updatedLessons = items.slice(startIndex, endIndex + 1)
		setLessons(items)
		
		const bulkUpdateData = updatedLessons?.map((lesson) => ({
			id: lesson?.id,
			order_index: items.findIndex((item) => item?.id === lesson?.id)
		}))
		
		onReorder(bulkUpdateData)
	}
	
	if (!isMounted) return null
	
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="lessons">
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{lessons?.map((lesson, index) => (
							<Draggable
								key={lesson?.id?.toString()}
								draggableId={lesson?.id?.toString()}
								index={index}
							>
								{(provided) => (
									<div
										className={cn(
											"flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
											lesson?.is_published && "bg-sky-100 border-sky-200 text-sky-700"
										)}
										ref={provided.innerRef}
										{...provided.draggableProps}
									>
										<div
											className={cn(
												"px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
												lesson?.is_published && "border-r-sky-200 hover:bg-sky-200"
											)}
											{...provided.dragHandleProps}
										>
											<Grip className="w-5 h-5"/>
										</div>
										{lesson?.title}
										<div className="ml-auto pr-2 flex items-center gap-x-2">
											{lesson?.is_preview && <Badge>Free</Badge>}
											<Badge
												className={cn(
													"bg-slate-500",
													lesson?.is_published && "bg-sky-700"
												)}
											>
												{lesson?.is_published ? "Published" : "Draft"}
											</Badge>
											<Pencil
												onClick={() => onEdit(lesson?.id)}
												className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
											/>
										</div>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default LessonsList;