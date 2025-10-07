import React from 'react';

const Loader = () => {
	return (
		<div className="w-full flex justify-center items-center">
			<div className="animate-spin rounded-full h-44 w-44 text-black border-b-2 border-black mr-2"></div>
		</div>
	);
};

export default Loader;