"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Heading2, Undo, Redo } from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "Write content…",
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    setHtml(editor?.getHTML() ?? defaultValue);
  }, [editor, defaultValue]);

  if (!editor) {
    return (
      <div className="rounded-lg border border-line bg-paper p-4 text-[11px] text-muted">
        Loading editor…
      </div>
    );
  }

  const btn = (active: boolean) =>
    cn(
      "inline-flex size-8 items-center justify-center rounded-md text-ink transition-colors hover:bg-paper",
      active && "bg-mint text-moss",
    );

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={html} />
      <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-line bg-paper px-2 py-1.5">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}>
          <Bold className="size-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))}>
          <Italic className="size-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))}>
          <Heading2 className="size-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}>
          <List className="size-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))}>
          <ListOrdered className="size-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn(false)}>
          <Undo className="size-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn(false)}>
          <Redo className="size-3.5" />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none rounded-b-lg border border-t-0 border-line bg-white px-4 py-3 min-h-[160px] focus-within:outline-none [&_.ProseMirror]:min-h-[140px] [&_.ProseMirror]:outline-none"
      />
    </div>
  );
}