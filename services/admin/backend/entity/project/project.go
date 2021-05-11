/*
 * Copyright 2021 Data and Service Center for the Humanities - DaSCH

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

package project

import (
	"log"

	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/event"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
)

//ProjectAggregate domain entity
type Aggregate struct {
	id            valueobject.Identifier
	aggregateType valueobject.AggregateType
	shortCode     valueobject.ShortCode
	shortName     valueobject.ShortName
	longName      valueobject.LongName
	description   valueobject.Description
	createdAt     valueobject.Timestamp
	createdBy     valueobject.Identifier
	changedAt     valueobject.Timestamp
	changedBy     valueobject.Identifier
	deletedAt     valueobject.Timestamp
	deletedBy     valueobject.Identifier

	changes []event.Event
	version int
}

// ID returns the project's id.
func (p Aggregate) ID() valueobject.Identifier {
	return p.id
}

// AggregateType returns the aggregate's type.
func (p Aggregate) AggregateType() valueobject.AggregateType {
	return p.aggregateType
}

// ShortCode returns the project's short code.
func (p Aggregate) ShortCode() valueobject.ShortCode {
	return p.shortCode
}

// ShortName returns the project's short name.
func (p Aggregate) ShortName() valueobject.ShortName {
	return p.shortName
}

// LongName returns the project's long name.
func (p Aggregate) LongName() valueobject.LongName {
	return p.longName
}

// Description returns the project's description.
func (p Aggregate) Description() valueobject.Description {
	return p.description
}

// CreatedAt returns the project's creation time.
func (p Aggregate) CreatedAt() valueobject.Timestamp {
	return p.createdAt
}

// CreatedBy returns the project's creator identifier.
func (p Aggregate) CreatedBy() valueobject.Identifier {
	return p.createdBy
}

// ChangedAt returns the project's change time.
func (p Aggregate) ChangedAt() valueobject.Timestamp {
	return p.changedAt
}

// ChangedBy returns the project's changer identifier.
func (p Aggregate) ChangedBy() valueobject.Identifier {
	return p.changedBy
}

// DeletedAt returns the project's deletion time.
func (p Aggregate) DeletedAt() valueobject.Timestamp {
	return p.deletedAt
}

// DeletedBy returns the identifier of the user who deleted the project.
func (p Aggregate) DeletedBy() valueobject.Identifier {
	return p.deletedBy
}

// NewAggregateFromEvents is a helper method that creates a new project
// from a series of events.
func NewAggregateFromEvents(events []event.Event) *Aggregate {
	p := &Aggregate{}

	for _, e := range events {
		p.On(e, false)
	}

	return p
}

// NewAggregate create a new project entity.
// TODO: add user who is making the change
func NewAggregate(id valueobject.Identifier, shortCode valueobject.ShortCode, shortName valueobject.ShortName, longName valueobject.LongName, description valueobject.Description) *Aggregate {
	p := &Aggregate{}

	p.raise(&event.ProjectCreated{
		ID:          id,
		ShortCode:   shortCode,
		ShortName:   shortName,
		LongName:    longName,
		Description: description,
		CreatedAt:   valueobject.NewTimestamp(),
		CreatedBy:   valueobject.Identifier{},
	})

	return p
}

// DeleteProject deletes the project.
// TODO: add user who deleted the project
func (p *Aggregate) DeleteProject(id valueobject.Identifier) error {
	p.raise(&event.ProjectDeleted{
		ID:        p.id,
		DeletedAt: valueobject.NewTimestamp(),
		DeletedBy: valueobject.Identifier{},
	})

	return nil
}

// ChangeShortCode changes the short code of the project.
// TODO: check if short code is free (needs to be unique)
// TODO: add user who initiated the change
func (p *Aggregate) ChangeShortCode(shortCode valueobject.ShortCode) error {
	if !p.deletedAt.Time().IsZero() {
		return ErrProjectHasBeenDeleted
	}

	p.raise(&event.ProjectShortCodeChanged{
		ID:        p.id,
		ShortCode: shortCode,
		ChangedAt: valueobject.NewTimestamp(),
		ChangedBy: valueobject.Identifier{},
	})

	return nil
}

// ChangeShortName changes the short name of the project.
// TODO: check if short name is free (needs to be unique)
// TODO: add user who initiated the change
func (p *Aggregate) ChangeShortName(shortName valueobject.ShortName) error {
	if !p.deletedAt.Time().IsZero() {
		return ErrProjectHasBeenDeleted
	}

	p.raise(&event.ProjectShortNameChanged{
		ID:        p.id,
		ShortName: shortName,
		ChangedAt: valueobject.NewTimestamp(),
		ChangedBy: valueobject.Identifier{},
	})

	return nil
}

// ChangeLongName changes the long name of the project.
// TODO: check if long name is free (needs to be unique)
// TODO: add user who initiated the change
func (p *Aggregate) ChangeLongName(longName valueobject.LongName) error {
	if !p.deletedAt.Time().IsZero() {
		return ErrProjectHasBeenDeleted
	}

	p.raise(&event.ProjectLongNameChanged{
		ID:        p.id,
		LongName:  longName,
		ChangedAt: valueobject.NewTimestamp(),
		ChangedBy: valueobject.Identifier{},
	})

	return nil
}

// ChangeDescription changes the description of the project.
// TODO: add user who initiated the change
func (p *Aggregate) ChangeDescription(description valueobject.Description) error {
	if !p.deletedAt.Time().IsZero() {
		return ErrProjectHasBeenDeleted
	}

	p.raise(&event.ProjectDescriptionChanged{
		ID:          p.id,
		Description: description,
		ChangedAt:   valueobject.NewTimestamp(),
		ChangedBy:   valueobject.Identifier{},
	})

	return nil
}

// The raise method does two things, it appends the event into our changes slice
// and calls the event handler On saying that this is a new event and we should
// not increment the version number. The version is an optimistic concurrency
// pattern used to help us avoid database locks to change our aggregate.
func (p *Aggregate) raise(event event.Event) {
	p.changes = append(p.changes, event)
	p.On(event, true)
}

// On handles user events on the project aggregate.
// The On method first does a type switch on the event and selects the case for
// each event type. This is where state change happens. Once an event is emitted
// and saved we do not throw an error, we simply process the event and carry on.
// We can change here if we decide that an event is no longer relevant or if it
// means something different, but we can’t return an error and say an event is
// invalid. Then we check if this is a new event. If it isn’t we increment the
// version number of our aggregate.
func (p *Aggregate) On(ev event.Event, new bool) {
	switch e := ev.(type) {
	case *event.ProjectCreated:
		at, _ := valueobject.NewAggregateType("http://ns.dasch.swiss/admin#Project")
		p.aggregateType = at
		p.id = e.ID
		p.shortCode = e.ShortCode
		p.shortName = e.ShortName
		p.longName = e.LongName
		p.description = e.Description
		p.createdAt = e.CreatedAt
		p.createdBy = e.CreatedBy

	case *event.ProjectDeleted:
		p.id = e.ID
		p.deletedAt = e.DeletedAt
		p.deletedBy = e.DeletedBy

	case *event.ProjectShortCodeChanged:
		p.shortCode = e.ShortCode
		p.changedAt = e.ChangedAt
		p.changedBy = e.ChangedBy

	case *event.ProjectShortNameChanged:
		p.shortName = e.ShortName
		p.changedAt = e.ChangedAt
		p.changedBy = e.ChangedBy

	case *event.ProjectLongNameChanged:
		p.longName = e.LongName
		p.changedAt = e.ChangedAt
		p.changedBy = e.ChangedBy

	case *event.ProjectDescriptionChanged:
		p.description = e.Description
		p.changedAt = e.ChangedAt
		p.changedBy = e.ChangedBy

	default:
		log.Printf("unknown event %T", e)
	}

	if !new {
		p.version++
	}
}

// Events returns the uncommitted events from the project aggregate.
func (p Aggregate) Events() []event.Event {
	return p.changes
}

// Version returns the last version of the project aggregate before changes.
func (p Aggregate) Version() int {
	return p.version
}
