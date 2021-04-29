/*
 * Copyright © 2021 the contributors.
 *
 *  This file is part of the DaSCH Service Platform.
 *
 *  The DaSCH Service Platform is free software: you can
 *  redistribute it and/or modify it under the terms of the
 *  GNU Affero General Public License as published by the
 *  Free Software Foundation, either version 3 of the License,
 *  or (at your option) any later version.
 *
 *  The DaSCH Service Platform is distributed in the hope that
 *  it will be useful, but WITHOUT ANY WARRANTY; without even
 *  the implied warranty of MERCHANTABILITY or FITNESS FOR
 *  A PARTICULAR PURPOSE.  See the GNU Affero General Public
 *  License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public
 *  License along with the DaSCH Service Platform.  If not, see
 *  <http://www.gnu.org/licenses/>.
 *
 */

package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/api/presenter"
	projectEntity "github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/project"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/service/project"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
)

func createProject(service project.UseCase) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		errorMessage := "Error creating project"
		var input struct {
			ShortCode   string `json:"shortCode"`
			ShortName   string `json:"shortName"`
			LongName    string `json:"longName"`
			Description string `json:"description"`
		}
		err := json.NewDecoder(r.Body).Decode(&input)
		if err != nil {
			log.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(errorMessage))
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
		defer cancel()

		id, err := service.CreateProject(ctx, input.ShortCode, input.ShortName, input.LongName, input.Description)
		if err != nil {
			log.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(errorMessage))
			return
		}

		toJ := &presenter.Project{
			ID:          id,
			ShortCode:   input.ShortCode,
			ShortName:   input.ShortName,
			LongName:    input.LongName,
			Description: input.Description,
		}

		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(toJ); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(errorMessage))
			return
		}
	})
}

func updateProject(service project.UseCase) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		errorMessage := "Error updating project"
		var input struct {
			ShortCode string `json:"shortCode"`
			ShortName string `json:"shortName"`
			LongName  string `json:"longName"`
			// Description string `json:"description"`
		}
		err := json.NewDecoder(r.Body).Decode(&input)
		if err != nil {
			log.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(errorMessage))
			return
		}

		// get variables from request url
		vars := mux.Vars(r)

		// create empty Identifier
		uuid := valueobject.Identifier{}

		// create byte array from the provided id string
		b := []byte(vars["id"])

		// assign the value of the Identifier
		uuid.UnmarshalText(b)

		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
		defer cancel()

		// get the project
		p, err := service.GetProject(ctx, uuid)
		if err != nil && err == projectEntity.ErrNotFound {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("No project found for this uuid"))
			return
		}

		if err != nil && err != projectEntity.ErrNotFound {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("The server is not responding"))
			return
		}
		if p == nil {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("No data was returned"))
			return
		}

		sc := p.ShortCode()
		sn := p.ShortName()
		ln := p.LongName()
		// desc := p.Description()

		if input.ShortCode != "" {
			usc, err := service.UpdateProjectShortCode(ctx, uuid, input.ShortCode)
			if err != nil {
				log.Println(err.Error())
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(errorMessage))
				return
			}

			sc = usc.ShortCode()
		}

		if input.ShortName != "" {
			usn, err := service.UpdateProjectShortName(ctx, uuid, input.ShortName)
			if err != nil {
				log.Println(err.Error())
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(errorMessage))
				return
			}

			sn = usn.ShortName()
		}

		if input.LongName != "" {
			uln, err := service.UpdateProjectLongName(ctx, uuid, input.LongName)
			if err != nil {
				log.Println(err.Error())
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(errorMessage))
				return
			}

			ln = uln.LongName()
		}

		// if input.Description != "" {

		// }

		toJ := &presenter.Project{
			ID:          p.ID(),
			ShortCode:   sc.String(),
			ShortName:   sn.String(),
			LongName:    ln.String(),
			Description: p.Description().String(),
		}

		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(toJ); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(errorMessage))
			return
		}
	})
}

func getProject(service project.UseCase) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// get variables from request url
		vars := mux.Vars(r)

		// create empty Identifier
		uuid := valueobject.Identifier{}

		// create byte array from the provided id string
		b := []byte(vars["id"])

		// assign the value of the Identifier
		uuid.UnmarshalText(b)

		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
		defer cancel()

		// get the project
		data, err := service.GetProject(ctx, uuid)
		w.Header().Set("Content-Type", "application/json")

		if err != nil && err == projectEntity.ErrNotFound {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("No project found for this uuid"))
			return
		}

		if err != nil && err != projectEntity.ErrNotFound {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("The server is not responding"))
			return
		}
		if data == nil {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("No data was returned"))
			return
		}

		toJ := &presenter.Project{
			ID:          data.ID(),
			ShortCode:   data.ShortCode().String(),
			ShortName:   data.ShortName().String(),
			LongName:    data.LongName().String(),
			Description: data.Description().String(),
		}
		if err := json.NewEncoder(w).Encode(toJ); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Failed encoding data to JSON"))
		}
	})
}

//MakeProjectHandlers make url handlers
func MakeProjectHandlers(r *mux.Router, n negroni.Negroni, service project.UseCase) {

	r.Handle("/v1/project", n.With(
		negroni.Wrap(createProject(service)),
	)).Methods("POST", "OPTIONS").Name("createProject")

	r.Handle("/v1/project/{id}", n.With(
		negroni.Wrap(updateProject(service)),
	)).Methods("PUT", "OPTIONS").Name("updateProject")

	r.Handle("/v1/project/{id}", n.With(
		negroni.Wrap(getProject(service)),
	)).Methods("GET", "OPTIONS").Name("getProject")
}
