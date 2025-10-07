import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";

const Header = ({title, buttons}) => {
	return (
		<Card className={"shadow-md rounded-xl"}>
			<CardHeader className={"w-full flex items-center justify-between"}>
				<CardTitle>
					<h1>{title}</h1>
				</CardTitle>
				<CardContent>
					{buttons && <>{buttons}</>}
				</CardContent>
			</CardHeader>
		</Card>
	);
};

export default Header;