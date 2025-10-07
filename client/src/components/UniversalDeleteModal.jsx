import { ConfirmationModal } from "./ConfirmationModal.jsx";
import UseDeleteConfirmation from "@/utils/useDeleteConfirmation.js"

export function UniversalDeleteModal({ onDelete, entityType = "item" }) {
	const {
		isModalOpen,
		itemToDelete,
		isDeleting,
		openModal,
		closeModal,
		handleConfirm,
	} = UseDeleteConfirmation();
	
	const getModalConfig = () => {
		const configs = {
			course: {
				title: "Delete Course",
				description: "Are you sure you want to delete this course? This will also delete all chapters and lessons associated with it.",
			},
			chapter: {
				title: "Delete Chapter",
				description: "Are you sure you want to delete this chapter? This will also delete all lessons in this chapter.",
			},
			lesson: {
				title: "Delete Lesson",
				description: "Are you sure you want to delete this lesson?",
			},
			category: {
				title: "Delete Category",
				description: "Are you sure you want to delete this category?",
			},
		};
		
		return configs[entityType] || configs.item;
	};
	
	const config = getModalConfig();
	
	const ModalComponent = (
		<ConfirmationModal
			isOpen={isModalOpen}
			onClose={closeModal}
			onConfirm={() => handleConfirm(onDelete)}
			title={config.title}
			description={config.description}
			itemName={itemToDelete?.title || itemToDelete?.name}
			isLoading={isDeleting}
		/>
	);
	
	return {
		openModal,
		ModalComponent,
		isDeleting,
	};
}