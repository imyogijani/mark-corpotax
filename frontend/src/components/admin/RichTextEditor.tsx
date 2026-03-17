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
    
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    try {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-100 p-3 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
      {[
        { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold' },
        { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic' },
        { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline' },
        { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: 'strike' },
      ].map((item, i) => (
        <Button 
          key={i}
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={item.action} 
          className={`h-9 w-9 p-0 rounded-lg transition-all ${editor.isActive(item.active) ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          <item.icon className="h-4 w-4" />
        </Button>
      ))}

      <div className="w-px h-6 bg-gray-200 mx-2"></div>

      {[
        { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: 'heading', level: 2 },
        { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: 'heading', level: 3 },
      ].map((item, i) => (
        <Button 
          key={i}
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={item.action} 
          className={`h-9 w-9 p-0 rounded-lg transition-all ${editor.isActive(item.active, { level: item.level }) ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          <item.icon className="h-4 w-4" />
        </Button>
      ))}

      <div className="w-px h-6 bg-gray-200 mx-2"></div>

      {[
        { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList' },
        { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList' },
        { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote' },
      ].map((item, i) => (
        <Button 
          key={i}
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={item.action} 
          className={`h-9 w-9 p-0 rounded-lg transition-all ${editor.isActive(item.active) ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          <item.icon className="h-4 w-4" />
        </Button>
      ))}

      <div className="w-px h-6 bg-gray-200 mx-2"></div>

      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={setLink} 
        className={`h-9 w-9 p-0 rounded-lg transition-all ${editor.isActive('link') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-200'}`}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={addImage}
        className="h-9 w-9 p-0 rounded-lg text-gray-500 hover:bg-gray-200 transition-all font-sans"
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
          class: 'rounded-[2rem] max-w-full m-auto shadow-2xl border-8 border-white my-8',
        },
      }),
      Link.configure({ 
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary font-bold underline decoration-primary/30 underline-offset-4 cursor-pointer hover:text-primary/80 transition-colors',
        },
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[450px] p-10 bg-white rounded-b-[2rem] font-sans selection:bg-primary/10 selection:text-primary',
      },
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content && editor.getHTML() !== `<p>${content}</p>`) {
      if (editor.isEmpty) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  return (
    <div className="w-full flex flex-col group/editor transition-all">
      <MenuBar editor={editor} />
      <div className="flex-1 max-h-[800px] overflow-y-auto w-full scrollbar-hide">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
