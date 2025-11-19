import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {reSendVerify, verify} from "@/auth/jwtService.js";
import toast from "react-hot-toast";

const Verify = () => {
	const [email, setEmail] = useState("");
	const navigate = useNavigate();
	
	const handleSubmit = (e) => {
		e.preventDefault();
		reSendVerify({email}).then(() => {
			toast.success("Successfully send code check your email")
			setTimeout(() => {
				navigate("/verify-email?email=" + email);
			}, 200)
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
							Enter your email
						</p>
						<Input
							type={"mail"}
							placeholder="Enter email"
							value={email || ""}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full my-4">Send verification code</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

export default Verify
