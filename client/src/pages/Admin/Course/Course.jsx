import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getCourses, searchCourse, togglePublishCourse} from "@/features/course/courseSlice.js";
import Loader from "@/components/Loader.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import instance from "@/utils/axios.js";
import Header from "@/components/Header.jsx";
import {useNavigate} from "react-router-dom";
import {TableBody, TableCell, TableHead, TableHeader, TableRow, Table} from "@/components/ui/table.jsx";
import moment from "moment";
import {
	DropdownMenu,
	DropdownMenuContent, DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Edit, MoreHorizontal, ViewIcon, Search, X} from "lucide-react";
import {Input} from "@/components/ui/input.jsx";
import {getCategories} from "@/features/category/categorySlice.js";

const TopSideButtons = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	
	const {categories} = useSelector(state => state.category)
	
	const [searchTerm, setSearchTerm] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('');
	
	const handleSearch = () => {
		if (searchTerm.trim() || categoryFilter) {
			dispatch(searchCourse({q: searchTerm, category: categoryFilter}));
		}
	};
	
	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};
	
	const clearSearch = () => {
		setSearchTerm('');
		setCategoryFilter('');
		dispatch(getCourses());
	};
	
	return (
		<div className="flex items-center gap-4 flex-wrap">
			<div className="flex items-center gap-2 flex-wrap">
				{/* Text Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400"/>
					<Input
						type="text"
						placeholder="Search courses..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyPress={handleKeyPress}
						className="pl-10 pr-10 w-64"
					/>
					{searchTerm && (
						<X
							className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600"
							onClick={() => setSearchTerm('')}
						/>
					)}
				</div>
				
				{/* Category Filter */}
				<select
					value={categoryFilter}
					onChange={(e) => setCategoryFilter(e.target.value)}
					className="border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">All Categories</option>
					{categories?.map((category, index) => (
						<option key={index} value={category?.slug}>
							{category?.name}
						</option>
					))}
				</select>
				
				{/* Search Button */}
				<Button onClick={handleSearch} variant="outline" size="sm">
					Search
				</Button>
				
				{/* Clear All Filters */}
				{(searchTerm || categoryFilter) && (
					<Button onClick={clearSearch} variant="ghost" size="sm">
						Clear All
					</Button>
				)}
			</div>
			
			<Button
				size="sm"
				variant="default"
				onClick={() => navigate('create-course')}
			>
				Create course
			</Button>
		</div>
	)
}

const Course = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {courses, loading, searchLoading} = useSelector((state) => state.course);
	
	useEffect(() => {
		dispatch(getCourses())
		dispatch(getCategories())
	}, [dispatch])
	
	// if (loading) return <Loader/>
	
	return (
		<>
			<Header title={"Courses"} buttons={<TopSideButtons/>}/>
			<div className="border rounded-xl bg-white my-4 shadow-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className={"border-r text-center"}>ID</TableHead>
							<TableHead className={"border-r text-center"}>Title</TableHead>
							<TableHead className={"border-r text-center"}>Status</TableHead>
							<TableHead className={"border-r text-center"}>Category (slug)</TableHead>
							<TableHead className={"border-r text-center"}>Teacher</TableHead>
							<TableHead className={"border-r text-center"}>Price ($)</TableHead>
							<TableHead className={"border-r text-center"}>Preview Image</TableHead>
							<TableHead className={"border-r text-center"}>Created At</TableHead>
							<TableHead className="w-[100px] text-center">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading || searchLoading ?
							<TableRow>
								<TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
									<Loader/>
								</TableCell>
							</TableRow> : (
								courses?.length === 0 ? (
									<TableRow>
										<TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
											No courses found.
										</TableCell>
									</TableRow>
								) : (
									courses?.map((course) => (
										<TableRow key={course?.id} className={"text-center"}>
											<TableCell className="font-medium border-r">{course?.id}</TableCell>
											<TableCell className="font-medium border-r">
												{course?.title}
											</TableCell>
											<TableCell className="font-medium border-r">
												{course.published ? (
													<Badge variant="success">Published</Badge>
												) : (
													<Badge variant="secondary">Draft</Badge>
												)}
											</TableCell>
											<TableCell className="font-medium border-r">
												{course?.category?.name} <Badge variant="success">{course?.category?.slug}</Badge>
											</TableCell>
											<TableCell className="font-medium border-r">
												{course?.teacher?.name}
											</TableCell>
											<TableCell className="font-medium border-r">
												{course?.price_cents}
											</TableCell>
											<TableCell className="font-medium border-r">
												<img src={instance.defaults.baseURL + course?.preview_image} alt="image"
												     className={'w-[100px] h-[40px] object-cover mx-auto'}/>
											</TableCell>
											<TableCell className="font-medium border-r">
												{moment(course?.created_at).format("DD-MM-YYYY")}
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
															onClick={() => navigate(`create-course/${course?.id}`)}
														>
															<Edit className="h-4 w-4 mr-2"/>
															Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => dispatch(togglePublishCourse({
																id: course.id,
																published: !course.published
															}))}
														>
															<ViewIcon className="h-4 w-4 mr-2"/>
															{course.published ? "Unpublish" : "Publish"}
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)
							)}
					</TableBody>
				</Table>
			</div>
		</>
	);
};

export default Course;