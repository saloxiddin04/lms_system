import React, {useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import TitleForm from "@/pages/Admin/Course/_components/title-form.jsx";
import {IconBadge} from "@/components/IconBadge.jsx";
import {LayoutDashboard, ListChecks, CircleDollarSign} from "lucide-react";
import {getCourseById} from "@/features/course/courseSlice.js";
import Loader from "@/components/Loader.jsx";
import DescriptionForm from "@/pages/Admin/Course/_components/description-form.jsx";
import ImageForm from "@/pages/Admin/Course/_components/image-form.jsx";
import CategoryForm from "@/pages/Admin/Course/_components/category-form.jsx";
import {getCategories} from "@/features/category/categorySlice.js";
import PriceForm from "@/pages/Admin/Course/_components/price-form.jsx";

const CreateCourseDetail = () => {
	const dispatch = useDispatch()
	
	const {id} = useParams()
	
	const {course, loading} = useSelector((state) => state.course)
	const {categories} = useSelector((state) => state.category)
	
	useEffect(() => {
		dispatch(getCategories())
		dispatch(getCourseById({id}))
	}, [id, dispatch])
	
	const requiredFields = [
		course?.title,
		course?.description,
		course?.preview_image,
		course?.price_cents,
		course?.category?.id
	]
	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	
	const completionText = `(${completedFields}/${totalFields})`
	
	if (loading) return <Loader />
	
	return (
		<div>
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-y-2">
					<h1 className="text-2xl font-medium">
						Course setup
					</h1>
					<span className="text-sm text-slate-700">
						Complete all fields {completionText}
					</span>
				</div>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
				<div>
					<div className="flex items-center gap-x-2">
						<IconBadge icon={LayoutDashboard}/>
						<h2 className="text-xl">Customize your course</h2>
					</div>
					<TitleForm
						initialData={course}
						courseId={course?.id}
					/>
					<DescriptionForm
						initialData={course}
						courseId={course?.id}
					/>
					<ImageForm
						initialData={course}
						courseId={course?.id}
					/>
					<CategoryForm
						initialData={course}
						courseId={course?.id}
						options={categories?.map((option) => ({
							label: option?.name,
							value: option?.id
						}))}
					/>
				</div>
				
				<div className="space-y-6">
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={ListChecks}/>
							<h2 className="text-xl">Course lessons</h2>
						</div>
						<div>
							lessons
						</div>
					</div>
					
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={CircleDollarSign}/>
							<h2 className="text-xl">Cell your course</h2>
						</div>
						<PriceForm
							initialData={course}
							courseId={course?.id}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateCourseDetail;