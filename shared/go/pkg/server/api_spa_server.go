package server

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"

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
}

func (server *APISPAServer) SetSPA(path string) {
	server.spa = spaHandler{
		staticPath: path,
		indexPath:  "index.html",
	}
}

func (server *APISPAServer) ListenAndServe() error {
	// apply SPA handler
	server.Router.PathPrefix("/").Handler(server.spa)

	metricService, _ := metric.NewPrometheusService()
	n := negroni.New(
		negroni.HandlerFunc(middleware.Cors),
		negroni.HandlerFunc(middleware.Metrics(metricService)),
		negroni.NewLogger(),
	)

	n.UseHandler(&server.Router)

	srv := &http.Server{
		Handler:      n,
		Addr:         ":" + server.port,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Println("Serving on port:", srv.Addr)
	err := srv.ListenAndServe()
	return err
}

type spaHandler struct {
	staticPath string
	indexPath  string
}

// handle SPA to serve always from right place, no matter of route
func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	path = filepath.Join(h.staticPath, path)
	_, err2 := os.Stat(path)
	if err2 == nil {
		// file exists -> serve file
		http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
		return
	} else {
		cropped := trimFirstRune((r.URL.Path))
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
			r.URL.Path = "/index.html"
			h.ServeHTTP(w, r)
		}
	}
}

func trimFirstRune(s string) string {
	_, i := utf8.DecodeRuneInString(s)
	return s[i:]
}
