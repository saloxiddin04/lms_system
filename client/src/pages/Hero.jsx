import React, {useEffect} from 'react';
import {Button} from "@/components/ui/button.jsx";
import Navbar from "@/components/Navbar.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getCourses} from "@/features/course/courseSlice.js";
import instance from "@/utils/axios.js";
import {Link} from "react-router-dom";

const dummyCourses = [
	{
		id: 1,
		title: "JavaScript Asoslari",
		description: "Frontend dasturlash uchun asosiy JavaScript kursi.",
		image: "https://placehold.co/600x400/js",
		teacher: "Aliyev Jasur",
		is_preview: true,
	},
	{
		id: 2,
		title: "Python Data Science",
		description: "Data Science uchun Python va Pandas kutubxonalari.",
		image: "https://placehold.co/600x400/python",
		teacher: "Karimova Nodira",
		is_preview: false,
	},
	{
		id: 3,
		title: "React va Redux",
		description: "Amaliy loyihalar bilan ReactJS kursi.",
		image: "https://placehold.co/600x400/react",
		teacher: "Rustamov Bekzod",
		is_preview: true,
	},
]

const Hero = () => {
	const dispatch = useDispatch()
	
	const {courses, loading} = useSelector(state => state.course)
	
	useEffect(() => {
		dispatch(getCourses())
	}, [dispatch])
	
	return (
		<div>
			<div className="min-h-screen bg-gray-50">
				<Navbar/>
				
				{/* Hero Section */}
				<section className="py-40 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
					<div className="container mx-auto">
						<h1 className="text-4xl font-bold mb-4">O‘rganing. Amaliyot qiling. Natijaga erishing.</h1>
						<p className="text-lg mb-6">Eng yaxshi kurslar bir joyda. Hozir boshlang!</p>
						<Button size="lg" variant="secondary">Kurslarni Ko‘rish</Button>
					</div>
				</section>
				
				{/* Courses List */}
				<section className="py-16">
					<div className="container mx-auto">
						<h2 className="text-2xl font-bold mb-8 text-gray-800">Mavjud kurslar</h2>
						
						<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{courses?.map((course) => (
								<Link
									to={`/course/${course?.id}`}
									key={course?.id}
									className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
								>
									<div className="p-4">
										<img
											src={instance.defaults.baseURL + course?.preview_image}
											alt={course?.title}
											className="w-full h-48 object-contain rounded-lg border"
										/>
										<h3 className="text-lg font-semibold">{course?.title}</h3>
										<p className="text-sm text-gray-600 line-clamp-2 mb-2">{course?.description}</p>
										<p className="text-xs text-gray-400 mb-3">Category: {course?.category?.name}</p>
										<p className="text-xs text-gray-400 mb-3">Teacher: {course?.teacher?.name}</p>
										<div className="flex justify-between items-center">
											<Button size="sm">{course?.price_cents} $</Button>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Hero;