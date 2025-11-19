import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getCourses, togglePublishCourse} from "@/features/course/courseSlice.js";
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
import {Edit, MoreHorizontal, ViewIcon} from "lucide-react";

const TopSideButtons = () => {
	const navigate = useNavigate()
	
	return (
		<Button
			size="sm"
			variant="default"
			onClick={() => navigate('create-course')}
		>
			Create course
		</Button>
	)
}

const Course = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {courses, loading} = useSelector((state) => state.course);
	
	useEffect(() => {
		dispatch(getCourses())
	}, [dispatch])
	
	if (loading) return <Loader/>
	
	return (
		<>
			<Header title={"Courses"} buttons={<TopSideButtons/>} />
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
						{courses?.length === 0 ? (
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
										<img src={instance.defaults.baseURL + course?.preview_image} alt="image" className={'w-[100px] h-[40px] object-cover mx-auto'}/>
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
													onClick={() => dispatch(togglePublishCourse({id: course.id, published: !course.published}))}
												>
													<ViewIcon className="h-4 w-4 mr-2"/>
													{course.published ? "Unpublish" : "Publish"}
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
			{/*<div className="my-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">*/}
			{/*	{courses?.map((course) => (*/}
			{/*		<Card key={course.id} className="shadow-md rounded-xl">*/}
			{/*			<CardHeader>*/}
			{/*				<CardTitle className="flex items-center justify-between">*/}
			{/*					{course.title}*/}
			{/*					{course.published ? (*/}
			{/*						<Badge variant="success">Published</Badge>*/}
			{/*					) : (*/}
			{/*						<Badge variant="secondary">Draft</Badge>*/}
			{/*					)}*/}
			{/*				</CardTitle>*/}
			{/*			</CardHeader>*/}
			{/*			*/}
			{/*			<CardContent className="space-y-3">*/}
			{/*				{course.preview_image && (*/}
			{/*					<img*/}
			{/*						src={instance.defaults.baseURL + course?.preview_image}*/}
			{/*						alt={course?.title}*/}
			{/*						className="w-full h-40 object-cover rounded-lg"*/}
			{/*					/>*/}
			{/*				)}*/}
			{/*				<p className="text-sm text-gray-600">{course.description}</p>*/}
			{/*				<p className="text-sm">*/}
			{/*					<strong>Teacher:</strong> {course.teacher.name} ({course.teacher.email})*/}
			{/*				</p>*/}
			{/*				<p className="text-sm">*/}
			{/*					<strong>Price:</strong> {course.price_cents} {course.currency}*/}
			{/*				</p>*/}
			{/*				<div className="flex gap-2 mt-3">*/}
			{/*					<Button*/}
			{/*						size="sm"*/}
			{/*						variant="outline"*/}
			{/*						onClick={() => navigate(`create-course/${course.id}`)}*/}
			{/*					>*/}
			{/*						Edit*/}
			{/*					</Button>*/}
			{/*					<Button*/}
			{/*						size="sm"*/}
			{/*						variant="default"*/}
			{/*						onClick={() =>*/}
			{/*							dispatch(togglePublishCourse({id: course.id, published: !course.published}))*/}
			{/*						}*/}
			{/*					>*/}
			{/*						{course.published ? "Unpublish" : "Publish"}*/}
			{/*					</Button>*/}
			{/*				</div>*/}
			{/*			</CardContent>*/}
			{/*		</Card>*/}
			{/*	))}*/}
			{/*</div>*/}
		</>
	);
};

export default Course;