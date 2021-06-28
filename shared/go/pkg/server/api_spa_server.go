package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"time"

	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/api/middleware"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/metric"
	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
)

// NewAPISPAServer returns a new server instance.
//
// By default it will serve:
//  `./public/index.html`
// for the single page application.
func NewAPISPAServer(port string) *APISPAServer {
	r := mux.NewRouter()
	defaultSPAHandler := spaHandler{
		staticPath: "public",
		indexPath:  "index.html",
	}
	return &APISPAServer{
		port:   port,
		Router: *r,
		// Negroni: *n,
		spa: defaultSPAHandler,
	}
}

/*
APISPAServer is a representation of a basic server that serves a
single page application (SPA) and an application programming interface (API).

The server is created by calling e.g.:
 s := NewAPISPAServer("8080")

After which, API routes can be registered on the server's router:
 r := &server.Router
 r.HandleFunc("/api/v1/status", getStatus).Methods("GET")

By default, the SPA is served from:
 `./public/index.html`

The SPA directory can be changed by calling:
 server.SetSPA("public/service-xy")
This will then serve:
 `./public/service-xy/index.html`

Finally, the server can be started:
 log.Fatal(server.ListenAndServe())
*/
type APISPAServer struct {
	port   string
	Router mux.Router
	spa    spaHandler
	srv    http.Server
	stop   chan bool
}

/*
Set the path to the single page application.

The path passed should point to the directory where `index.html` lies, though without tailing slash:
 srv.SetSPA("public/admin")
*/
func (server *APISPAServer) SetSPA(path string) {
	server.spa = spaHandler{
		staticPath: path,
		indexPath:  "index.html",
	}
}

// Create an http.Server from the APISPAServer. is called from ListenAndServe().
// The `log` flag specifies if negroni should log
func (server *APISPAServer) prepare(log bool) http.Server {
	// apply SPA handler
	server.Router.PathPrefix("/").Handler(server.spa)

	metricService, _ := metric.NewPrometheusService()
	n := negroni.New(
		negroni.HandlerFunc(middleware.Cors),
		negroni.HandlerFunc(middleware.Metrics(metricService)),
	)
	if log {
		n.Use(negroni.NewLogger())
	}

	n.UseHandler(&server.Router)

	srv := &http.Server{
		Handler:      n,
		Addr:         ":" + server.port,
		WriteTimeout: 1 * time.Second,
		ReadTimeout:  1 * time.Second,
	}
	return *srv
}

// Start the server and listen to requests on the specified port.
func (server *APISPAServer) ListenAndServe() error {
	server.srv = server.prepare(true)
	server.stop = make(chan bool, 1)
	serverRes := make(chan error)
	// start server
	go func() {
		log.Println("Starting server...")
		err := server.srv.ListenAndServe()
		if err != http.ErrServerClosed {
			err = http.ErrServerClosed
		}
		serverRes <- err
	}()
	// catch os interrupt
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	log.Println("Serving on port:", server.srv.Addr)
	go func() {
		// wait for os interrupt
		sig := <-stop
		fmt.Println("")
		log.Println("Server interrupted: ", sig)
		server.stop <- true
	}()
	<-server.stop
	server.shutdown()
	err := <-serverRes
	return err
}

// Shut down server gracefully.
func (server *APISPAServer) Shutdown() {
	server.stop <- true
}

// internally shut down server
func (server *APISPAServer) shutdown() {
	log.Println("Server interrupted...")
	srv := server.srv
	err := srv.Shutdown(context.Background())
	if err != nil {
		log.Panicln("Server failed to shut down gracefully: ", err)
	}
	log.Println("Server shut down.")
}

type spaHandler struct {
	staticPath string
	indexPath  string
}

// handle SPA to serve always from right place, no matter of route
func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		// Root requested.
		// -> serve index.html
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	}

	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	path = filepath.Join(h.staticPath, path)
	_, err2 := os.Stat(path)
	if err2 == nil {
		// file exists
		// -> serve file
		http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
		return
	} else {
		cropped := strings.TrimPrefix(r.URL.Path, "/")
		if strings.Contains(cropped, "/") {
			// subroute requested
			// e.g. `proj/global.css`
			// -> split by slash and call recursively for remainder of string
			subroutes := strings.Join(strings.Split(cropped, "/")[1:], "/")
			r.URL.Path = "/" + subroutes
			h.ServeHTTP(w, r)
		} else {
			// Non-existing file
			// -> index.html
			r.URL.Path = "/"
			h.ServeHTTP(w, r)
		}
	}
}
