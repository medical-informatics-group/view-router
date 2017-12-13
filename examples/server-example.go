package main

import (
	"strings"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/mojlighetsministeriet/utils"
)

func main() {
	server := echo.New()
	server.Use(middleware.Static("./"))
	server.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:  "./",
		HTML5: true,
		Skipper: func(context echo.Context) bool {
			if strings.HasPrefix(context.Path(), "/node_modules/") {
				return true
			}
			return false
		},
	}))

	server.Logger.Fatal(server.Start(":" + utils.GetEnv("PORT", "3000")))
}
