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

// implementation of marker interface to make sure that event structs can only
// come from this package. Go way of implementing a class hierarchy.
func (e ProjectCreated) isEvent()            {}
func (e ProjectChanged) isEvent()            {}
func (e ProjectDeleted) isEvent()            {}
func (e ProjectShortCodeChanged) isEvent()   {}
func (e ProjectShortNameChanged) isEvent()   {}
func (e ProjectLongNameChanged) isEvent()    {}
func (e ProjectDescriptionChanged) isEvent() {}

//ProjectCreated event
type ProjectCreated struct {
	ID          valueobject.Identifier  `json:"id"`
	ShortCode   valueobject.ShortCode   `json:"shortCode"`
	ShortName   valueobject.ShortName   `json:"shortName"`
	LongName    valueobject.LongName    `json:"longName"`
	Description valueobject.Description `json:"description"`
	CreatedAt   valueobject.Timestamp   `json:"createdAt"`
	CreatedBy   valueobject.Identifier  `json:"createdBy"`
}

//ProjectChanged event
type ProjectChanged struct {
	ID          valueobject.Identifier  `json:"id"`
	ShortCode   valueobject.ShortCode   `json:"shortCode"`
	ShortName   valueobject.ShortName   `json:"shortName"`
	LongName    valueobject.LongName    `json:"longName"`
	Description valueobject.Description `json:"description"`
	ChangedAt   valueobject.Timestamp   `json:"changedAt"`
	ChangedBy   valueobject.Identifier  `json:"changedBy"`
}

//ProjectDeleted event
type ProjectDeleted struct {
	ID        valueobject.Identifier `json:"id"`
	DeletedAt valueobject.Timestamp  `json:"deletedAt"`
	DeletedBy valueobject.Identifier `json:"deletedBy"`
}

//ProjectShortCodeChanged event
type ProjectShortCodeChanged struct {
	ID        valueobject.Identifier `json:"id"`
	ShortCode valueobject.ShortCode  `json:"shortCode"`
	ChangedAt valueobject.Timestamp  `json:"changedAt"`
	ChangedBy valueobject.Identifier `json:"changedBy"`
}

//ProjectShortNameChanged event
type ProjectShortNameChanged struct {
	ID        valueobject.Identifier `json:"id"`
	ShortName valueobject.ShortName  `json:"shortName"`
	ChangedAt valueobject.Timestamp  `json:"changedAt"`
	ChangedBy valueobject.Identifier `json:"changedBy"`
}

//ProjectLongNameChanged event
type ProjectLongNameChanged struct {
	ID        valueobject.Identifier `json:"id"`
	LongName  valueobject.LongName   `json:"longName"`
	ChangedAt valueobject.Timestamp  `json:"changedAt"`
	ChangedBy valueobject.Identifier `json:"changedBy"`
}

//ProjectDescriptionChanged event
type ProjectDescriptionChanged struct {
	ID          valueobject.Identifier  `json:"id"`
	Description valueobject.Description `json:"description"`
	ChangedAt   valueobject.Timestamp   `json:"changedAt"`
	ChangedBy   valueobject.Identifier  `json:"changedBy"`
}
