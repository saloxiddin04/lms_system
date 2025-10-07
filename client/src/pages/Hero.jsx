import React from 'react';
import {Button} from "@/components/ui/button.jsx";
import Navbar from "@/components/Navbar.jsx";

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
	
	// const user = getUserData()
	
	return (
		<div>
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				
				{/* Hero Section */}
				<section className="py-40 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
					<h1 className="text-4xl font-bold mb-4">O‘rganing. Amaliyot qiling. Natijaga erishing.</h1>
					<p className="text-lg mb-6">Eng yaxshi kurslar bir joyda. Hozir boshlang!</p>
					<Button size="lg" variant="secondary">Kurslarni Ko‘rish</Button>
				</section>
				
				{/* Courses List */}
				<section className="px-6 py-16 max-w-6xl mx-auto">
					<h2 className="text-2xl font-bold mb-8 text-gray-800">Mavjud kurslar</h2>
					
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{dummyCourses.map((course) => (
							<div
								key={course.id}
								className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
							>
								<img src={course.image} alt={course.title} className="w-full h-48 object-cover"/>
								<div className="p-4">
									<h3 className="text-lg font-semibold">{course.title}</h3>
									<p className="text-sm text-gray-600 line-clamp-2 mb-2">{course.description}</p>
									<p className="text-xs text-gray-400 mb-3">O‘qituvchi: {course.teacher}</p>
									<div className="flex justify-between items-center">
										<Button size="sm">Batafsil</Button>
										{course.is_preview && (
											<span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      Bepul intro
                    </span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default Hero;