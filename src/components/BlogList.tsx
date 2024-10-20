import React, { useEffect, useState } from 'react';
import { getBlogs, createBlog } from '../api/Blog/BlogApi';
import { BlogItem } from '../types/BlogTypes';

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newBlog, setNewBlog] = useState({
    heading: '',
    subHeading: '',
    context: '',
    imgUrl: '',
  });

  useEffect(() => {
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

    fetchBlogs();
  }, []);

  const handleCreateBlog = async () => {
    try {
      await createBlog(newBlog);
      setShowModal(false);
      setNewBlog({ heading: '', subHeading: '', context: '', imgUrl: '' });
      const data = await getBlogs(1, 10);
      setBlogs(data.Items);
    } catch (error) {
      console.error('Error creating blog:', error);
      setError('Failed to create blog');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Danh sách bài đăng</h1>
      <button
        className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
        onClick={() => setShowModal(true)}
      >
        Tạo bài đăng mới
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div key={blog.Id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={blog.ImgUrl} alt={blog.Heading} className="w-full h-56 object-cover" />
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">{blog.Heading}</h2>
              <p className="text-gray-600 mb-4">{blog.SubHeading}</p>
              <p className="text-gray-800 mb-4">{blog.Context.substring(0, 100)}...</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>By {blog.AccountName}</span>
                <span>{new Date(blog.InsDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-lg transform transition-all duration-300 scale-95"
            onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click từ đóng modal khi nhấp vào bên trong
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Tạo bài đăng mới</h2>
            <input
              type="text"
              placeholder="Tiêu đề"
              value={newBlog.heading}
              onChange={(e) => setNewBlog({ ...newBlog, heading: e.target.value })}
              className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Mô tả"
              value={newBlog.subHeading}
              onChange={(e) => setNewBlog({ ...newBlog, subHeading: e.target.value })}
              className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Nội dung"
              value={newBlog.context}
              onChange={(e) => setNewBlog({ ...newBlog, context: e.target.value })}
              className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="URL Hình ảnh"
              value={newBlog.imgUrl}
              onChange={(e) => setNewBlog({ ...newBlog, imgUrl: e.target.value })}
              className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                onClick={handleCloseModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={handleCreateBlog}
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
