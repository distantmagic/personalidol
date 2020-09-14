package main

import (
	"log"
	"os"

	"github.com/urfave/cli/v2"

	"git.distantmagic.com/personalidol/website/cmd"
)

func main() {
	app := &cli.App{
		Name: "website",
		Commands: []*cli.Command{
			&cmd.Serve,
		},
	}

	err := app.Run(os.Args)

	if err != nil {
		log.Fatal(err)
	}
}
