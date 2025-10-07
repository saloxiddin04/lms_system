import React, {useState} from 'react';
import {Input} from "@/components/ui/input.jsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.jsx";
import {useDispatch} from "react-redux";
import {register} from "@/auth/jwtService.js";
import toast from "react-hot-toast";

const Register = () => {
	const dispatch = useDispatch()
	
	const [form, setForm] = useState({name: "", email: "", password: ""});
	const navigate = useNavigate();
	
	const handleChange = (e) => {
		setForm({...form, [e.target.name]: e.target.value});
	};
	
	const handleSubmit = (e) => {
		e.preventDefault()
		register(form).then(() => {
			toast.success("Successfully registered and verify your email!")
			setTimeout(() => {
				navigate("/verify-email?email=" + form.email);
			}, 200)
		}).catch((err) => {
			toast.error(err?.response?.data?.error)
		})
	}
	
	return (
		<div className="flex items-center justify-center h-screen bg-gray-50">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Create Account</CardTitle>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<Input
							placeholder="Name"
							name="name"
							value={form.name}
							onChange={handleChange}
							required
						/>
						<Input
							placeholder="Email"
							type="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							required
						/>
						<Input
							placeholder="Password"
							type="password"
							name="password"
							value={form.password}
							onChange={handleChange}
							required
						/>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full my-4">Register</Button>
					</CardFooter>
					<h1 className="text-center text-gray-400">
						You have already account? <Link className="text-blue-500" to={"/login"}>Login</Link>
					</h1>
				</form>
			</Card>
		</div>
	);
};

export default Register;