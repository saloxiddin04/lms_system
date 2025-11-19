import React, { useState, useEffect } from 'react';

const NotesApp = () => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState('');
	const [editingIndex, setEditingIndex] = useState(null);
	const [editText, setEditText] = useState('');
	
	// Load notes from localStorage on component mount
	useEffect(() => {
		const savedNotes = localStorage.getItem('react-notes');
		if (savedNotes) {
			setNotes(JSON.parse(savedNotes));
		}
	}, []);
	
	// Save notes to localStorage whenever notes change
	useEffect(() => {
		localStorage.setItem('react-notes', JSON.stringify(notes));
	}, [notes]);
	
	// Add a new note
	const addNote = () => {
		if (newNote.trim() !== '') {
			setNotes([...notes, { text: newNote, checked: false }]);
			setNewNote('');
		}
	};
	
	// Delete a note
	const deleteNote = (index) => {
		const updatedNotes = [...notes];
		updatedNotes.splice(index, 1);
		setNotes(updatedNotes);
	};
	
	// Toggle checkbox
	const toggleCheck = (index) => {
		const updatedNotes = [...notes];
		updatedNotes[index].checked = !updatedNotes[index].checked;
		setNotes(updatedNotes);
	};
	
	// Start editing a note
	const startEditing = (index) => {
		setEditingIndex(index);
		setEditText(notes[index].text);
	};
	
	// Save edited note
	const saveEdit = () => {
		if (editText.trim() !== '') {
			const updatedNotes = [...notes];
			updatedNotes[editingIndex].text = editText;
			setNotes(updatedNotes);
			setEditingIndex(null);
			setEditText('');
		}
	};
	
	// Cancel editing
	const cancelEdit = () => {
		setEditingIndex(null);
		setEditText('');
	};
	
	// Handle Enter key press in textarea
	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			addNote();
		}
	};
	
	return (
		<div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<div className="text-center mb-10">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">Eslatmalar</h1>
					<p className="text-gray-600">React va Tailwind CSS bilan yaratilgan eslatmalar ilovasi</p>
				</div>
				
				{/* Add Note Section */}
				<div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
					<div className="flex flex-col space-y-4">
            <textarea
	            value={newNote}
	            onChange={(e) => setNewNote(e.target.value)}
	            onKeyPress={handleKeyPress}
	            placeholder="Yangi eslatma yozing..."
	            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
	            rows="3"
            />
						<div className="flex justify-end">
							<button
								onClick={addNote}
								className="px-5 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
							>
								Eslatma qo'shish
							</button>
						</div>
					</div>
				</div>
				
				{/* Notes List */}
				<div className="space-y-4">
					{notes.length === 0 ? (
						<div className="text-center py-10">
							<div className="text-gray-400 mb-3">
								<svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"></path>
								</svg>
							</div>
							<p className="text-gray-500">Hozircha eslatmalar mavjud emas</p>
						</div>
					) : (
						notes.map((note, index) => (
							<div
								key={index}
								className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md"
							>
								{editingIndex === index ? (
									// Edit Mode
									<div className="space-y-4">
                    <textarea
	                    value={editText}
	                    onChange={(e) => setEditText(e.target.value)}
	                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
	                    rows="3"
	                    autoFocus
                    />
										<div className="flex justify-end space-x-2">
											<button
												onClick={cancelEdit}
												className="px-4 py-2 text-gray-600 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
											>
												Bekor qilish
											</button>
											<button
												onClick={saveEdit}
												className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
											>
												Saqlash
											</button>
										</div>
									</div>
								) : (
									// View Mode
									<div className="flex items-start space-x-3">
										<div className="flex items-center h-5 mt-0.5">
											<input
												type="checkbox"
												checked={note.checked}
												onChange={() => toggleCheck(index)}
												className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
											/>
										</div>
										<div className="flex-1">
											<p
												className={`text-gray-800 ${
													note.checked ? 'line-through text-gray-500' : ''
												}`}
											>
												{note.text}
											</p>
											<div className="flex justify-end mt-3 space-x-2">
												<button
													onClick={() => startEditing(index)}
													className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
												>
													Tahrirlash
												</button>
												<button
													onClick={() => deleteNote(index)}
													className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
												>
													O'chirish
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						))
					)}
				</div>
				
				{/* Footer Info */}
				<div className="mt-10 pt-6 border-t border-gray-200 text-center">
					<p className="text-gray-500 text-sm">
						Eslatmalar brauzeringizda saqlanadi. Ularga keyinroq kirishingiz mumkin.
					</p>
				</div>
			</div>
		</div>
	);
};

export default NotesApp;