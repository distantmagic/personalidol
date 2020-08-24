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

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})

	return router
}

func main() {
	router := setupRouter()

	go router.Run(":8080")
	router.RunTLS(":2083", "./ssl.pem", "./ssl.key")
}
