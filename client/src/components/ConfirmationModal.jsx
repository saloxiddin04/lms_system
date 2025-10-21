// components/confirmation-modal.jsx
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export function ConfirmationModal({
	                                  isOpen,
	                                  onClose,
	                                  onConfirm,
	                                  title = "Are you sure?",
	                                  description = "This action cannot be undone.",
	                                  confirmText = "Delete",
	                                  cancelText = "Cancel",
	                                  variant = "destructive", // "destructive" | "default"
	                                  icon: Icon = Trash2,
	                                  isLoading = false,
	                                  itemName, // O'chirilayotgan element nomi
                                  }) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className={`p-2 rounded-full ${
							variant === "destructive"
								? "bg-red-100 text-red-600"
								: "bg-blue-100 text-blue-600"
						}`}>
							<Icon className="h-5 w-5" />
						</div>
						<DialogTitle className="text-lg">{title}</DialogTitle>
					</div>
				</DialogHeader>
				
				{/* Description va itemName alohida */}
				<div className="space-y-3">
					<DialogDescription>
						{description}
					</DialogDescription>
					
					{itemName && (
						<div className="p-3 bg-gray-50 rounded-md border">
              <span className="font-medium text-gray-900 text-sm">
                {itemName}
              </span>
						</div>
					)}
				</div>
				
				<DialogFooter className="flex gap-2 sm:gap-0">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isLoading}
						className="flex-1"
					>
						{cancelText}
					</Button>
					<Button
						type="button"
						variant={variant}
						onClick={onConfirm}
						disabled={isLoading}
						className="flex-1"
					>
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								Deleting...
							</>
						) : (
							confirmText
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}