package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/mojlighetsministeriet/utils"
)

func main() {
	server := echo.New()
	server.Use(middleware.Static("./build"))
	server.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:  "./build/default",
		Index: "index.html",
		HTML5: true,
	}))

	server.Logger.Fatal(server.Start(":" + utils.GetEnv("PORT", "3000")))
}
