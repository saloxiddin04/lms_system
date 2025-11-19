import {useState} from "react";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Link, useNavigate} from "react-router-dom";
import {fetchMe, login} from "@/auth/jwtService.js";
import toast from "react-hot-toast";

const Login = () => {
	const [form, setForm] = useState({email: "", password: ""});
	const navigate = useNavigate();
	
	const handleChange = (e) => {
		setForm({...form, [e.target.name]: e.target.value});
	};
	
	const handleSubmit = (e) => {
		e.preventDefault();
		login(form).then(() => {
			fetchMe().then()
			setTimeout(() => {
				navigate("/")
				toast.success("Successfully logged!")
			}, 200)
		}).catch((err) => {
			toast.error(err?.response?.data?.error)
		})
	};
	
	return (
		<div className="flex items-center justify-center h-screen bg-gray-50">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Login</CardTitle>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
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
						<Button type="submit" className="w-full my-4">Login</Button>
					</CardFooter>
					<h1 className="text-center text-gray-400">Don't have an account? <Link className="text-blue-500" to={"/register"}>Register</Link></h1>
					<h1 className="text-center text-gray-400">You have an account and not verified? <Link className="text-blue-500" to={"/verify"}>Verify</Link></h1>
				</form>
			</Card>
		</div>
	);
}

export default Login
