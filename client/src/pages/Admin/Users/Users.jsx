import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Loader from "@/components/Loader.jsx";
import {getUsers} from "@/features/admin/adminSlice.js";
import Header from "@/components/Header.jsx";
import {TableBody, TableHead, TableHeader, TableRow, Table, TableCell} from "@/components/ui/table.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import moment from "moment";
import {
	DropdownMenu,
	DropdownMenuContent, DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Button} from "@/components/ui/button.jsx";
import {CheckIcon, Edit, MoreHorizontal, Trash2, XIcon} from "lucide-react";
import {useNavigate} from "react-router-dom";

const Users = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {loading, users} = useSelector((state) => state.admin)
	
	useEffect(() => {
		dispatch(getUsers())
	}, [dispatch])
	
	if (loading) return <Loader />
	
	return (
		<>
			<Header title={"Users"} buttons={""}/>
			<div className="border rounded-xl bg-white my-4 shadow-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className={"border-r text-center"}>ID</TableHead>
							<TableHead className={"border-r text-center"}>Name</TableHead>
							<TableHead className={"border-r text-center"}>Email</TableHead>
							<TableHead className={"border-r text-center"}>Role</TableHead>
							<TableHead className={"border-r text-center"}>Created at</TableHead>
							<TableHead className={"border-r text-center"}>Is Verified</TableHead>
							<TableHead className="w-[100px] text-center">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users?.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
									No users found.
								</TableCell>
							</TableRow>
						) : (
							users?.map((el, index) => (
								<TableRow key={el?.id} className={"text-center"}>
									<TableCell className="font-medium border-r">{index + 1}</TableCell>
									<TableCell className="font-medium border-r">
										{el?.name}
									</TableCell>
									<TableCell className={"font-medium border-r"}>
										<Badge variant="secondary" className="font-mono">
											{el?.email}
										</Badge>
									</TableCell>
									<TableCell className={"font-medium border-r"}>
										{el?.role}
									</TableCell>
									<TableCell className="font-medium border-r">
										{moment(el?.created_at).format("DD-MM-YYYY")}
									</TableCell>
									<TableCell className="font-medium border-r">
										{el?.verify ? <CheckIcon className="m-auto"/> : <XIcon className="m-auto"/>}
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
													onClick={() => navigate(`${el?.id}`)}
												>
													<Edit className="h-4 w-4 mr-2"/>
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													// onClick={() => openModal(category)}
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
			</div>
		</>
	);
};

export default Users;