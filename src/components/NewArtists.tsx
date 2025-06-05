import { SanityDocument } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../../sanity/env";

const builder = imageUrlBuilder({ projectId, dataset });

export default function NewArtists({ posts }: { posts: SanityDocument[] }): JSX.Element {
    // Get a post to feature for the new artists section (using the last post)
    const artistPost = posts && posts.length > 0 ? posts[posts.length - 1] : null;

    if (!artistPost) {
        return <div className="text-red-500">No posts found</div>;
    }

    // Resolve the main image URL
    let imageUrl = artistPost.mainImage?.asset?._ref || artistPost.mainImage?.asset?._id;
    if (imageUrl) {
        imageUrl = builder
            .image(artistPost.mainImage.asset)
            .width(300)
            .height(200)
            .fit("clip")
            .auto("format")
            .url();
    } else if (artistPost.featured_image) {
        imageUrl = artistPost.featured_image;
    } else {
        // Fallback image
        imageUrl = "/carousel-Images/pexels-elviss-railijs-bitāns-1389429.jpg";
    }

    return (
        <div className="mb-8">
            <Link href={artistPost.slug ?? "/"} className="block">
                <div className="relative h-[200px] mb-3">
                    <Image
                        className="w-full h-full object-cover"
                        width={300}
                        height={200}
                        src={imageUrl}
                        alt={artistPost.title || "New Artists"}
                    />
                </div>
                <h2 className="text-xl font-bold mb-2">10 New Artists You Need to Know</h2>
                <p className="text-sm text-gray-600">By Michael Brown</p>
                <p className="text-xs text-gray-500">8 hours ago</p>
            </Link>
        </div>
    );
} 