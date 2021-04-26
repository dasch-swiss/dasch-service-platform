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
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
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
	ID         valueobject.Identifier `json:"id"`
	Username   valueobject.Username   `json:"username"`
	Email      valueobject.Email      `json:"email"`
	Password   valueobject.Password   `json:"password"`
	GivenName  valueobject.GivenName  `json:"givenName"`
	FamilyName valueobject.FamilyName `json:"familyName"`
	CreatedAt  valueobject.Timestamp  `json:"createdAt"`
	CreatedBy  valueobject.Identifier `json:"createdBy"`
}

//UserUsernameChanged event
type UserUsernameChanged struct {
	ID        valueobject.Identifier `json:"id"`
	Username  valueobject.Username   `json:"username"`
	ChangedAt valueobject.Timestamp  `json:"changedAt"`
	ChangedBy valueobject.Identifier `json:"changedBy"`
}

//UserEmailChanged event
type UserEmailChanged struct {
	ID        valueobject.Identifier `json:"id"`
	Email     valueobject.Email      `json:"email"`
	ChangedAt valueobject.Timestamp  `json:"changedAt"`
	ChangedBy valueobject.Identifier `json:"changedBy"`
}

//UserPasswordChanged event
type UserPasswordChanged struct {
	ID        valueobject.Identifier `json:"id"`
	Password  valueobject.Password   `json:"password"`
	ChangedAt valueobject.Timestamp  `json:"changedAt"`
	ChangedBy valueobject.Identifier `json:"changedBy"`
}

//UserGivenNameChanged event
type UserGivenNameChanged struct {
	ID        valueobject.Identifier `json:"id"`
	GivenName valueobject.GivenName  `json:"givenName"`
	ChangedAt valueobject.Timestamp  `json:"changedAt"`
	ChangedBy valueobject.Identifier `json:"changedBy"`
}

//UserFamilyNameChanged event
type UserFamilyNameChanged struct {
	ID         valueobject.Identifier `json:"id"`
	FamilyName valueobject.FamilyName `json:"familyName"`
	ChangedAt  valueobject.Timestamp  `json:"changedAt"`
	ChangedBy  valueobject.Identifier `json:"changedBy"`
}
