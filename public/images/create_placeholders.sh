#!/bin/bash
# Create cricket1.jpg placeholder
convert -size 800x600 xc:'#0052CC' \
  -font Arial -pointsize 72 -fill white -gravity center \
  -annotate +0+0 'Cricket\nImage 1' \
  cricket1.jpg 2>/dev/null || echo "ImageMagick not available, using alternative"

# Create cricket2.jpg placeholder  
convert -size 800x600 xc:'#C77DDB' \
  -font Arial -pointsize 72 -fill white -gravity center \
  -annotate +0+0 'Cricket\nImage 2' \
  cricket2.jpg 2>/dev/null || echo "ImageMagick not available, using alternative"
