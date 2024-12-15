import React, { useEffect, useState } from 'react';
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../../../api/Blog/BlogApi';
import { BlogItem } from '../../../types/BlogTypes';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import ClipLoader from 'react-spinners/ClipLoader';
import ReactQuill from 'react-quill';

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentBlog, setCurrentBlog] = useState<BlogItem | null>(null);
  const [newBlog, setNewBlog] = useState({
    heading: '',
    subHeading: '',
    context: '',
    imgUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [blogDetail, setBlogDetail] = useState<BlogItem | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs(1, 10);
      setBlogs(data.Items);
    } catch (err) {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async () => {
    if (!imageFile) {
      setError('Please select an image file');
      return;
    }
    try {
      await createBlog(newBlog, imageFile);
      closeModal();
      fetchBlogs();
    } catch (error) {
      console.error('Error creating blog:', error);
      setError('Failed to create blog');
    }
  };

  const handleUpdateBlog = async () => {
    if (!currentBlog || !imageFile) return;
    try {
      await updateBlog({
        id: currentBlog.Id,
        heading: newBlog.heading || '',
        subHeading: newBlog.subHeading || '',
        context: newBlog.context || '',
        imgUrl: newBlog.imgUrl || '',
      }, imageFile);
      closeModal();
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      setError('Failed to update blog');
    }
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;
    try {
      await deleteBlog(blogToDelete.Id);
      closeDeleteModal();
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Failed to delete blog');
    }
  };

  const handleEditClick = (blog: BlogItem) => {
    setCurrentBlog(blog);
    setNewBlog({
      heading: blog.Heading || '',
      subHeading: blog.SubHeading || '',
      context: blog.Context || '',
      imgUrl: blog.ImgUrl || '',
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = (blog: BlogItem) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDetailClick = (blog: BlogItem) => {
    setBlogDetail(blog);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentBlog(null);
    setIsEditing(false);
    setNewBlog({ heading: '', subHeading: '', context: '', imgUrl: '' });
    setImageFile(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setBlogDetail(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={'#5BABAC'} loading={true} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Danh sách bài đăng
      </h1>
      <button
        className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
        onClick={() => {
          setIsEditing(false);
          setShowModal(true);
        }}
      >
        Tạo bài đăng mới
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.Id}
            className="relative bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={blog.ImgUrl || ''}
              alt={blog.Heading || 'Blog Image'}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">{blog.Heading || 'No Title'}</h2>
              <p className="text-gray-600 mb-4">{blog.SubHeading || 'No Subheading'}</p>
              <div
                className="text-gray-800 mb-4"
                dangerouslySetInnerHTML={{ __html: (blog.Context || '').substring(0, 100) + '...' }}
              />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>By {blog.AccountName}</span>
                <span>{new Date(blog.InsDate).toLocaleDateString()}</span>
              </div>
              <button
                className="mt-2 text-blue-500 hover:underline"
                onClick={() => handleDetailClick(blog)}
              >
                Xem chi tiết
              </button>
            </div>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                className="p-1 bg-white rounded-full shadow hover:bg-gray-100 transition duration-300"
                onClick={() => handleEditClick(blog)}
              >
                <PencilSquareIcon className="h-5 w-5 text-gray-600" />
              </button>
              <button
                className="p-1 bg-white rounded-full shadow hover:bg-gray-100 transition duration-300"
                onClick={() => handleDeleteClick(blog)}
              >
                <TrashIcon className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDetailModal && blogDetail && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeDetailModal}
        >
          <div
            className="relative bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl transform transition-all duration-300 scale-95 overflow-y-auto max-h-screen mt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              onClick={closeDetailModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              {blogDetail.Heading || 'No Title'}
            </h2>
            <p className="text-gray-600 mb-4">{blogDetail.SubHeading || 'No Subheading'}</p>
            <div
              className="text-gray-800 mb-4"
              dangerouslySetInnerHTML={{ __html: blogDetail.Context || '' }}
            />
            <img
              src={blogDetail.ImgUrl || ''}
              alt={blogDetail.Heading || 'Blog Image'}
              className="w-full h-56 object-cover mb-4"
            />
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>By {blogDetail.AccountName}</span>
              <span>{new Date(blogDetail.InsDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl transform transition-all duration-300 scale-95 overflow-y-auto max-h-screen mt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              {isEditing ? 'Chỉnh sửa bài đăng' : 'Tạo bài đăng mới'}
            </h2>
            <input
              type="text"
              placeholder="Tiêu đề"
              value={newBlog.heading}
              onChange={(e) =>
                setNewBlog({ ...newBlog, heading: e.target.value })
              }
              className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Mô tả"
              value={newBlog.subHeading}
              onChange={(e) =>
                setNewBlog({ ...newBlog, subHeading: e.target.value })
              }
              className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ReactQuill
              value={newBlog.context}
              onChange={(value: string) =>
                setNewBlog({ ...newBlog, context: value })
              }
              className="w-full mb-3"
              placeholder="Nội dung"
              style={{ maxHeight: '300px', overflow: 'auto' }}
            />
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                onClick={closeModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={isEditing ? handleUpdateBlog : handleCreateBlog}
              >
                {isEditing ? 'Cập nhật' : 'Tạo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeDeleteModal}
        >
          <div
            className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-center">Xác nhận xóa</h2>
            <p className="text-center mb-6">
              Bạn có chắc chắn muốn xóa bài viết này không?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                onClick={handleDeleteBlog}
              >
                Có
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                onClick={closeDeleteModal}
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
