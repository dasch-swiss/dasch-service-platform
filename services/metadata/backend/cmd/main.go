/*
 * Copyright 2021 DaSCH - Data and Service Center for the Humanities.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package main

import (
	"fmt"
	"github.com/dasch-swiss/dasch-service-platform/services/metadata/backend/api/handler"
	"github.com/dasch-swiss/dasch-service-platform/services/metadata/backend/api/middleware"
	"github.com/dasch-swiss/dasch-service-platform/services/metadata/backend/config"
	"github.com/dasch-swiss/dasch-service-platform/services/metadata/backend/infrastructure/repository"
	"github.com/dasch-swiss/dasch-service-platform/services/metadata/backend/usecase/organization"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/metric"
	"github.com/gorilla/context"
	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/urfave/negroni"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

func main() {

	path, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}
	fmt.Println(path)

	organizationRepository := repository.NewInmemDB()
	organizationService := organization.NewService(organizationRepository)

	metricService, err := metric.NewPrometheusService()
	if err != nil {
		log.Fatal(err.Error())
	}
	r := mux.NewRouter()
	//handlers
	n := negroni.New(
		negroni.HandlerFunc(middleware.Cors),
		negroni.HandlerFunc(middleware.Metrics(metricService)),
		negroni.NewLogger(),
	)

	//organization
	handler.MakeOrganizationHandlers(r, *n, organizationService)

	http.Handle("/", r)
	http.Handle("/metrics", promhttp.Handler())
	r.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	logger := log.New(os.Stderr, "logger: ", log.Lshortfile)
	srv := &http.Server{
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		Addr:         ":" + strconv.Itoa(config.API_PORT),
		// FIXME: get rid of deprecated github.com/gorilla/context library
		Handler:  context.ClearHandler(http.DefaultServeMux),
		ErrorLog: logger,
	}
	err = srv.ListenAndServe()
	if err != nil {
		log.Fatal(err.Error())
	}

	/*
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
	*/
}

/*
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
*/
