/*
 * Copyright 2021 Data and Service Center for the Humanities - DaSCH.
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

package event

import (
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"
	"time"
)

// implementation of marker interface to make sure, that event structs can only
// come from this package. Go way of implementing a class hierarchy.
func (e UserCreated) isEvent()           {}
func (e UserUsernameChanged) isEvent()   {}
func (e UserEmailChanged) isEvent()      {}
func (e UserPasswordChanged) isEvent()   {}
func (e UserGivenNameChanged) isEvent()  {}
func (e UserFamilyNameChanged) isEvent() {}

//UserCreated event
type UserCreated struct {
	ID         entity.ID `json:"id"`
	Username   string    `json:"username"`
	Email      string    `json:"email"`
	Password   string    `json:"password"`
	GivenName  string    `json:"givenName"`
	FamilyName string    `json:"familyName"`
	CreatedAt  time.Time `json:"createdAt"`
}

//UserUsernameChanged event
type UserUsernameChanged struct {
	ID        entity.ID `json:"id"`
	Username  string    `json:"username"`
	ChangedAt time.Time `json:"changedAt"`
}

//UserEmailChanged event
type UserEmailChanged struct {
	ID        entity.ID `json:"id"`
	Email     string    `json:"email"`
	ChangedAt time.Time `json:"changedAt"`
}

//UserPasswordChanged event
type UserPasswordChanged struct {
	ID        entity.ID `json:"id"`
	Password  string    `json:"password"`
	ChangedAt time.Time `json:"changedAt"`
}

//UserGivenNameChanged event
type UserGivenNameChanged struct {
	ID        entity.ID `json:"id"`
	GivenName string    `json:"givenName"`
	ChangedAt time.Time `json:"changedAt"`
}

//UserFamilyNameChanged event
type UserFamilyNameChanged struct {
	ID         entity.ID `json:"id"`
	FamilyName string    `json:"familyName"`
	ChangedAt  time.Time `json:"changedAt"`
}
