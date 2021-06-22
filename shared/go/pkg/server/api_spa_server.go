package server

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// NewAPISPAServer returns a new server instance.
func NewAPISPAServer(port string) *APISPAServer {
	r := mux.NewRouter()
	return &APISPAServer{
		port:   port,
		Router: *r,
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
// Finally, the server can be started:
//  log.Fatal(server.ListenAndServe())
type APISPAServer struct {
	port   string
	Router mux.Router
}

func (server *APISPAServer) ListenAndServe() error {
	h := handlers.CORS(handlers.AllowedOrigins([]string{"*"}))(&server.Router)

	// init SPA handler
	spa := spaHandler{
		staticPath: "public",     // TODO: make dynamic
		indexPath:  "index.html", // TODO: make dynamic
	}

	// apply SPA handler
	server.Router.PathPrefix("/").Handler(spa)

	srv := &http.Server{
		Handler:      h,
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

// 	path, err := os.Getwd()
// 	if err != nil {
// 		log.Println(err)
// 	}
// 	fmt.Println(path)

// 	// organizationRepository := repository.NewInmemDB()
// 	organizationRepository := repository.NewInmemDB()
// 	organizationService := organization.NewService(organizationRepository)

// 	config, err := client.ParseConnectionString("esdb://localhost:2113?tls=false")
// 	if err != nil {
// 		log.Fatal("Unexpected configuration error: ", err.Error())
// 	}

// 	client, err := client.NewClient(config)
// 	if err != nil {
// 		log.Fatal("Unexpected failure setting up test connection: ", err.Error())
// 	}
// 	err = client.Connect()
// 	if err != nil {
// 		log.Fatal("Unexpected failure connecting: ", err.Error())
// 	}

// 	projectRepository := projectRepository.NewProjectRepository(client)

// 	projectService := project.NewService(projectRepository)

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
// 	err = srv.ListenAndServe()
// 	if err != nil {
// 		log.Fatal(err.Error())
// 	}

// }

// -----------------

// func main() {

// 	// init SPA handler
// 	spa := spaHandler{
// 		staticPath: "public",
// 		indexPath:  "index.html",
// 	}

// 	// apply SPA handler
// 	router.PathPrefix("/").Handler(spa)

// 	srv := &http.Server{
// 		Handler:      ch(router),
// 		Addr:         ":3000",
// 		WriteTimeout: 15 * time.Second,
// 		ReadTimeout:  15 * time.Second,
// 	}

// 	// run server
// 	log.Fatal(srv.ListenAndServe())
// }
