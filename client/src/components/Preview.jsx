import React from 'react';
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.bubble.css"

const Preview = ({value}) => {
	
	return (
		<div>
			<ReactQuill
				theme="bubble"
				value={value}
				readOnly
			/>
		</div>
	);
};

export default Preview;