import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LockIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Error403() {
	const navigate = useNavigate()
	
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<Card className="max-w-md w-full text-center p-6 shadow-lg">
				<CardContent className="flex flex-col items-center gap-4">
					<LockIcon className="w-16 h-16 text-red-500" />
					<h1 className="text-4xl font-bold text-gray-800">403</h1>
					<p className="text-gray-600">Your have not permission for this page</p>
					<Button onClick={() => navigate("/")} className="mt-4">
						Back to home
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
