import { Sidebar } from '../Sidebar';
import { LinkMenu } from '../menus';
import { ContentItemMenu } from '../menus/ContentItemMenu';
import { TextMenu } from '../menus/TextMenu';
import { EditorHeader } from './components/EditorHeader';
import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu';
import { ColumnsMenu } from '@/extensions/MultiColumn/menus';
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus';
import { useBlockEditor } from '@/hooks/useBlockEditor';
import { useSidebar } from '@/hooks/useSidebar';
import '@/style/index.css';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import { EditorContent } from '@tiptap/react';
import { JSONContent } from '@tiptap/react';
import { createClient } from '@/utils/supabase/client'; // Supabase client import
import React, { useRef, useEffect } from 'react';
import * as Y from 'yjs';


const supabase = createClient();

export const BlockEditor = ({
  aiToken,
  ydoc,
  document,
  provider,
  docId
}: {
  aiToken?: string;
  hasCollab: boolean;
  ydoc: Y.Doc;
  document?: JSONContent;
  docId?: string;
  provider?: TiptapCollabProvider | null | undefined;
}) => {
  const menuContainerRef = useRef(null);
  const leftSidebar = useSidebar();
  const { editor, users, collabState } = useBlockEditor({
    aiToken,
    ydoc,
    document,
    provider,
  });

  useEffect(() => {
    // Load from localStorage if content exists (Optional, for backup or offline use)
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      editor?.commands.setContent(JSON.parse(savedContent)); // Set the editor content from localStorage
    }

    // Save editor content to Supabase when it changes
    const saveContentToDatabase = async () => {
      if (editor) {
        const content = editor.getJSON(); 

        // Save content to Supabase
        try {
          const { error } = await supabase
            .from('workspace_documents')
            .update({ content: content })
            .eq('id', docId)

          if (error) {
            throw error;
          }

          console.log('Document saved to database successfully');
        } catch (error) {
          console.error('Error saving document to database:', error);
        }
      }
    };

    // Listen for content changes
    editor?.on('update', saveContentToDatabase);

    // Cleanup: remove the listener when component unmounts
    return () => {
      editor?.off('update', saveContentToDatabase);
    };
  }, [editor, docId]);

  if (!editor || !users) {
    return null;
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <Sidebar
        isOpen={leftSidebar.isOpen}
        onClose={leftSidebar.close}
        editor={editor}
      />
      <div className="relative flex h-full flex-1 flex-col overflow-hidden">
        <EditorHeader
          editor={editor}
          collabState={collabState}
          users={users}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
        />
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu
          editor={editor}
          appendTo={menuContainerRef}
          children={undefined}
          trigger={undefined}
        />
        <TableRowMenu
          editor={editor}
          appendTo={menuContainerRef}
          children={undefined}
          trigger={undefined}
        />
        <TableColumnMenu
          editor={editor}
          appendTo={menuContainerRef}
          children={undefined}
          trigger={undefined}
        />
        <ImageBlockMenu
          editor={editor}
          appendTo={menuContainerRef}
          children={undefined}
          trigger={undefined}
        />
      </div>
    </div>
  );
};

export default BlockEditor;
