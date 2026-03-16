"use client";

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  List, ListOrdered, Quote, Heading1, Heading2, 
  Image as ImageIcon, Link as LinkIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', previousUrl);
    
    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    try {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2 bg-gray-50 rounded-t-xl sticky top-0 z-10">
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => editor.chain().focus().toggleBold().run()} 
        className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => editor.chain().focus().toggleUnderline().run()} 
        className={`h-8 w-8 p-0 ${editor.isActive('underline') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => editor.chain().focus().toggleStrike().run()} 
        className={`h-8 w-8 p-0 ${editor.isActive('strike') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
        className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => editor.chain().focus().toggleBlockquote().run()} 
        className={`h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={setLink} 
        className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={addImage}
        className="h-8 w-8 p-0 text-gray-600"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full m-auto shadow-md',
        },
      }),
      Link.configure({ 
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[350px] max-w-none p-4 pb-10 bg-white rounded-b-xl',
      },
    },
  });

  // Update content dynamically if the parsed external content changes (useful for edit mode initial load)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content && editor.getHTML() !== `<p>${content}</p>`) {
      if (editor.isEmpty) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-white flex flex-col">
      <MenuBar editor={editor} />
      <div className="flex-1 max-h-[600px] overflow-y-auto w-full">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
