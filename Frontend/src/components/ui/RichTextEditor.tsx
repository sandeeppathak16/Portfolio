import { useRef } from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { UploadAPI } from '@/api';


interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const { url } = await UploadAPI.uploadFile(file);
      const markdown = `![${file.name}](${url})`;
      onChange?.((value || '') + `\n${markdown}\n`);
    } catch (err) {
      alert('File upload failed.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleEditorChange = (val?: string) => {
      onChange(val || '');
   };

  const customImageCommand = {
      name: 'image',
      keyCommand: 'image',
      buttonProps: { 'aria-label': 'Upload Image' },
      icon: (
        <svg viewBox="0 0 20 20" width="16" height="16">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v6.5l-3.75-3.75-5.5 5.5L4 11.5V5zm0 8l3 3h10v2H4a1 1 0 01-1-1v-4z" />
        </svg>
      ),
      execute: () => {
        fileInputRef.current?.click();
      },
    };

  return (
    <div data-color-mode="light" className="rounded-md overflow-hidden bg-white">
      {/* Hidden file input for image */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <MDEditor
        value={value}
        onChange={handleEditorChange}
        height={400}
        preview="edit"
        commands={[
          commands.bold,
          commands.italic,
          commands.hr,
          commands.title,
          commands.divider,
          commands.link,
          commands.quote,
          commands.code,
          commands.divider,
          customImageCommand,
          commands.divider,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand,
        ]}
      />
    </div>
  );
};

export default RichTextEditor;
