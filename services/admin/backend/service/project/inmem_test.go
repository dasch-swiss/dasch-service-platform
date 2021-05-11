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

package project_test

import (
	"context"

	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/project"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/event"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/gofrs/uuid"
)

//inMemRepo is the in memory repository (only visible inside this package)
type inMemRepo struct {
	m map[uuid.UUID][]event.Event
}

//NewInMemRepo create a new in memory repository
func NewInMemRepo() *inMemRepo {
	var m = map[uuid.UUID][]event.Event{}
	return &inMemRepo{
		m: m,
	}
}

//Save a project
func (r *inMemRepo) Save(ctx context.Context, e *project.Aggregate) (valueobject.Identifier, error) {

	var events []event.Event

	// get any previously stored events
	if r.m[e.ID().UUID()] != nil {
		events = append(events, r.m[e.ID().UUID()]...)
	}

	// append new events
	events = append(events, e.Events()...)

	// store
	r.m[e.ID().UUID()] = events
	return e.ID(), nil
}

//Load a project
func (r *inMemRepo) Load(ctx context.Context, id valueobject.Identifier) (*project.Aggregate, error) {
	if r.m[id.UUID()] == nil {
		return nil, project.ErrNotFound
	}
	return project.NewAggregateFromEvents(r.m[id.UUID()]), nil
}

func (r *inMemRepo) GetProjectIds(ctx context.Context) ([]valueobject.Identifier, error) {

	i := 0
	projectIds := make([]valueobject.Identifier, len(r.m))
	for k := range r.m {
		// create empty Identifier
		uuid := valueobject.Identifier{}

		// create byte array from the provided id string
		b := []byte(k.String())

		// assign the value of the Identifier
		uuid.UnmarshalText(b)

		projectIds[i] = uuid
		i++
	}

	return projectIds, nil
}
