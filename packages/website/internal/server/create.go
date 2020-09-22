package server

import (
	"github.com/gin-gonic/gin"

	"git.distantmagic.com/personalidol/website/internal/routes"
)

func Create() *gin.Engine {
	router := gin.Default()

	router.LoadHTMLGlob("./templates/*.html")

	router.Static("/public", "./public")

	// No matter what, browsers seem to always request for `favicon.ico` even
	// if some other path is configured in the HTML meta tags.
	router.StaticFile("/favicon.ico", "./public/favicon.ico")

	// Service worker must be served from the top level to be able to manage
	// the entire website scope.
	router.StaticFile("/service_worker.js", "./public/lib/service_worker.js")
	router.StaticFile("/service_worker.js.map", "./public/lib/service_worker.js.map")

	router.GET("/", routes.Index)

	return router
}
