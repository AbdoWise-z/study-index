'use client'

import type { ForwardedRef } from 'react'
import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    linkPlugin,
    linkDialogPlugin,
    InsertImage,
    imagePlugin,
    InsertTable,
    tablePlugin,
    InsertFrontmatter,
    frontmatterPlugin,
    StrikeThroughSupSubToggles,
} from '@mdxeditor/editor'

import '@mdxeditor/editor/style.css'

export default function InitializedMDXEditor(
    {
        editorRef,
        ...props
    }: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
    return (
        <MDXEditor
            onChange={(md) => console.log(md)}
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),

                toolbarPlugin({
                    toolbarClassName: 'my-classname',
                    toolbarContents: () => (
                        <>
                            <UndoRedo />
                            <div data-orientation="vertical" aria-orientation="vertical" role="separator"/>
                            <BoldItalicUnderlineToggles />
                            <div data-orientation="vertical" aria-orientation="vertical" role="separator"/>
                            <InsertImage />
                            <InsertTable />
                            <div data-orientation="vertical" aria-orientation="vertical" role="separator"/>
                            <InsertFrontmatter />
                            <div data-orientation="vertical" aria-orientation="vertical" role="separator"/>
                            <StrikeThroughSupSubToggles />
                        </>
                    ),

                }),

                linkPlugin(),
                linkDialogPlugin({}),

                imagePlugin({
                    imageUploadHandler: () => {
                        return Promise.resolve("");
                    }
                }),

                tablePlugin(),

                frontmatterPlugin(),
            ]}
            {...props}
            ref={editorRef}

        />
    )
}