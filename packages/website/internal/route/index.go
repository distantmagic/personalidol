package route

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Index(c *gin.Context) {
	c.Writer.Header().Add("Link", "</public/lib/worker_atlas.js>; rel=preload; as=worker")
	c.Writer.Header().Add("Link", "</public/lib/worker_atlas.js>; rel=preload; as=worker")
	c.Writer.Header().Add("Link", "</public/lib/worker_md2.js>; rel=preload; as=worker")
	c.Writer.Header().Add("Link", "</public/lib/worker_offscreen.js>; rel=preload; as=worker")
	c.Writer.Header().Add("Link", "</public/lib/worker_progress.js>; rel=preload; as=worker")
	c.Writer.Header().Add("Link", "</public/lib/worker_quakemaps.js>; rel=preload; as=worker")
	c.Writer.Header().Add("Link", "</public/lib/worker_textures.js>; rel=preload; as=worker")
	c.Writer.Header().Add("Link", "</public/fonts/font-almendra-regular.ttf>; rel=preload; as=font; crossorigin")
	c.Writer.Header().Add("Link", "</public/fonts/font-mukta-light.ttf>; rel=preload; as=font; crossorigin")
	c.Writer.Header().Add("Link", "</public/fonts/font-mukta-medium.ttf>; rel=preload; as=font; crossorigin")

	c.HTML(http.StatusOK, "index.html", gin.H{})
}
