package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	router := gin.Default()

	router.LoadHTMLFiles("./templates/index.html")

	router.Static("/public", "./public")
	router.StaticFile("/favicon.ico", "./public/favicon.ico")
	router.StaticFile("/service_worker.js", "./public/lib/service_worker.js")
	router.StaticFile("/service_worker.js.map", "./public/lib/service_worker.js.map")

	var serveIndex = func(c *gin.Context) {
		c.Writer.Header().Add("Link", "</public/lib/worker_atlas.js>; rel=preload; as=worker");
		c.Writer.Header().Add("Link", "</public/lib/worker_atlas.js>; rel=preload; as=worker");
		c.Writer.Header().Add("Link", "</public/lib/worker_md2.js>; rel=preload; as=worker");
		c.Writer.Header().Add("Link", "</public/lib/worker_offscreen.js>; rel=preload; as=worker");
		c.Writer.Header().Add("Link", "</public/lib/worker_progress.js>; rel=preload; as=worker");
		c.Writer.Header().Add("Link", "</public/lib/worker_quakemaps.js>; rel=preload; as=worker");
		c.Writer.Header().Add("Link", "</public/lib/worker_textures.js>; rel=preload; as=worker");
		c.Writer.Header().Add("Link", "</public/fonts/font-almendra-regular.ttf>; rel=preload; as=font; crossorigin");
		c.Writer.Header().Add("Link", "</public/fonts/font-mukta-light.ttf>; rel=preload; as=font; crossorigin");
		c.Writer.Header().Add("Link", "</public/fonts/font-mukta-medium.ttf>; rel=preload; as=font; crossorigin");

		c.HTML(http.StatusOK, "index.html", gin.H{})
	}

	router.GET("/", serveIndex)
	router.GET("/game", serveIndex)

	return router
}

func main() {
	router := setupRouter()

	go router.Run("127.0.0.1:8080")
	router.RunTLS(":2083", "./ssl.pem", "./ssl.key")
}
