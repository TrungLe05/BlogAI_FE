// src/components/dashboard/RichEditor.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import ImageExt from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExt from "@tiptap/extension-link";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link2,
  Image,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Minus,
  AlignJustify,
} from "lucide-react";
import type { Editor } from "@tiptap/react";

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
}

// ── Toolbar buttons config ────────────────────────────────────────
function useToolbarButtons(
  editor: Editor,
  onImageClick: () => void,
  onLinkClick: () => void,
) {
  return [
    {
      group: "format",
      items: [
        {
          icon: <Bold size={14} />,
          title: "Bold",
          onClick: () => editor.chain().focus().toggleBold().run(),
          active: editor.isActive("bold"),
        },
        {
          icon: <Italic size={14} />,
          title: "Italic",
          onClick: () => editor.chain().focus().toggleItalic().run(),
          active: editor.isActive("italic"),
        },
        {
          icon: <Underline size={14} />,
          title: "Underline",
          onClick: () => editor.chain().focus().toggleUnderline().run(),
          active: editor.isActive("underline"),
        },
      ],
    },
    {
      group: "heading",
      items: [
        {
          icon: <Heading1 size={14} />,
          title: "H1",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          active: editor.isActive("heading", { level: 1 }),
        },
        {
          icon: <Heading2 size={14} />,
          title: "H2",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          active: editor.isActive("heading", { level: 2 }),
        },
        {
          icon: <Heading3 size={14} />,
          title: "H3",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          active: editor.isActive("heading", { level: 3 }),
        },
      ],
    },
    {
      group: "list",
      items: [
        {
          icon: <List size={14} />,
          title: "Bullet list",
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          active: editor.isActive("bulletList"),
        },
        {
          icon: <ListOrdered size={14} />,
          title: "Numbered list",
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          active: editor.isActive("orderedList"),
        },
        {
          icon: <Quote size={14} />,
          title: "Blockquote",
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          active: editor.isActive("blockquote"),
        },
      ],
    },
    {
      group: "align",
      items: [
        {
          icon: <AlignLeft size={14} />,
          title: "Align left",
          onClick: () => editor.chain().focus().setTextAlign("left").run(),
          active: editor.isActive({ textAlign: "left" }),
        },
        {
          icon: <AlignCenter size={14} />,
          title: "Align center",
          onClick: () => editor.chain().focus().setTextAlign("center").run(),
          active: editor.isActive({ textAlign: "center" }),
        },
        {
          icon: <AlignRight size={14} />,
          title: "Align right",
          onClick: () => editor.chain().focus().setTextAlign("right").run(),
          active: editor.isActive({ textAlign: "right" }),
        },
        {
          icon: <AlignJustify size={14} />,
          title: "Align justify",
          onClick: () => editor.chain().focus().setTextAlign("justify").run(),
          active: editor.isActive({ textAlign: "justify" }),
        },
      ],
    },
    {
      group: "insert",
      items: [
        {
          icon: <Link2 size={14} />,
          title: "Link",
          onClick: onLinkClick,
          active: editor.isActive("link"),
        },
        {
          icon: <Image size={14} />,
          title: "Image",
          onClick: onImageClick,
          active: false,
        },
        {
          icon: <Minus size={14} />,
          title: "Divider",
          onClick: () => editor.chain().focus().setHorizontalRule().run(),
          active: false,
        },
      ],
    },
    {
      group: "history",
      items: [
        {
          icon: <Undo size={14} />,
          title: "Undo",
          onClick: () => editor.chain().focus().undo().run(),
          active: false,
        },
        {
          icon: <Redo size={14} />,
          title: "Redo",
          onClick: () => editor.chain().focus().redo().run(),
          active: false,
        },
      ],
    },
  ];
}

