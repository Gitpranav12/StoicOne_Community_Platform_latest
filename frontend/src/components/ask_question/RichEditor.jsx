import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

export default function RichEditor({ initialContent = "", onUpdate }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: true,
        blockquote: true,
      }),
      Underline,
      Link.configure({
        autolink: true,
        openOnClick: true,
        protocols: ["http", "https", "mailto"],
      }),
      Placeholder.configure({
        placeholder: "Describe your problem in detail...",
      }),
    ],
    content: initialContent || "<p></p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onUpdate?.({ html, text });
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  if (!editor) return null;

  const Button = ({ active, onClick, children, title }) => (
    <button
      type="button"
      className={`btn btn-sm ${active ? "btn-secondary" : "btn-outline-secondary"}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="rich-editor border rounded">
      {/* Toolbar */}
      <div className="d-flex flex-wrap gap-2 align-items-center border-bottom p-2 bg-light">
        <Button
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </Button>
        <Button
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </Button>
        <Button
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </Button>
        <Button
          title="Code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {'</>'}
        </Button>
        <Button
          title="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {'{ }'}
        </Button>
        <Button
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          “”
        </Button>
        <Button
          title="Bulleted list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </Button>
        <Button
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </Button>

        <div className="vr mx-1" />

        <div className="btn-group btn-group-sm" role="group" aria-label="Heading">
          {[0, 1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              type="button"
              className={`btn ${editor.isActive("heading", { level: lvl }) ? "btn-secondary" : "btn-outline-secondary"}`}
              onClick={() => {
                if (lvl === 0) editor.chain().focus().setParagraph().run();
                else editor.chain().focus().toggleHeading({ level: lvl }).run();
              }}
              title={lvl === 0 ? "Paragraph" : `H${lvl}`}
            >
              {lvl === 0 ? "P" : `H${lvl}`}
            </button>
          ))}
        </div>

        <div className="ms-auto d-flex align-items-center gap-2">
          <Button title="Undo" onClick={() => editor.chain().focus().undo().run()}>↺</Button>
          <Button title="Redo" onClick={() => editor.chain().focus().redo().run()}>↻</Button>
        </div>
      </div>

      {/* Editor area */}
      <div className="p-2">
        <EditorContent editor={editor} className="tiptap form-control" />
      </div>

      {/* Live Preview */}
      <div className="border-top bg-body-tertiary p-3">
        <div className="d-flex justify-content-between">
          <h6 className="text-muted mb-2">Live preview</h6>
          <small className="text-muted">
            {editor.storage.characterCount
              ? editor.storage.characterCount.characters()
              : (editor.getText() || "").length}{" "}
            chars
          </small>
        </div>
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
        />
      </div>
    </div>
  );
}
