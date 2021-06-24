package server

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"time"

	// "github.com/gorilla/handlers"
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
	// metricService, err := metric.NewPrometheusService()
	// if err != nil {
	// 	log.Fatal(err.Error())
	// }

	// n := negroni.New(
	// 	negroni.HandlerFunc(middleware.Cors),
	// 	negroni.HandlerFunc(middleware.Metrics(metricService)),
	// 	negroni.NewLogger(),
	// )
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

// APISPAServer is a representation of a basic server that serves a
// single page application (SPA) and an application programming interface (API).
//
// The server is created by calling e.g.:
//  s := NewAPISPAServer("8080")
//
// After which, API routes can be registered on the server's router:
//  r := &server.Router
//  r.HandleFunc("/api/v1/status", getStatus).Methods("GET")
//
// By default, the SPA is served from:
//  `./public/index.html`
//
// The SPA directory can be changed by calling:
//  server.SetSPA("public/service-xy")
// This will then serve:
//  `./public/service-xy/index.html`
//
// Finally, the server can be started:
//  log.Fatal(server.ListenAndServe())
type APISPAServer struct {
	port   string
	Router mux.Router
	// Negroni negroni.Negroni
	spa spaHandler
}

func (server *APISPAServer) SetSPA(path string) {
	server.spa = spaHandler{
		staticPath: path,
		indexPath:  "index.html",
	}
}

func (server *APISPAServer) ListenAndServe() error {
	// h := handlers.CORS(handlers.AllowedOrigins([]string{"*"}))(&server.Router)

	// apply SPA handler
	server.Router.PathPrefix("/").Handler(server.spa)

	// n := negroni.Classic() // Includes some default middlewares
	metricService, _ := metric.NewPrometheusService()
	// n.Use(negroni.HandlerFunc(middleware.Cors))
	// n.Use(negroni.HandlerFunc(middleware.Metrics(metricService)))
	// n.Use(negroni.NewLogger())
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
func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) { // TODO: make dynamic
	log.Printf("SPA Handler: %v", r.URL)

	// get the absolute path to prevent directory traversal
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// prepend the path with the path to the static directory
	path = filepath.Join(h.staticPath, path)

	// check whether a file exists at the given path
	_, err2 := os.Stat(path)
	if err2 == nil {
		// file exists -> serve file
		// log.Printf("Serving from File Server: %v", path)
		http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
		return
	} else {
		// file does not exist, see where to go from here
		pattern := "/projects/?([0-9A-F]{4})?"
		match, _ := regexp.MatchString(pattern, path)
		if match {
			// file matches "/project/shortcode" pattern -> remove this section of the path
			re := regexp.MustCompile(pattern)
			s := re.ReplaceAllString(path, "/")
			_, err3 := os.Stat(s)
			if err3 == nil {
				// file exists after removing the section -> serve this file
				// log.Printf("Existis after changing: %v", s)
				http.ServeFile(w, r, s)
				return
			}
		}

		// file still not found, serve index.html
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
	}
}

// ----------------

// func main() {

// 	metricService, err := metric.NewPrometheusService()
// 	if err != nil {
// 		log.Fatal(err.Error())
// 	}
// 	r := mux.NewRouter()
// 	//handlers
// 	n := negroni.New(
// 		negroni.HandlerFunc(middleware.Cors),
// 		negroni.HandlerFunc(middleware.Metrics(metricService)),
// 		negroni.NewLogger(),
// 	)

// 	//organization
// 	handler.MakeOrganizationHandlers(r, *n, organizationService)

// 	//project
// 	handler.MakeProjectHandlers(r, *n, projectService)

// 	http.Handle("/", r)
// 	http.Handle("/metrics", promhttp.Handler())
// 	r.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
// 		w.WriteHeader(http.StatusOK)
// 	})

// 	logger := log.New(os.Stderr, "logger: ", log.Lshortfile)
// 	srv := &http.Server{
// 		ReadTimeout:  5 * time.Second,
// 		WriteTimeout: 10 * time.Second,
// 		Addr:         ":" + strconv.Itoa(8080),
// 		// FIXME: get rid of deprecated github.com/gorilla/context library
// 		Handler:  context.ClearHandler(http.DefaultServeMux),
// 		ErrorLog: logger,
// 	}

// }
