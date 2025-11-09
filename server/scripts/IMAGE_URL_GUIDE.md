# How to Add Your Own Jersey Image URLs

## Option 1: Use Image Hosting Services (Recommended)

### Imgur
1. Go to https://imgur.com
2. Upload your jersey image
3. Right-click the image → "Copy image address"
4. Use that URL in the `imageUrl field

### Cloudinary
1. Sign up at https://cloudinary.com (free tier available)
2. Upload images
3. Copy the image URL

### Other Options
- **ImgBB**: https://imgbb.com
- **PostImage**: https://postimages.org
- **ImageKit**: https://imagekit.io

## Option 2: Store Images Locally

1. Create a folder: `client/public/images/jerseys/`
2. Save your images there (e.g., `real-madrid-ronaldo.jpg`)
3. Use relative URL: `/images/jerseys/real-madrid-ronaldo.jpg`

## Option 3: Use Existing Jersey Website URLs

You can use image URLs from jersey websites (make sure they allow hotlinking):
- Example: `https://example-jersey-site.com/images/real-madrid-ronaldo.jpg`

## Option 4: Update via MongoDB Compass

1. Open MongoDB Compass
2. Connect to `jersey-recommendations` database
3. Open `jerseys` collection
4. Edit each document and update the `imageUrl` field
5. Click "Update"

## Quick Example

Replace this:
```javascript
imageUrl: 'YOUR_IMAGE_URL_HERE',
```

With your actual URL:
```javascript
imageUrl: 'https://i.imgur.com/abc123.jpg',
```

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 400x600px or larger
- **Aspect Ratio**: Portrait (vertical) works best for jerseys
- **File Size**: Keep under 2MB for faster loading

## Testing Your URLs

Before adding to database, test your URLs:
1. Copy the URL
2. Paste in browser address bar
3. Make sure image loads correctly

