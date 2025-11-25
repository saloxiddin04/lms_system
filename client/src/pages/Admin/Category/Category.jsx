import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteCategory, getCategories, searchCategory} from "@/features/category/categorySlice.js";
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
import {Edit, MoreHorizontal, Trash2, Search, X} from "lucide-react";
import moment from "moment";
import {UniversalDeleteModal} from "@/components/UniversalDeleteModal.jsx";
import {Input} from "@/components/ui/input.jsx";

const TopSideButtons = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	
	const [searchTerm, setSearchTerm] = useState('');
	
	const handleSearch = () => {
		if (searchTerm.trim()) {
			dispatch(searchCategory(searchTerm));
		} else {
			dispatch(getCategories());
		}
	};
	
	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};
	
	const clearSearch = () => {
		setSearchTerm('');
		dispatch(getCategories());
	};
	
	return (
		<div className="flex items-center gap-4 flex-wrap">
			<div className="flex items-center gap-2 flex-wrap">
				{/* Search Input */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
					<Input
						type="text"
						placeholder="Search categories..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyPress={handleKeyPress}
						className="pl-10 pr-10 w-64"
					/>
					{searchTerm && (
						<X
							className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600"
							onClick={clearSearch}
						/>
					)}
				</div>
				
				{/* Search Button */}
				<Button onClick={handleSearch} variant="outline" size="sm">
					Search
				</Button>
			</div>
			
			<Button
				size="sm"
				variant="default"
				onClick={() => navigate('id')}
			>
				Create category
			</Button>
		</div>
	)
}

const Category = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {loading, categories, searchLoading} = useSelector(state => state.category)
	
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
						{loading || searchLoading ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-8">
									<Loader/>
								</TableCell>
							</TableRow>
						) : categories?.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
							))
						)}
					</TableBody>
				</Table>
				{ModalComponent}
			</div>
		</>
	);
};

export default Category;