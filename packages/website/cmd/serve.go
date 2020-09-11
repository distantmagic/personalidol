package cmd

import (
	"sync"

	"github.com/urfave/cli/v2"

	"personalidol.com/website/internal/webserver"
)

var Serve = cli.Command{
	Name:   "serve",
	Usage:  "Starts HTTPS server and optionally HTTP server.",
	Flags:  flags,
	Action: serve,
}

var flags = []cli.Flag{
	&cli.StringFlag{
		Name:  "http-listen",
		Usage: "HTTP listen string. If it's not provided then HTTP server won't be started. (example: \"127.0.0.1:8080\")",
		Value: ":80",
	},
	&cli.StringFlag{
		Name:  "https-listen",
		Usage: "HTTPS listen string (example: \"example.com:443\")",
	},
	&cli.StringFlag{
		Name:     "ssl-key",
		Usage:    "SSL private key file name (example: \"./ssl.key\")",
	},
	&cli.StringFlag{
		Name:     "ssl-cert",
		Usage:    "SSL certificate file name (example: \"./ssl.cert\")",
	},
}

func serve(c *cli.Context) error {
	var wg sync.WaitGroup

	router := webserver.Create()

	httpListen := c.String("http-listen")
	if httpListen != "" {
		wg.Add(1)
		go router.Run(httpListen)
	}

	httpsListen := c.String("https-listen")
	if httpsListen != "" {
		wg.Add(1)
		go router.RunTLS(c.String("https-listen"), c.String("ssl-cert"), c.String("ssl-key"))
	}

	wg.Wait()

	return nil
}
