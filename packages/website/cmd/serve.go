package cmd

import (
	"github.com/urfave/cli/v2"

	"personalidol.com/website/internal/webserver"
)

var Serve = cli.Command{
	Name:   "serve",
	Usage:  "Starts HTTPS server and optionally HTTP server for local development",
	Flags:  flags,
	Action: serve,
}

var flags = []cli.Flag{
	&cli.StringFlag{
		Name:  "http-listen",
		Usage: "HTTP listen string. If it's not provided then HTTP server won't be started. (example: \"127.0.0.1:8080\")",
	},
	&cli.StringFlag{
		Name:  "https-listen",
		Usage: "HTTPS listen string (example: \"example.com:443\")",
		Value: ":443",
	},
	&cli.StringFlag{
		Name:     "ssl-key",
		Usage:    "SSL private key file name (example: \"./ssl.key\")",
		Required: true,
	},
	&cli.StringFlag{
		Name:     "ssl-cert",
		Usage:    "SSL certificate file name (example: \"./ssl.cert\")",
		Required: true,
	},
}

func serve(c *cli.Context) error {
	router := webserver.Create()

	httpListen := c.String("http-listen")

	if httpListen != "" {
		go router.Run(httpListen)
	}

	router.RunTLS(c.String("https-listen"), c.String("ssl-cert"), c.String("ssl-key"))

	return nil
}
