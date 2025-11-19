import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import instance from "@/utils/axios.js";

const CourseFilters = ({
	                       onFiltersChange,
	                       initialFilters = {},
	                       className = ''
                       }) => {
	const [categories, setCategories] = useState([]);
	const [filters, setFilters] = useState({
		title: '',
		category_id: '',
		...initialFilters
	});
	const [isLoading, setIsLoading] = useState(false);
	
	// Load categories
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await instance.get('/categories');
				setCategories(response?.data);
			} catch (error) {
				console.error('Failed to fetch categories:', error);
			}
		};
		fetchCategories();
	}, []);
	
	// Handle filter changes
	const handleFilterChange = (key, value) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);
		onFiltersChange(newFilters);
	};
	
	// Clear all filters
	const clearFilters = () => {
		const clearedFilters = { title: '', category_id: '' };
		setFilters(clearedFilters);
		onFiltersChange(clearedFilters);
	};
	
	// Get selected category name
	const getSelectedCategoryName = () => {
		return categories.find(cat => cat.id === filters.category_id)?.name;
	};
	
	const hasActiveFilters = filters.title || filters.category_id;
	
	return (
		<div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<Filter className="h-5 w-5 text-slate-600" />
					<h3 className="text-lg font-semibold text-slate-900">Filter Kurslar</h3>
				</div>
				{hasActiveFilters && (
					<Button
						variant="outline"
						size="sm"
						onClick={clearFilters}
						className="h-8 px-3"
					>
						<X className="h-3 w-3 mr-1" />
						Tozalash
					</Button>
				)}
			</div>
			
			{/* Active Filters Badges */}
			{hasActiveFilters && (
				<div className="flex flex-wrap gap-2 mb-4">
					{filters.title && (
						<Badge variant="secondary" className="px-3 py-1">
							Qidiruv: "{filters.title}"
						</Badge>
					)}
					{filters.category_id && (
						<Badge variant="secondary" className="px-3 py-1">
							Kategoriya: {getSelectedCategoryName()}
						</Badge>
					)}
				</div>
			)}
			
			{/* Filter Controls */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{/* Title Search */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700">
						Kurs nomi bo'yicha qidirish
					</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
						<Input
							type="text"
							placeholder="Kurs nomini yozing..."
							value={filters.title}
							onChange={(e) => handleFilterChange('title', e.target.value)}
							className="pl-10 pr-4"
						/>
					</div>
				</div>
				
				{/* Category Filter */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700">
						Kategoriya bo'yicha filter
					</label>
					<Select
						value={filters.category_id}
						onValueChange={(value) => handleFilterChange('category_id', value)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Barcha kategoriyalar" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">Barcha kategoriyalar</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category.id} value={category.id.toString()}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				
				{/* Results Count & Clear */}
				<div className="flex items-end">
					<div className="text-sm text-slate-600">
						{hasActiveFilters && 'Filtrlar qo\'llanmoqda'}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseFilters;