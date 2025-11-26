import type { SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../../sanity/env";

const builder = imageUrlBuilder({ projectId, dataset });

export function getPostImage(post: SanityDocument, width = 1200, height?: number) {
    if (post.mainImage?.asset?._ref || post.mainImage?.asset?._id) {
        let img = builder
            .image(post.mainImage.asset)
            .width(width)
            .fit("clip")
            .auto("format");

        if (height) {
            img = img.height(height);
        }

        return img.url();
    }

    return post.featured_image || "/carousel-Images/pexels-elviss-railijs-bitāns-1389429.jpg";
}

