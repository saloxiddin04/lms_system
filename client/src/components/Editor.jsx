import React from 'react';
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css"

const Editor = ({value, onChange}) => {
	
	return (
		<div>
			<ReactQuill
				theme="snow"
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

export default Editor;