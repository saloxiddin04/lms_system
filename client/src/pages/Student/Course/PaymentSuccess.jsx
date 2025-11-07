import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useSearchParams, useNavigate} from "react-router-dom";
import {confirmPayment} from "@/features/enroll/enrollSlice.js";
import toast from "react-hot-toast";
import Confetti from "react-confetti";

const PaymentSuccess = () => {
	const [searchParams] = useSearchParams();
	const session_id = searchParams.get("session_id");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	
	const [showConfetti, setShowConfetti] = useState(false);
	
	useEffect(() => {
		if (session_id) {
			dispatch(confirmPayment({sessionId: session_id})).then(({payload}) => {
				if (payload?.ok) {
					setShowConfetti(true);
					toast.success("To‘lov muvaffaqiyatli tasdiqlandi! 🎉");
					setTimeout(() => {
						setShowConfetti(false)
						navigate(`/course/${payload?.courseId}`)
					}, 2000);
				} else {
					toast.error(payload?.error || "To‘lovni tasdiqlab bo‘lmadi");
				}
			});
		}
	}, [session_id, dispatch, navigate]);
	
	return (
		<div className="flex flex-col items-center justify-center h-screen text-center relative overflow-hidden">
			{showConfetti && (
				<Confetti
					width={window.innerWidth}
					height={window.innerHeight}
					recycle={true}
					numberOfPieces={300}
					gravity={0.5}
				/>
			)}
			<h1 className="text-2xl font-semibold mb-2">To‘lov amalga oshirildi ✅</h1>
			<p className="text-gray-600">Tabriklaymiz! Siz kursga muvaffaqiyatli yozildingiz.</p>
			<p className="mt-3 text-sm text-gray-500">Iltimos, kuting... tizim sizni kursga yo‘naltirmoqda.</p>
		</div>
	);
};

export default PaymentSuccess;
