import React, {useEffect, useRef} from 'react';
import mux from "mux-embed"

const VideoPlayer = ({url}) => {
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
			src={url}
			className="w-full"
		/>
	);
};

export default VideoPlayer;