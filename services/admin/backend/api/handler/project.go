/*
 *  Copyright 2021 Data and Service Center for the Humanities - DaSCH.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/golang-jwt/jwt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/api/presenter"
	projectEntity "github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/project"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/service/project"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/gorilla/mux"
)

// RequestBody provides a reusable struct to use when decoding the JSON request body.
type RequestBody struct {
	ShortCode   string `json:"shortCode"`
	ShortName   string `json:"shortName"`
	LongName    string `json:"longName"`
	Description string `json:"description"`
}

// createProject creates a project with the provided RequestBody.
func createProject(service project.UseCase) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		// check JWT token to make sure user is authenticated
		// an object containing the users info is returned by ExtractTokenMetadata (currently not used, hence the underscore)
		_, tokenErr := ExtractTokenMetadata(r)
		if tokenErr != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(tokenErr.Error()))
			return
		}

		var input RequestBody
		err := json.NewDecoder(r.Body).Decode(&input)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
		defer cancel()

		// convert input strings to value objects
		sc, err := valueobject.NewShortCode(input.ShortCode)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		sn, err := valueobject.NewShortName(input.ShortName)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		ln, err := valueobject.NewLongName(input.LongName)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		desc, err := valueobject.NewDescription(input.Description)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		id, err := service.CreateProject(ctx, sc, sn, ln, desc)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		// get the project
		p, err := service.GetProject(ctx, id)
		if err != nil && err == projectEntity.ErrProjectNotFound {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(err.Error()))
			return
		}
		if err != nil && err == projectEntity.ErrProjectHasBeenDeleted {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(err.Error()))
			return
		}
		if err != nil && err != projectEntity.ErrProjectNotFound {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(projectEntity.ErrServerNotResponding.Error()))
			return
		}
		if p == nil {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(projectEntity.ErrNoProjectDataReturned.Error()))
			return
		}

		res := &presenter.Project{
			ID:          id,
			ShortCode:   p.ShortCode().String(),
			ShortName:   p.ShortName().String(),
			LongName:    p.LongName().String(),
			Description: p.Description().String(),
			CreatedAt:   p.CreatedAt().String(),
			CreatedBy:   p.CreatedBy().String(),
			ChangedAt:   p.ChangedAt().String(),
			ChangedBy:   p.ChangedBy().String(),
			DeletedAt:   p.DeletedAt().String(),
			DeletedBy:   p.DeletedBy().String(),
		}

		// replace null-values with "null"
		*res = res.NullifyJsonProps()

		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(res); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
	}
}

// updateProject updates a project with the provided RequestBody.
// Updating a project that has been marked as deleted is not possible.
// All fields of the RequestBody must be provided.
// At least one of the values of the provided RequestBody must differ from the current value of the corresponding project field.
// If a value of a field is identical to what it already is, the update will not be performed for that field.
func updateProject(service project.UseCase) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		// check JWT token to make sure user is authenticated
		// an object containing the users info is returned by ExtractTokenMetadata (currently not used, hence the underscore)
		_, tokenErr := ExtractTokenMetadata(r)
		if tokenErr != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(tokenErr.Error()))
			return
		}

		var input RequestBody
		err := json.NewDecoder(r.Body).Decode(&input)
		if err != nil {
			log.Println(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
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
		if err != nil && err == projectEntity.ErrProjectNotFound {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(err.Error()))
			return
		}
		if err != nil && err == projectEntity.ErrProjectHasBeenDeleted {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(err.Error()))
			return
		}
		if err != nil && err != projectEntity.ErrProjectNotFound {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(projectEntity.ErrServerNotResponding.Error()))
			return
		}
		if p == nil {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(projectEntity.ErrNoProjectDataReturned.Error()))
			return
		}

		// convert input strings to value objects
		sc, err := valueobject.NewShortCode(input.ShortCode)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		sn, err := valueobject.NewShortName(input.ShortName)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		ln, err := valueobject.NewLongName(input.LongName)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		desc, err := valueobject.NewDescription(input.Description)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		// update the project
		up, err := service.UpdateProject(ctx, uuid, sc, sn, ln, desc)
		if err != nil && err == projectEntity.ErrProjectHasBeenDeleted {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(err.Error()))
			return
		}
		if err != nil && err == projectEntity.ErrNoPropertiesChanged {
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write([]byte(err.Error()))
			return
		}
		if err != nil {
			log.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(projectEntity.ErrServerNotResponding.Error()))
			return
		}

		res := &presenter.Project{
			ID:          up.ID(),
			ShortCode:   up.ShortCode().String(),
			ShortName:   up.ShortName().String(),
			LongName:    up.LongName().String(),
			Description: up.Description().String(),
			CreatedAt:   up.CreatedAt().String(),
			CreatedBy:   up.CreatedBy().String(),
			ChangedAt:   up.ChangedAt().String(),
			ChangedBy:   up.ChangedBy().String(),
			DeletedAt:   up.DeletedAt().String(),
			DeletedBy:   up.DeletedBy().String(),
		}

		// replace null-values with "null"
		*res = res.NullifyJsonProps()

		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(res); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
	}
}

// getProject gets a project with the provided UUID.
func getProject(service project.UseCase) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		// check JWT token to make sure user is authenticated
		// an object containing the users info is returned by ExtractTokenMetadata (currently not used, hence the underscore)
		_, tokenErr := ExtractTokenMetadata(r)
		if tokenErr != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(tokenErr.Error()))
			return
		}

		//log.Print(tokenAuth.UserId)

		// get variables from request url
		vars := mux.Vars(r)

		uuid, err := valueobject.IdentifierFromBytes([]byte(vars["id"]))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
		defer cancel()

		// get the project
		p, err := service.GetProject(ctx, uuid)
		w.Header().Set("Content-Type", "application/json")

		if err != nil && err == projectEntity.ErrProjectNotFound {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(err.Error()))
			return
		}

		if err != nil && err != projectEntity.ErrProjectNotFound {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		if p == nil {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(projectEntity.ErrNoProjectDataReturned.Error()))
			return
		}

		res := &presenter.Project{
			ID:          p.ID(),
			ShortCode:   p.ShortCode().String(),
			ShortName:   p.ShortName().String(),
			LongName:    p.LongName().String(),
			Description: p.Description().String(),
			CreatedAt:   p.CreatedAt().String(),
			CreatedBy:   p.CreatedBy().String(),
			ChangedAt:   p.ChangedAt().String(),
			ChangedBy:   p.ChangedBy().String(),
			DeletedAt:   p.DeletedAt().String(),
			DeletedBy:   p.DeletedBy().String(),
		}

		// replace null-values with "null"
		*res = res.NullifyJsonProps()

		if err := json.NewEncoder(w).Encode(res); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}

// deleteProject deletes a project with the provided UUID.
func deleteProject(service project.UseCase) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		// check JWT token to make sure user is authenticated
		// an object containing the users info is returned by ExtractTokenMetadata (currently not used, hence the underscore)
		_, tokenErr := ExtractTokenMetadata(r)
		if tokenErr != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(tokenErr.Error()))
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

		// delete the project
		p, err := service.DeleteProject(ctx, uuid)
		w.Header().Set("Content-Type", "application/json")

		if err != nil && err == projectEntity.ErrProjectNotFound {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(err.Error()))
			return
		}

		if err != nil && err == projectEntity.ErrProjectHasBeenDeleted {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(err.Error()))
			return
		}

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(projectEntity.ErrServerNotResponding.Error()))
			return
		}
		if p == nil {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(projectEntity.ErrNoProjectDataReturned.Error()))
			return
		}

		res := &presenter.Project{
			ID:          p.ID(),
			ShortCode:   p.ShortCode().String(),
			ShortName:   p.ShortName().String(),
			LongName:    p.LongName().String(),
			Description: p.Description().String(),
			CreatedAt:   p.CreatedAt().String(),
			CreatedBy:   p.CreatedBy().String(),
			ChangedAt:   p.ChangedAt().String(),
			ChangedBy:   p.ChangedBy().String(),
			DeletedAt:   p.DeletedAt().String(),
			DeletedBy:   p.DeletedBy().String(),
		}

		// replace null-values with "null"
		*res = res.NullifyJsonProps()

		if err := json.NewEncoder(w).Encode(res); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}

// listProjects gets a list of all projects.
// By default, this only returns active projects.
// ReturnDeletedProjects can be provided in the request body to also return projects marked as deleted.
func listProjects(service project.UseCase) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		// check JWT token to make sure user is authenticated
		// an object containing the users info is returned by ExtractTokenMetadata (currently not used, hence the underscore)
		_, tokenErr := ExtractTokenMetadata(r)
		if tokenErr != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(tokenErr.Error()))
			return
		}

		var input struct {
			ReturnDeletedProjects bool `json:"returnDeletedProjects"`
		}
		err := json.NewDecoder(r.Body).Decode(&input)
		if err != nil {
			input.ReturnDeletedProjects = false // default to false if decoding fails (likely because it wasn't provided)
		}

		ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
		defer cancel()

		// get all project ids
		projects, err := service.ListProjects(ctx, input.ReturnDeletedProjects)
		w.Header().Set("Content-Type", "application/json")

		if err != nil && err == projectEntity.ErrProjectNotFound {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(err.Error()))
			return
		}

		if err != nil && err != projectEntity.ErrProjectNotFound {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(projectEntity.ErrServerNotResponding.Error()))
			return
		}
		if projects == nil {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(projectEntity.ErrNoProjectDataReturned.Error()))
			return
		}

		var res []presenter.Project

		for _, p := range projects {

			projToAppend := presenter.Project{
				ID:          p.ID(),
				ShortCode:   p.ShortCode().String(),
				ShortName:   p.ShortName().String(),
				LongName:    p.LongName().String(),
				Description: p.Description().String(),
				CreatedAt:   p.CreatedAt().String(),
				CreatedBy:   p.CreatedBy().String(),
				ChangedAt:   p.ChangedAt().String(),
				ChangedBy:   p.ChangedBy().String(),
				DeletedAt:   p.DeletedAt().String(),
				DeletedBy:   p.DeletedBy().String(),
			}

			// replace null-values with "null"
			projToAppend = projToAppend.NullifyJsonProps()

			res = append(res, projToAppend)

		}

		if err := json.NewEncoder(w).Encode(res); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}

//MakeProjectHandlers make url handlers for creating, updating, deleting, and getting projects
func MakeProjectHandlers(r *mux.Router, service project.UseCase) {

	r.HandleFunc("/v1/projects", createProject(service)).Methods("POST", "OPTIONS")

	r.HandleFunc("/v1/projects/{id}", updateProject(service)).Methods("PUT", "OPTIONS")

	r.HandleFunc("/v1/projects/{id}", deleteProject(service)).Methods("DELETE", "OPTIONS")

	r.HandleFunc("/v1/projects/{id}", getProject(service)).Methods("GET", "OPTIONS")

	r.HandleFunc("/v1/projects", listProjects(service)).Methods("GET", "OPTIONS")
}

// ExtractToken extracts the JWT token from the header.
func ExtractToken(r *http.Request) string {
	bearToken := r.Header.Get("Authorization")
	//normally Authorization the_token_xxx
	strArr := strings.Split(bearToken, " ")
	if len(strArr) == 2 {
		return strArr[1]
	}
	return ""
}

// VerifyToken verifies the JWT token to ensure the public key was provided and it was signed via RSA.
func VerifyToken(r *http.Request) (*jwt.Token, error) {
	tokenString := ExtractToken(r)

	key, err := jwt.ParseRSAPublicKeyFromPEM(getPublicKey())
	if err != nil {
		return nil, fmt.Errorf("error parsing RSA public key: %v\n", err)
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodRSA"
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return key, nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

// TokenValid checks if a JWT token is valid.
func TokenValid(r *http.Request) error {
	token, err := VerifyToken(r)
	if err != nil {
		return err
	}
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		return err
	}
	return nil
}

// ExtractTokenMetadata extracts the data contained within the JWT token and returns an AccessDetails object.
func ExtractTokenMetadata(r *http.Request) (*AccessDetails, error) {
	token, err := VerifyToken(r)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		userId, ok := claims["sub"].(string)
		if !ok {
			return nil, err
		}
		return &AccessDetails{
			UserId: userId,
		}, nil
	}
	return nil, err
}

type AccessDetails struct {
	UserId string
}

// TODO: figure out the correct way to provide the public key
func getPublicKey() []byte {
	return []byte("-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlxODHtViZgHJgchXZWJ2QvuFBrBJ4jM5yqme0+5yCRQLMKGUH5fXDCxZSdCjky5wKDgquJ9hyEdaB7jMqVdZRfLUHGZ3Z5rvTKf5Rh6LqOI1ZECJEFQPBe3HJMrR9uS0svjaEVtzdd615cNKgW6k44XybaKgbkQcnwa73lZ0eXiMxB3SjEiM4qz21b7PB0zgdLUv9+6eLBXZx3tgd1e4TXv3H+xLCyjr1WVr+cnjakc4Dn1ZHgtIbttolg4U4rKfEpijo8sECzzCUNgtEVMIpYXaCDqb5+hq7RARmpzbyRAtXWuvlHqwhfSGNqQEedJYEl4C0qThXE37KFtU3LZRdwIDAQAB\n-----END PUBLIC KEY-----")
}
