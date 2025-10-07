import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SearchXIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Error404() {
	const navigate = useNavigate()
	
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<Card className="max-w-md w-full text-center p-6 shadow-lg">
				<CardContent className="flex flex-col items-center gap-4">
					<SearchXIcon className="w-16 h-16 text-blue-500" />
					<h1 className="text-4xl font-bold text-gray-800">404</h1>
					<p className="text-gray-600">Something went error.</p>
					<Button onClick={() => navigate("/")} className="mt-4">
						Back to home
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
