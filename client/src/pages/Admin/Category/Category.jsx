import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteCategory, getCategories} from "@/features/category/categorySlice.js";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.jsx";
import Loader from "@/components/Loader.jsx";
import Header from "@/components/Header.jsx";
import {TableBody, TableCell, TableHead, TableHeader, TableRow, Table} from "@/components/ui/table.jsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem, DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Edit, MoreHorizontal, Trash2} from "lucide-react";
import moment from "moment";
import {UniversalDeleteModal} from "@/components/UniversalDeleteModal.jsx";

const TopSideButtons = () => {
	const navigate = useNavigate()
	
	return (
		<Button
			size="sm"
			variant="default"
			onClick={() => navigate('id')}
		>
			Create category
		</Button>
	)
}

const Category = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {loading, categories} = useSelector(state => state.category)
	
	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])
	
	const handleDeleteCourse = (data) => {
		dispatch(deleteCategory({id: data?.id}))
	}
	
	const {openModal, ModalComponent} = UniversalDeleteModal({
		onDelete: handleDeleteCourse,
		entityType: "category"
	});
	
	if (loading) return <Loader/>
	
	return (
		<>
			<Header title={"Categories"} buttons={<TopSideButtons/>}/>
			<div className="border rounded-xl bg-white my-4 shadow-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className={"border-r text-center"}>ID</TableHead>
							<TableHead className={"border-r text-center"}>Name</TableHead>
							<TableHead className={"border-r text-center"}>Slug</TableHead>
							<TableHead className={"border-r text-center"}>Course count</TableHead>
							<TableHead className={"border-r text-center"}>Created at</TableHead>
							<TableHead className="w-[100px] text-center">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categories?.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
									No categories found.
								</TableCell>
							</TableRow>
						) : (
							categories?.map((category) => (
								<TableRow key={category.id} className={"text-center"}>
									<TableCell className="font-medium border-r">{category.id}</TableCell>
									<TableCell className="font-medium border-r">
										{category.name}
									</TableCell>
									<TableCell className={"font-medium border-r"}>
										<Badge variant="secondary" className="font-mono">
											{category.slug}
										</Badge>
									</TableCell>
									<TableCell className={"font-medium border-r"}>
										<div className="flex items-center gap-2 justify-center">
											<Badge variant={category?.courses_count > 0 ? "default" : "outline"}>
												{category?.courses_count} courses
											</Badge>
										</div>
									</TableCell>
									<TableCell className="font-medium border-r">
										{moment(category?.created_at).format("DD-MM-YYYY")}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="sm">
													<MoreHorizontal className="h-4 w-4"/>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem
													onClick={() => navigate(`${category?.id}`)}
												>
													<Edit className="h-4 w-4 mr-2"/>
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => openModal(category)}
													className="text-red-600"
												>
													<Trash2 className="h-4 w-4 mr-2"/>
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							)))}
					</TableBody>
				</Table>
				{ModalComponent}
			</div>
		</>
	);
};

export default Category;