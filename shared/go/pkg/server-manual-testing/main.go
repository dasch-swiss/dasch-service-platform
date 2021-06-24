package main

import (
	"log"
	"net/http"

	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/server"
	// "github.com/urfave/negroni"
)

func main() {
	log.Println("Manual testing...")

	var server = server.NewAPISPAServer("8080")
	log.Println("Server created")
	r := &server.Router
	// n := &server.Negroni
	r.HandleFunc("/api/v1/status", getStatus).Methods("GET")
	// r.Handle("/api/v1/status", n.With(
	// 	negroni.Wrap(getStatus()),
	// )).Methods("GET").Name("getStatus")
	log.Fatal(server.ListenAndServe())
}

func getStatus(w http.ResponseWriter, r *http.Request) {
	log.Println("Returning Status")
	res := []byte("Ok")
	w.Write(res)
}
