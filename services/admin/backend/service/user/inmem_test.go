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

package user_test

import (
	"context"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/user"
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

//Save an user
func (r *inMemRepo) Save(ctx context.Context, e *user.Aggregate) (valueobject.Identifier, error) {

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

//Load an user
func (r *inMemRepo) Load(ctx context.Context, id valueobject.Identifier) (*user.Aggregate, error) {
	if r.m[id.UUID()] == nil {
		return nil, user.ErrNotFound
	}
	return user.NewAggregateFromEvents(r.m[id.UUID()]), nil
}
