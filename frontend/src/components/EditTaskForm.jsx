import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../context/themeContext';

const EditTaskForm = ({ task, employees, onClose, onTaskUpdated }) => {
  const [editForm, setEditForm] = useState({
    taskId: '',
    title: '',
    description: '',
    due: '',
    status: '',
    assigned: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const { theme } = useTheme();
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    if (task) {
      setEditForm({
        taskId: task.taskId || '',
        title: task.title || '',
        description: task.description || '',
        due: task.due ? task.due.split('T')[0] : '',
        status: task.status || 'Pending',
        assigned: task.assigned || ''
      });
      fetchAttachments(task.taskId);
    }
  }, [task]);

  const fetchAttachments = async (taskId) => {
    setLoadingAttachments(true);
    try {
      // For admin, use the admin endpoint
      const response = await axios.get(
        `${API_URL}/attachment/${taskId}/attachments`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setAttachments(response.data.attachments || []);
      }
    } catch (error) {
      console.error('Error fetching attachments:', error);
      // Try alternative endpoint if first fails
      try {
        const altResponse = await axios.get(
          `${API_URL}/task/${taskId}/attachments`,
          { withCredentials: true }
        );
        if (altResponse.data.success) {
          setAttachments(altResponse.data.attachments || []);
        }
      } catch (altError) {
        console.error('Alternative endpoint also failed:', altError);
      }
    } finally {
      setLoadingAttachments(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Check total files won't exceed limit (5 per task)
    const activeAttachments = attachments.filter(
      attachment => !filesToDelete.includes(attachment.public_id || attachment.id)
    );
    const totalFiles = activeAttachments.length + newFiles.length + files.length;
    if (totalFiles > 5) {
      toast.error(`Maximum 5 attachments allowed. You have ${activeAttachments.length} existing attachments.`);
      return;
    }

    // Check file size (10MB each)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`File "${oversizedFiles[0].name}" exceeds 10MB limit.`);
      return;
    }

    // Check file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/jpg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];

    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.error(`File "${invalidFiles[0].name}" has an invalid type. Only images, PDFs, and Office documents are allowed.`);
      return;
    }

    setNewFiles(prev => [...prev, ...files]);
    e.target.value = ''; // Clear file input
  };

  const removeExistingFile = (fileId) => {
    setFilesToDelete(prev => [...prev, fileId]);
  };

  const removeNewFile = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType, mimetype) => {
    if (fileType === 'image') return '🖼️';
    if (fileType === 'pdf') return '📄';
    if (fileType === 'document') return '📝';
    if (fileType === 'spreadsheet') return '📊';
    if (fileType === 'presentation') return '📈';
    if (fileType === 'text') return '📃';
    if (mimetype && mimetype.includes('image')) return '🖼️';
    if (mimetype && mimetype.includes('pdf')) return '📄';
    return '📎';
  };

  const getFileTypeFromMime = (mimetype) => {
    if (!mimetype) return 'other';
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype === 'application/pdf') return 'pdf';
    if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'spreadsheet';
    if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return 'presentation';
    if (mimetype.startsWith('text/')) return 'text';
    return 'other';
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSave = async () => {
    if (!editForm.taskId || !editForm.title || !editForm.assigned || !editForm.due) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Delete files that need to be removed
      if (filesToDelete.length > 0) {
        const deletePromises = filesToDelete.map(async (fileId) => {
          try {
            // The backend expects the full public_id including folder path
            // Don't split it, use it as is
            await axios.delete(
              `${API_URL}/attachment/${editForm.taskId}/attachments/${fileId}`,
              { withCredentials: true }
            );
          } catch (error) {
            console.error(`Failed to delete file ${fileId}:`, error);
            // Continue with other operations even if one deletion fails
          }
        });
        await Promise.allSettled(deletePromises);
      }

      // Step 2: Upload new files
      if (newFiles.length > 0) {
        setUploadingFiles(true);
        const formData = new FormData();
        newFiles.forEach(file => {
          formData.append('files', file);
        });

        try {
          // Use the task endpoint for adding attachments
          await axios.post(
            `${API_URL}/task/${editForm.taskId}/add-attachments`,
            formData,
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        } catch (uploadError) {
          console.error('Error uploading files via task endpoint:', uploadError);
          toast.error('Task updated but files failed to upload. Please try adding files separately.');
        } finally {
          setUploadingFiles(false);
        }
      }

      // Step 3: Update task details
      const response = await axios.put(
        `${API_URL}/task/edittask/${editForm.taskId}`,
        editForm,
        { withCredentials: true }
      );
      
      toast.success('Task updated successfully!');
      if (onTaskUpdated) {
        // Fetch updated attachments
        try {
          const attachmentsResponse = await axios.get(
            `${API_URL}/attachment/${editForm.taskId}/attachments`,
            { withCredentials: true }
          );
          const taskWithAttachments = {
            ...response.data.task,
            attachments: attachmentsResponse.data.attachments || [],
            hasAttachments: (attachmentsResponse.data.attachments || []).length > 0,
            attachmentCount: (attachmentsResponse.data.attachments || []).length
          };
          onTaskUpdated(taskWithAttachments);
        } catch (fetchError) {
          console.error('Error fetching updated attachments:', fetchError);
          onTaskUpdated(response.data.task);
        }
      }
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewFile = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const modalStyles = theme === 'dark' 
    ? 'bg-neutral-900/90 border-neutral-800' 
    : 'bg-white border-neutral-300';
  
  const textColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800';
  const inputStyles = theme === 'dark'
    ? 'bg-neutral-800 border-neutral-700 text-neutral-300 placeholder-neutral-500'
    : 'bg-white border-neutral-300 text-neutral-800 placeholder-neutral-500';
  
  const labelStyles = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  const cardStyles = theme === 'dark' 
    ? 'bg-neutral-800/50 border-neutral-700' 
    : 'bg-neutral-100 border-neutral-300';
  
  const saveButtonStyles = theme === 'dark'
    ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
    : 'bg-emerald-500 hover:bg-emerald-600 text-white';
  
  const cancelButtonStyles = theme === 'dark'
    ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300'
    : 'bg-neutral-300 hover:bg-neutral-400 text-neutral-700';

  const fileItemStyles = theme === 'dark'
    ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700'
    : 'bg-white hover:bg-neutral-100 border-neutral-300';

  const activeAttachments = attachments.filter(
    attachment => !filesToDelete.includes(attachment.public_id || attachment.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`backdrop-blur-sm rounded-xl border p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto ${modalStyles}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${accentColor}`}>Edit Task</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-neutral-800 ${theme === 'dark' ? 'text-neutral-400 hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Task ID *
              </label>
              <input
                type="text"
                name="taskId"
                value={editForm.taskId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
                required
                readOnly
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Assigned To *
              </label>
              <select
                name="assigned"
                value={editForm.assigned}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee._id || employee.id} value={employee.name}>
                    {employee.name} {employee.role ? `(${employee.role})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Status
              </label>
              <select
                name="status"
                value={editForm.status}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Due Date *
              </label>
              <input
                type="date"
                name="due"
                value={editForm.due}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Description
              </label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
              />
            </div>
          </div>

          {/* Attachments Section */}
          <div className={`rounded-lg border p-4 ${cardStyles}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <h3 className={`font-medium ${textColor}`}>Attachments</h3>
              <span className={`text-xs ${labelStyles}`}>
                {activeAttachments.length + newFiles.length} of 5 files
              </span>
            </div>

            {/* Existing Attachments */}
            {loadingAttachments ? (
              <div className="flex justify-center py-4">
                <div className={`animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
              </div>
            ) : (
              <>
                {activeAttachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className={`text-sm font-medium mb-2 ${labelStyles}`}>Current Attachments</h4>
                    <div className="space-y-2">
                      {activeAttachments.map((file) => {
                        const fileId = file.public_id || file.id;
                        const fileName = file.filename || 'Unnamed file';
                        const fileSize = file.size || 0;
                        const fileType = file.fileType || getFileTypeFromMime(file.mimetype);
                        const fileMime = file.mimetype || '';
                        
                        return (
                          <div 
                            key={fileId} 
                            className={`flex flex-col xs:flex-row xs:items-center justify-between p-3 rounded-lg border ${fileItemStyles} transition-colors gap-3`}
                          >
                            <div className="flex items-start xs:items-center space-x-3 flex-1 min-w-0">
                              <span className="text-lg flex-shrink-0 mt-0.5 xs:mt-0">
                                {getFileIcon(fileType, fileMime)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${textColor}`}>
                                  {fileName}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-1">
                                  <span>{formatFileSize(fileSize)}</span>
                                  <span>•</span>
                                  <span className="capitalize">{fileType}</span>
                                  {file.uploadedAt && (
                                    <>
                                      <span>•</span>
                                      <span className="hidden xs:inline">Added {new Date(file.uploadedAt).toLocaleDateString()}</span>
                                      <span className="xs:hidden">{new Date(file.uploadedAt).toLocaleDateString()}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-start xs:justify-end flex-shrink-0">
                              <button
                                onClick={() => handleViewFile(file.url)}
                                className={`px-2 py-1 text-xs rounded ${
                                  theme === 'dark' 
                                    ? 'bg-blue-900/30 hover:bg-blue-800 text-blue-300' 
                                    : 'bg-blue-200 hover:bg-blue-300 text-blue-700'
                                }`}
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDownload(file.url, fileName)}
                                className={`px-2 py-1 text-xs rounded ${
                                  theme === 'dark' 
                                    ? 'bg-emerald-900/30 hover:bg-emerald-800 text-emerald-300' 
                                    : 'bg-emerald-200 hover:bg-emerald-300 text-emerald-700'
                                }`}
                              >
                                Download
                              </button>
                              {/* <button
                                onClick={() => removeExistingFile(fileId)}
                                className={`px-2 py-1 text-xs rounded ${
                                  theme === 'dark' 
                                    ? 'bg-red-900/30 hover:bg-red-800 text-red-300' 
                                    : 'bg-red-200 hover:bg-red-300 text-red-700'
                                }`}
                              >
                                Remove
                              </button> */}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* New Files to Upload */}
                {newFiles.length > 0 && (
                  <div className="mb-4">
                    <h4 className={`text-sm font-medium mb-2 ${labelStyles}`}>New Files to Upload</h4>
                    <div className="space-y-2">
                      {newFiles.map((file, index) => (
                        <div 
                          key={index} 
                          className={`flex flex-col xs:flex-row xs:items-center justify-between p-3 rounded-lg border ${
                            theme === 'dark' 
                              ? 'bg-emerald-900/20 border-emerald-800' 
                              : 'bg-emerald-100 border-emerald-300'
                          } gap-3`}
                        >
                          <div className="flex items-start xs:items-center space-x-3 flex-1 min-w-0">
                            <span className="text-lg flex-shrink-0 mt-0.5 xs:mt-0">
                              {getFileIcon(getFileTypeFromMime(file.type), file.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${textColor}`}>
                                {file.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-1">
                                <span>{formatFileSize(file.size)}</span>
                                <span>•</span>
                                <span className="capitalize">{getFileTypeFromMime(file.type)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-start xs:justify-end flex-shrink-0">
                            <button
                              onClick={() => removeNewFile(index)}
                              className={`px-2 py-1 text-xs rounded ${
                                theme === 'dark' 
                                  ? 'bg-red-900/30 hover:bg-red-800 text-red-300' 
                                  : 'bg-red-200 hover:bg-red-300 text-red-700'
                              }`}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Files Button */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${labelStyles}`}>
                    Add More Files
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center ${theme === 'dark' ? 'border-neutral-700 hover:border-neutral-600' : 'border-neutral-300 hover:border-neutral-400'} transition-colors`}>
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer block"
                    >
                      <svg 
                        className={`mx-auto h-8 w-8 sm:h-10 sm:w-10 mb-2 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        Click to browse or drag and drop
                      </p>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        Images, PDFs, Office documents up to 10MB each
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        Maximum 5 files total
                      </p>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-neutral-700">
            <button
              onClick={onClose}
              disabled={loading || uploadingFiles}
              className={`px-4 py-2 rounded-lg font-medium ${cancelButtonStyles} flex-1`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || uploadingFiles}
              className={`px-4 py-2 rounded-lg font-medium ${saveButtonStyles} flex-1 flex items-center justify-center`}
            >
              {(loading || uploadingFiles) ? (
                <>
                  <div className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-white'} mr-2`}></div>
                  {uploadingFiles ? 'Uploading Files...' : 'Saving...'}
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskForm;