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
	"encoding/json"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/api/presenter"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/usecase/organization"
	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
	"log"
	"net/http"
)

func createOrganization(service organization.UseCase) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		errorMessage := "Error adding organization"
		var input struct {
			Name string `json:"name"`
		}
		err := json.NewDecoder(r.Body).Decode(&input)
		if err != nil {
			log.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(errorMessage))
			return
		}
		id, err := service.CreateOrganization(input.Name)
		if err != nil {
			log.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(errorMessage))
			return
		}
		toJ := &presenter.Organization{
			ID:   id,
			Name: input.Name,
		}

		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(toJ); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(errorMessage))
			return
		}
	})
}

func getOrganization(service organization.UseCase) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		errorMessage := "Error reading organization"
		vars := mux.Vars(r)
		id, err := entity.StringToID(vars["id"])
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(errorMessage))
			return
		}
		data, err := service.GetOrganization(id)
		w.Header().Set("Content-Type", "application/json")
		if err != nil && err != entity.ErrNotFound {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(errorMessage))
			return
		}

		if data == nil {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(errorMessage))
			return
		}
		toJ := &presenter.Organization{
			ID:   data.ID,
			Name: data.Name,
		}
		if err := json.NewEncoder(w).Encode(toJ); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(errorMessage))
		}
	})
}

//MakeUserHandlers make url handlers
func MakeOrganizationHandlers(r *mux.Router, n negroni.Negroni, service organization.UseCase) {
	//r.Handle("/v1/user", n.With(
	//	negroni.Wrap(listUsers(service)),
	//)).Methods("GET", "OPTIONS").Name("listUsers")

	r.Handle("/v1/organization", n.With(
		negroni.Wrap(createOrganization(service)),
	)).Methods("POST", "OPTIONS").Name("createOrganization")

	r.Handle("/v1/organization/{id}", n.With(
		negroni.Wrap(getOrganization(service)),
	)).Methods("GET", "OPTIONS").Name("getOrganization")

	//r.Handle("/v1/user/{id}", n.With(
	//	negroni.Wrap(deleteUser(service)),
	//)).Methods("DELETE", "OPTIONS").Name("deleteUser")
}
