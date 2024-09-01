import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import Blockquote from '@tiptap/extension-blockquote';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faLink, faListOl, faListUl, faQuoteRight, faAlignLeft, faAlignCenter, faAlignRight, faParagraph, faHeading } from '@fortawesome/free-solid-svg-icons';

const BlogEditor: React.FC = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your blog post...',
      }),
      Bold,
      Italic,
      Underline,
      Paragraph,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link,
      BulletList,
      OrderedList,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Blockquote,
    ],
    content: '',
  });

  const actions = [
    { label: 'Bold', icon: faBold, action: () => editor?.chain().focus().toggleBold().run() },
    { label: 'Italic', icon: faItalic, action: () => editor?.chain().focus().toggleItalic().run() },
    { label: 'Underline', icon: faUnderline, action: () => editor?.chain().focus().toggleUnderline().run() },
    { label: 'Paragraph', icon: faParagraph, action: () => editor?.chain().focus().setParagraph().run() },
    { label: 'Heading 1', icon: faHeading, action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: 'Heading 2', icon: faHeading, action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Heading 3', icon: faHeading, action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: 'Link', icon: faLink, action: () => {
      const url = window.prompt('URL');
      if (url) {
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }
    }},
    { label: 'Ordered List', icon: faListOl, action: () => editor?.chain().focus().toggleOrderedList().run() },
    { label: 'Bullet List', icon: faListUl, action: () => editor?.chain().focus().toggleBulletList().run() },
    { label: 'Blockquote', icon: faQuoteRight, action: () => editor?.chain().focus().toggleBlockquote().run() },
    { label: 'Align Left', icon: faAlignLeft, action: () => editor?.chain().focus().setTextAlign('left').run() },
    { label: 'Align Center', icon: faAlignCenter, action: () => editor?.chain().focus().setTextAlign('center').run() },
    { label: 'Align Right', icon: faAlignRight, action: () => editor?.chain().focus().setTextAlign('right').run() },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        {actions.map(({ label, icon, action }) => (
          <button
            key={label}
            onClick={action}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center justify-center shadow-md"
            title={label}
          >
            <FontAwesomeIcon icon={icon} />
          </button>
        ))}
      </div>
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-lg">
        <EditorContent 
          editor={editor} 
          className="prose prose-lg max-w-none min-h-[300px] p-4 bg-gray-50 rounded-lg shadow-inner focus:outline-none focus:ring-0 focus:border-none" 
        />
      </div>
    </div>
  );
};

export default BlogEditor;
