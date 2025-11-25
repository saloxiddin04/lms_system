import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button.jsx";
import Navbar from "@/components/Navbar.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getCourses, searchCourse} from "@/features/course/courseSlice.js";
import instance from "@/utils/axios.js";
import {Link, useNavigate} from "react-router-dom";
import CourseSkeleton from "@/components/CourseSkeleton.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {BookOpen, Grid3X3, List, Search, X} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";
import {Input} from "@/components/ui/input.jsx";
import {getCategories} from "@/features/category/categorySlice.js";

const Hero = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {courses, loading, searchLoading} = useSelector(state => state.course)
	
	const {categories} = useSelector(state => state.category)
	
	const [viewMode, setViewMode] = useState('grid');
	const [searchTerm, setSearchTerm] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('');
	
	useEffect(() => {
		dispatch(getCourses())
		dispatch(getCategories())
	}, [dispatch])
	
	const handleSearch = () => {
		if (searchTerm.trim() || categoryFilter) {
			dispatch(searchCourse({ q: searchTerm, category: categoryFilter }));
		} else {
			dispatch(getCourses());
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
	
	// Grid View Card
	const GridCourseCard = ({ course }) => (
		<Link
			to={`/course/${course?.id}`}
			key={course?.id}
			className="block h-full"
		>
			<Card className="group hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden h-full flex flex-col">
				<div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
					{course?.preview_image ? (
						<img
							src={instance.defaults.baseURL + course?.preview_image}
							alt={course?.title}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
							<BookOpen className="h-12 w-12 text-blue-500 opacity-50" />
						</div>
					)}
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
					
					{/* Price Badge */}
					<div className="absolute top-3 right-3">
						<Badge variant="default" className="bg-white/95 backdrop-blur-sm text-slate-900 border-slate-200 font-semibold shadow-sm">
							${parseFloat(course?.price_cents || 0).toFixed(2)}
						</Badge>
					</div>
					
					{/* Category Badge */}
					{course?.category && (
						<div className="absolute bottom-3 left-3">
							<Badge variant="outline" className="bg-black/70 text-white border-0 backdrop-blur-sm text-xs">
								{course?.category?.name}
							</Badge>
						</div>
					)}
				</div>
				
				<CardHeader className="pb-3 flex-1">
					<CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
						{course?.title}
					</CardTitle>
					
					<CardDescription className="line-clamp-3 text-slate-600 text-sm leading-relaxed flex-1">
						{course?.description}
					</CardDescription>
				</CardHeader>
				
				<CardContent className="mt-auto">
					<div className="flex items-center justify-between text-sm text-slate-600">
						<div className="flex items-center gap-1">
							<div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 border border-blue-200">
								<span className="text-xs font-medium text-blue-600">
									{course?.teacher?.name?.charAt(0)}
								</span>
							</div>
							<span className="font-medium truncate">{course?.teacher?.name}</span>
						</div>
						<Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900">
							View Details
						</Button>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
	
	// List View Card
	const ListCourseCard = ({ course }) => (
		<Link
			to={`/course/${course?.id}`}
			key={course?.id}
			className="block mb-4 last:mb-0"
		>
			<Card className="group hover:shadow-md transition-all duration-300 border-slate-200 overflow-hidden">
				<div className="flex flex-col md:flex-row">
					{/* Course Image */}
					<div className="relative md:w-64 h-48 md:h-auto flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200">
						{course?.preview_image ? (
							<img
								src={instance.defaults.baseURL + course?.preview_image}
								alt={course?.title}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
								<BookOpen className="h-12 w-12 text-blue-500 opacity-50" />
							</div>
						)}
						<div className="absolute top-3 right-3">
							<Badge variant="default" className="bg-white/95 backdrop-blur-sm text-slate-900 border-slate-200 font-semibold shadow-sm">
								${parseFloat(course?.price_cents || 0).toFixed(2)}
							</Badge>
						</div>
					</div>
					
					{/* Content */}
					<div className="flex-1 p-6">
						<div className="flex flex-col h-full">
							{/* Category */}
							{course?.category && (
								<Badge variant="outline" className="w-fit text-xs mb-3">
									{course?.category?.name}
								</Badge>
							)}
							
							{/* Title */}
							<CardTitle className="text-xl leading-tight group-hover:text-blue-600 transition-colors mb-3">
								{course?.title}
							</CardTitle>
							
							{/* Description */}
							<CardDescription className="text-slate-600 leading-relaxed mb-4 flex-1">
								{course?.description}
							</CardDescription>
							
							{/* Teacher and Action */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-sm text-slate-600">
									<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
										<span className="text-sm font-medium text-blue-600">
											{course?.teacher?.name?.charAt(0)}
										</span>
									</div>
									<span className="font-medium">{course?.teacher?.name}</span>
								</div>
								<Button variant="outline" size="sm">
									View Course
								</Button>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</Link>
	);
	
	return (
		<div>
			<div className="min-h-screen bg-gray-50">
				{/* Hero Section */}
				<section className="py-40 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
					<div className="container mx-auto">
						<h1 className="text-4xl font-bold mb-4">O'rganing. Amaliyot qiling. Natijaga erishing.</h1>
						<p className="text-lg mb-6">Eng yaxshi kurslar bir joyda. Hozir boshlang!</p>
						<Button size="lg" variant="secondary" onClick={() => navigate("/courses")}>Kurslarni Ko'rish</Button>
					</div>
				</section>
				
				{/* Courses List */}
				<section className="py-16">
					<div className="container mx-auto">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
							<div>
								<h1 className="text-3xl font-bold text-slate-900 mb-2">All Courses</h1>
								<p className="text-slate-600">Discover and learn from our comprehensive course collection</p>
							</div>
							
							{/* View Mode Toggle */}
							<div className="flex items-center gap-4">
								{/* Search Input */}
								<div className="flex items-center gap-2">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
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
												onClick={clearSearch}
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
									
									<Button onClick={handleSearch} disabled={searchLoading}>
										{searchLoading ? "Searching..." : "Search"}
									</Button>
								</div>
								
								{/* View Mode Toggle */}
								<div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
									<Button
										variant={viewMode === 'grid' ? 'default' : 'ghost'}
										size="sm"
										onClick={() => setViewMode('grid')}
										className={`px-3 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
									>
										<Grid3X3 className="h-4 w-4 text-slate-600" />
									</Button>
									<Button
										variant={viewMode === 'list' ? 'default' : 'ghost'}
										size="sm"
										onClick={() => setViewMode('list')}
										className={`px-3 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
									>
										<List className="h-4 w-4 text-slate-600" />
									</Button>
								</div>
							</div>
						</div>
						
						{/* Loading State */}
						{searchLoading && (
							<div className="text-center py-8">
								<CourseSkeleton />
							</div>
						)}
						
						{loading && (
							<div className="text-center py-8">
								<CourseSkeleton />
							</div>
						)}
						
						{/* Courses Grid/List */}
						{!searchLoading && (viewMode === 'grid' ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{courses?.map((course) => (
									<GridCourseCard key={course?.id} course={course} />
								))}
							</div>
						) : (
							<div className="space-y-4">
								{courses?.map((course) => (
									<ListCourseCard key={course?.id} course={course} />
								))}
							</div>
						))}
						
						{/* Empty State */}
						{!loading && !searchLoading && courses?.length === 0 && (
							<div className="text-center py-12">
								<BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-slate-900 mb-2">No courses found</h3>
								<p className="text-slate-600 mb-4">
									{searchTerm || categoryFilter
										? "Try adjusting your search criteria"
										: "Check back later for new courses"
									}
								</p>
								{(searchTerm || categoryFilter) && (
									<Button onClick={clearSearch} variant="outline">
										Clear Search
									</Button>
								)}
							</div>
						)}
					</div>
				</section>
			</div>
		</div>
	);
};

export default Hero;