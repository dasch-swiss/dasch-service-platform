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
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/service/project"
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

//MakeProjectHandlers make url handlers
func MakeProjectHandlers(r *mux.Router, n negroni.Negroni, service project.UseCase) {

	r.Handle("/v1/project", n.With(
		negroni.Wrap(createProject(service)),
	)).Methods("POST", "OPTIONS").Name("createProject")
}
