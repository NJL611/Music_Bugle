export function generatePremiumEmailHtml(posts: any[]) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themusicbugle.com';
    const primaryColor = '#E63946';
    const backgroundColor = '#121212';
    const containerColor = '#1E1E1E';
    const textColor = '#F1F1F1';
    const mutedColor = '#A1A1A1';
    const linkColor = '#FF6B6B';

    const featuredPost = posts[0];
    const otherPosts = posts.slice(1);

    const getImageUrl = (post: any) => post.imageUrl || post.featuredImage;
    const getAltText = (post: any) => post.imageAlt || post.title;

    let otherPostsHtml = '';

    if (otherPosts.length > 0) {
        otherPostsHtml = `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px;">
                <tr>
                    <td style="padding-bottom: 20px; border-bottom: 2px solid #333; color: ${textColor}; font-size: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                        Latest News
                    </td>
                </tr>
                ${otherPosts.map(post => {
            const img = getImageUrl(post);
            return `
                    <tr>
                        <td style="padding: 25px 0; border-bottom: 1px solid #333;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    ${img ? `
                                    <td width="140" valign="top" style="padding-right: 25px;">
                                        <a href="${baseUrl}/article/${post.slug}" style="text-decoration: none; display: block;">
                                            <img src="${img}?w=280&h=200&fit=crop" width="140" height="100" style="display: block; border-radius: 6px; object-fit: cover; background-color: #333;" alt="${getAltText(post)}" />
                                        </a>
                                    </td>
                                    ` : ''}
                                    <td valign="top">
                                        <h3 style="margin: 0 0 10px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 600; line-height: 1.3;">
                                            <a href="${baseUrl}/article/${post.slug}" style="color: ${textColor}; text-decoration: none;">${post.title}</a>
                                        </h3>
                                        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: ${mutedColor}; line-height: 1.6;">
                                            ${post.excerpt ? post.excerpt.substring(0, 110) + '...' : 'Read the full story on our website.'}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    `;
        }).join('')}
            </table>
        `;
    }

    const featuredImage = getImageUrl(featuredPost);

    return `
      <!DOCTYPE html>
      <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>The Music Bugle Weekly</title>
        <!--[if mso]>
        <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
        </style>
        <![endif]-->
        <style>
             @media screen and (max-width: 600px) {
                 .responsive-table { width: 100% !important; }
                 .responsive-img { width: 100% !important; height: auto !important; }
                 .mobile-padding { padding: 20px !important; }
             }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: ${backgroundColor}; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        <div style="background-color: ${backgroundColor}; padding: 40px 0;">
            <center>
            <table class="responsive-table" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="${containerColor}" style="max-width: 600px; margin: 0 auto; width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                
                <!-- Logo Section -->
                <tr>
                <td align="center" style="padding: 40px 20px 30px 20px; border-bottom: 1px solid #333;">
                    <a href="${baseUrl}" style="text-decoration: none;">
                        <span style="font-family: 'Times New Roman', Times, serif; font-size: 32px; font-weight: bold; color: ${textColor}; letter-spacing: 2px; text-transform: uppercase;">
                            The Music Bugle
                        </span>
                    </a>
                </td>
                </tr>

                <!-- Featured Story -->
                <tr>
                    <td align="left" style="padding: 0;">
                        ${featuredImage ? `
                        <a href="${baseUrl}/article/${featuredPost.slug}" style="text-decoration: none; display: block;">
                            <img src="${featuredImage}?w=1200&h=800&fit=crop" width="600" class="responsive-img" style="display: block; width: 100%; max-width: 600px; height: auto;" alt="${getAltText(featuredPost)}" />
                        </a>
                        ` : ''}
                        
                        <div class="mobile-padding" style="padding: 30px 40px;">
                            <h5 style="margin: 0 0 10px 0; color: ${primaryColor}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                                Top Story
                            </h5>
                            <h2 style="margin: 0 0 15px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${textColor}; line-height: 1.2;">
                                <a href="${baseUrl}/article/${featuredPost.slug}" style="text-decoration: none; color: ${textColor};">${featuredPost.title}</a>
                            </h2>
                            <p style="margin: 0 0 25px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; color: ${mutedColor}; line-height: 1.6;">
                                ${featuredPost.excerpt || ''}
                            </p>
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="border-radius: 6px;" bgcolor="${primaryColor}">
                                        <a href="${baseUrl}/article/${featuredPost.slug}" target="_blank" style="font-size: 15px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 6px; padding: 14px 28px; border: 1px solid ${primaryColor}; display: inline-block; font-weight: 600;">
                                            Read Full Story
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>

                <!-- Other Stories -->
                <tr>
                    <td align="left" style="padding: 0 40px 50px 40px;" class="mobile-padding">
                        ${otherPostsHtml}
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                <td align="center" style="padding: 40px 20px; background-color: #111; border-top: 1px solid #333;">
                    
                    <!-- Social Icons -->
                    <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                        <tr>
                            <td style="padding: 0 12px;">
                                <a href="https://facebook.com" target="_blank">
                                    <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook--v1.png" width="24" height="24" alt="Facebook" style="display: block; opacity: 0.8;" />
                                </a>
                            </td>
                            <td style="padding: 0 12px;">
                                <a href="https://twitter.com/TheMusicBugle" target="_blank">
                                    <img src="https://img.icons8.com/ios-filled/50/ffffff/twitter.png" width="24" height="24" alt="Twitter" style="display: block; opacity: 0.8;" />
                                </a>
                            </td>
                            <td style="padding: 0 12px;">
                                <a href="https://instagram.com" target="_blank">
                                    <img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" width="24" height="24" alt="Instagram" style="display: block; opacity: 0.8;" />
                                </a>
                            </td>
                        </tr>
                    </table>

                    <p style="margin: 0 0 12px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #777;">
                        © ${new Date().getFullYear()} The Music Bugle. All rights reserved.
                    </p>
                    <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #555;">
                    <a href="{$unsubscribe}" style="color: #666; text-decoration: underline;">Unsubscribe</a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a href="${baseUrl}" style="color: #666; text-decoration: underline;">View Online</a>
                    </p>
                </td>
                </tr>

            </table>
            </center>
        </div>
      </body>
      </html>
    `;
}
