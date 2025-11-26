import React from "react";
import type { SanityDocument } from "next-sanity";
import Suggestions from "./Suggestions";
import ShareButtons from "./ShareButtons";
import SubscribeForm from "./SubscribeForm";

interface SidebarProps {
    posts: SanityDocument[];
}

export default function Sidebar({ posts }: SidebarProps) {
    return (
        <aside className="w-full sticky top-2">
            <Suggestions posts={posts} />
        </aside>
    );
}
