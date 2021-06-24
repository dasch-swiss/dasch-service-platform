package main

import (
	"log"
	"net/http"

	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/server"
)

func main() {
	log.Println("Manual testing...")

	var server = server.NewAPISPAServer("8080")
	log.Println("Server created")
	r := &server.Router
	r.HandleFunc("/api/v1/status", getStatus).Methods("GET")
	log.Fatal(server.ListenAndServe())
}

func getStatus(w http.ResponseWriter, r *http.Request) {
	log.Println("Returning Status")
	res := []byte("Ok")
	w.Write(res)
}
