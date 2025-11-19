import React, {useEffect, useRef} from 'react';
import mux from "mux-embed"

const VideoPlayer = ({url, className}) => {
	const videoRef = useRef(null)
	
	useEffect(() => {
		if (videoRef.current) {
			const initTime = Date.now()
			mux.monitor(videoRef.current, {
				debug: true,
				data: {
					env_key: "KEY",
					player_name: "Player",
					player_init_time: initTime
				}
			})
		}
	}, [videoRef])
	
	return (
		<video
			controls
			ref={videoRef}
			className={className ? `${className} w-full` : "w-full"}
		>
			<source src={url} type="video/mp4" className="w-full h-full"/>
			Your browser does not support the video tag.
		</video>
	);
};

export default VideoPlayer;