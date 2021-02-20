package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func main() {

	path, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}
	fmt.Println(path)

	// create file server handler to serve public folder relative to workspace root
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/*", fs)

	// add spa handler to serve for calls to root
	http.HandleFunc("/", spaHandler)

	// add db route handler to serve db.json
	http.HandleFunc("/db", dbHandler)

	// add projects route handler to serve projects
	http.HandleFunc("/projects", projectsHandler)

	// start HTTP server with all the previous attached handlers
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func spaHandler(responseWriter http.ResponseWriter, request *http.Request) {
	http.ServeFile(responseWriter, request, "./public/index.html")
}

func dbHandler(responseWriter http.ResponseWriter, request *http.Request) {
	http.ServeFile(responseWriter, request, "./services/metadata/backend/data/db.json")
}

func projectsHandler(responseWriter http.ResponseWriter, request *http.Request) {

	resp, err := http.Get("https://api.staging.dasch.swiss/admin/projects")
	if err != nil {
		// handle error
	}

	defer resp.Body.Close()

	body, readErr := ioutil.ReadAll(resp.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	fmt.Fprintf(responseWriter, string(body))
}
