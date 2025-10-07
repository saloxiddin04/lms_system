import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {verify} from "@/auth/jwtService.js";
import toast from "react-hot-toast";

const VerifyEmail = () => {
	const [code, setCode] = useState("");
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const email = searchParams.get("email");
	
	const handleSubmit = (e) => {
		e.preventDefault();
		verify({email, code}).then(() => {
			toast.success("Successfully verified then login")
			navigate("/login")
		}).catch((err) => {
			toast.error(err?.response?.data?.error)
		})
	};
	
	return (
		<div className="flex items-center justify-center h-screen bg-gray-50">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Email Verification</CardTitle>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<p className="text-sm text-gray-600">
							We sent a verification code to <b>{email}</b>. Enter it below:
						</p>
						<Input
							placeholder="Enter verification code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							required
						/>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full my-4">Verify</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

export default VerifyEmail
