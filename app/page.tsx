"use client";

import {Suspense, useState} from 'react'
import {ForwardRefEditor} from "@/components/md/ForwardRefEditor";

export default function Home() {
    const [md, setMd] = useState(`# Heading 1\n\n**Bold** _Italic_ \n\n- List item`)

    return (
        <>
            <p>This is a bare-bones unstyled MDX editor without any plugins and no toolbar. Check the EditorComponent.tsx file for the code.</p>
            <p>To enable more features, add the respective plugins to your instance - see <a className="text-blue-600" href="https://mdxeditor.dev/editor/docs/getting-started">the docs</a> for more details.</p>
            <br />
            <div style={{border: '1px solid black'}} className="prose">
                <Suspense fallback={null}>
                    <ForwardRefEditor
                        markdown={md}
                        onChange={setMd}
                    />
                </Suspense>
            </div>
        </>
    )
}