import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useRef } from 'react';
import { UploadAPI } from '/src/api';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string | undefined) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const { url } = await UploadAPI.uploadFile(file);
      const markdown = `\n![${file.name}](${url})\n`;
      onChange?.((value || '') + markdown);
    } catch (err) {
      alert('File upload failed.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFileUpload(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div data-color-mode="light" className="rounded-md overflow-hidden bg-white">
      {/* File Picker */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Toolbar Button */}
      <div className="p-2 bg-gray-100 flex justify-end">
        <button
          className="text-sm px-3 py-1 border rounded hover:bg-gray-200"
          onClick={triggerFileInput}
        >
          📷 Upload Image
        </button>
      </div>

      {/* Markdown Editor */}
      <MDEditor
        value={value}
        onChange={onChange}
        height={400}
        preview="edit"
        // ← This uses all default commands
      />
    </div>
  );
};

export default RichTextEditor;
