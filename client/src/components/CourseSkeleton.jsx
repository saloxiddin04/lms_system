import React from 'react';
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.jsx";

const CourseSkeleton = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				
				{/* Courses Grid Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<Card key={i} className="border-slate-200 overflow-hidden">
							<Skeleton className="h-48 w-full"/>
							<CardHeader className="pb-3">
								<Skeleton className="h-4 w-20 mb-2"/>
								<Skeleton className="h-6 w-full mb-2"/>
								<Skeleton className="h-4 w-full"/>
							</CardHeader>
							<CardContent className="pb-4">
								<Skeleton className="h-4 w-24 mb-4"/>
								<div className="space-y-2">
									<div className="flex justify-between">
										<Skeleton className="h-3 w-16"/>
										<Skeleton className="h-3 w-12"/>
									</div>
									<Skeleton className="h-2 w-full"/>
								</div>
							</CardContent>
							<CardFooter>
								<Skeleton className="h-10 w-full"/>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default CourseSkeleton;