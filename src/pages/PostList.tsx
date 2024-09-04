import React from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  image: string;
  author: string;
  timeAgo: string;
  authorImage: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: 'Đổ Bê Tông Sàn Lầu 2 Tại Công Trình RHCQS Thủ Đức',
    content:
      'Vào trưa 23/08, đội ngũ thi công của RHCQS Thủ Đức đã hoàn tất việc đổ bê tông sàn lầu 2 tại công trình CĐT Trần Quốc Nghiệp ở Phường Linh Trung, Tp.Thủ Đức. Quá trình được thực hiện với sự chuẩn bị kỹ lưỡng và giám sát chặt chẽ, đảm bảo chất lượng bê tông đúng tiêu chuẩn, công tác thi công sàn được kiểm soát nghiêm ngặt....',
    date: '2023-10-01',
    image:
      'https://thietthach.vn/userfiles/thumbs/1724481444avatar-24-08-01.jpg',
    author: 'Addison james fos',
    timeAgo: '20 mins ago',
    authorImage: 'https://via.placeholder.com/50',
  },
  {
    id: 2,
    title: 'Tập Huấn An Toàn Lao Động Tại Công Trình - RHCQS Quận 10',
    content:
      'Sáng  08/08, tại công trình của CĐT Phạm Thị Tuyết đã diễn ra buổi tập huấn An Toàn Lao Động dành cho Đội thi công do P.An Toàn Lao Động RHCQS Group tổ chức. Tại buổi tập huấn, các Kỹ sư Giám sát, Đội trưởng Đội thi công,..',
    date: '2023-10-01',
    image:
      'https://thietthach.vn/userfiles/thumbs/1724149862avatar-20-08-2024-03.jpg',
    author: 'Addison james fos',
    timeAgo: '20 mins ago',
    authorImage: 'https://via.placeholder.com/50',
  },
  {
    id: 3,
    title: 'Nghiệm Thu 80% Xây Tô tại Công Trình RHCQS Tân Phú',
    content:
      'Phòng Thi Công của RHCQS Group tiếp tục thực hiện nghiệm thu 80% xây tô tại công trình của CĐT Nguyễn Thị Kim Chi thuộc RHCQS Tân Phú. ..',
    date: '2024-09-01',
    image:
      'https://thietthach.vn/userfiles/thumbs/1724480810avatar-24-08-03.jpg',
    author: 'Addison james fos',
    timeAgo: '20 mins ago',
    authorImage: 'https://via.placeholder.com/50',
  },
  {
    id: 4,
    title: 'Nghiệm Thu 80% Xây Tô tại Công Trình RHCQS Quận 8',
    content:
      'Vừa qua, Phòng Thi Công RHCQS Group đã tiến hành nghiệm thu 80% xây tô tại công trình CĐT Bùi Thị Trúc Linh của RHCQS Quận 8. Đây là một trong các hoạt động kiểm soát chéo của hệ thống đối với các công trình do chi nhánh thực hiện để đảm bảo chất lượng và độ chính xác của công trình....',
    date: '2024-09-02',
    image: 'https://thietthach.vn/userfiles/thumbs/172416141701.jpg',
    author: 'Addison james fos',
    timeAgo: '20 mins ago',
    authorImage: 'https://via.placeholder.com/50',
  },
  // Thêm các bài đăng khác ở đây
];

const PostList: React.FC = () => {
  const groupedPosts = posts.reduce(
    (acc, post) => {
      const date = post.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(post);
      return acc;
    },
    {} as Record<string, Post[]>,
  );

  // Sắp xếp các ngày theo thứ tự giảm dần
  const sortedDates = Object.keys(groupedPosts).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">All Blog Posts</h1>
      <div className="w-full max-w-4xl relative">
        {sortedDates.map((date) => (
          <div key={date} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">{date}</h2>
            <div className="space-y-2">
              {groupedPosts[date].map((post, index) => (
                <div
                  key={post.id}
                  className={`flex ${
                    index % 2 === 0 ? 'flex-row-reverse' : ''
                  } items-start mb-2 mx-4`}
                >
                  <div className="w-1/2 flex justify-center relative"></div>
                  <div className="bg-white p-4 rounded-lg shadow w-1/2">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold">{post.title}</h3>
                      <span className="text-gray-500 text-sm whitespace-nowrap">
                        {post.timeAgo}
                      </span>
                    </div>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <p className="text-gray-700">
                      {post.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center mt-4">
                      <img
                        src={post.authorImage}
                        alt={post.author}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-gray-500 text-sm">
                        {post.author}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