// ── Toolbar Button ────────────────────────────────────────────────
function ToolbarBtn({
  onClick,
  active = false,
  title,
  children,
  vertical = false,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  vertical?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      style={{
        padding: vertical ? "8px 10px" : "6px 8px",
        background: active ? "#0d0d0d" : "transparent",
        color: active ? "white" : "#444",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: vertical ? "1px solid #e5e5e5" : "none",
        borderRight: vertical ? "none" : "1px solid #e5e5e5",
        transition: "background 0.1s, color 0.1s",
        width: vertical ? "40px" : "auto",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "#f0f0f0";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}

// ── Separator ────────────────────────────────────────────────────
function Separator({ vertical }: { vertical: boolean }) {
  return (
    <div
      style={{
        width: vertical ? "60%" : "1px",
        height: vertical ? "1px" : "28px",
        background: "#ddd",
        margin: vertical ? "4px auto" : "0 4px",
        flexShrink: 0,
      }}
    />
  );
}

export function RichEditor({ content, onChange }: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(false);
  const [floatingTop, setFloatingTop] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExt,
      ImageExt.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your story..." }),
      LinkExt.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync content khi load blog để edit
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  // ── Detect scroll để chuyển toolbar sang floating dọc ────────
  useEffect(() => {
    const scrollContainer = document.querySelector(".overflow-auto"); // container scroll của WriteView
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (!toolbarRef.current || !editorWrapperRef.current) return;

      const toolbarRect = toolbarRef.current.getBoundingClientRect();
      const wrapperRect = editorWrapperRef.current.getBoundingClientRect();

      // Toolbar bị scroll ra khỏi viewport → hiện floating
      const shouldFloat = toolbarRect.bottom < 0;
      setIsFloating(shouldFloat);

      if (shouldFloat) {
        // Tính top của floating toolbar relative với viewport
        const top = Math.max(80, wrapperRect.top + 16);
        setFloatingTop(top);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  if (!editor) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result as string })
          .run();
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const setLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const groups = useToolbarButtons(
    editor,
    () => fileInputRef.current?.click(),
    setLink,
  );

  return (
    <div
      ref={editorWrapperRef}
      className="relative border-[3px] border-[#0d0d0d] bg-white dark:shadow-[4px_4px_0_#52525b] dark:border-zinc-600"
      // style={{ border: "3px solid #0d0d0d", background: "white" }}
    >
      {/* ── Toolbar ngang gốc (luôn render để giữ layout) ── */}
      <div
        ref={toolbarRef}
        className="flex flex-wrap items-center h-full"
        style={{
          borderBottom: "3px solid #0d0d0d",
          background: "#fafafa",
          visibility: isFloating ? "hidden" : "visible", // ẩn nhưng vẫn giữ chỗ
        }}
      >
        {groups.map((group, gi) => (
          <div key={group.group} className="flex items-center">
            {group.items.map((btn) => (
              <ToolbarBtn
                key={btn.title}
                onClick={btn.onClick}
                active={btn.active}
                title={btn.title}
              >
                {btn.icon}
              </ToolbarBtn>
            ))}
            {gi < groups.length - 1 && <Separator vertical={false} />}
          </div>
        ))}
      </div>

      {/* ── Floating toolbar dọc (hiện khi scroll) ── */}
      {isFloating && (
        <div
          style={{
            position: "fixed",
            top: floatingTop + 20,
            left: editorWrapperRef.current
              ? editorWrapperRef.current.getBoundingClientRect().left - 44
              : 0,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "white",
            border: "3px solid #0d0d0d",
            boxShadow: "4px 2px 0 #d32f2f",
            padding: "4px 0",
            width: "40px",
          }}
        >
          {groups.map((group, gi) => (
            <div
              key={group.group}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {group.items.map((btn) => (
                <ToolbarBtn
                  key={btn.title}
                  onClick={btn.onClick}
                  active={btn.active}
                  title={btn.title}
                  vertical
                >
                  {btn.icon}
                </ToolbarBtn>
              ))}
              {gi < groups.length - 1 && <Separator vertical />}
            </div>
          ))}
        </div>
      )}

      {/* Editor content */}
      <EditorContent
        editor={editor}
        style={{
          minHeight: "420px",
          padding: "20px",
          fontSize: "1rem",
          lineHeight: 1.8,
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
