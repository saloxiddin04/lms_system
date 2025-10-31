import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getCourses, togglePublishCourse} from "@/features/course/courseSlice.js";
import Loader from "@/components/Loader.jsx";
import Header from "@/components/Header.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import instance from "@/utils/axios.js";
import moment from "moment";
import {
	DropdownMenu,
	DropdownMenuContent, DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Edit, MoreHorizontal, ViewIcon} from "lucide-react";

const Lessons = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {courses, loading} = useSelector((state) => state.course);
	
	useEffect(() => {
		dispatch(getCourses())
	}, [dispatch])
	
	if (loading) return <Loader/>
	
	return (
		<>
			<Header title={"Lessons"} />
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
								<TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
													onClick={() => navigate(`create-lesson/${course?.id}`)}
												>
													<Edit className="h-4 w-4 mr-2"/>
													Edit Lesson
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
		</>
	);
};

export default Lessons;