import {useState} from 'react';
import toast from "react-hot-toast";


const UseDeleteConfirmation = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	
	const openModal = (item) => {
		setItemToDelete(item);
		setIsModalOpen(true);
	};
	
	const closeModal = () => {
		setIsModalOpen(false);
		setItemToDelete(null);
		setIsDeleting(false);
	};
	
	const handleConfirm = async (onDelete) => {
		if (!itemToDelete) return;
		
		setIsDeleting(true);
		try {
			await onDelete(itemToDelete);
			toast.success("Successfully deleted")
			closeModal();
		} catch (error) {
			toast.error("Error")
			console.error("Delete failed:", error);
		} finally {
			setIsDeleting(false);
		}
	};
	
	return {
		isModalOpen,
		itemToDelete,
		isDeleting,
		openModal,
		closeModal,
		handleConfirm,
	};
};

export default UseDeleteConfirmation;