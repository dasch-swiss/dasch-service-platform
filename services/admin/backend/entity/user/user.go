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

package user

import (
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/event"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"log"
)

// UserAggregate domain entity
// TODO: exchange strings for value objects
type Aggregate struct {
	id            valueobject.Identifier
	aggregateType valueobject.AggregateType
	username      valueobject.Username
	email         valueobject.Email
	password      valueobject.Password
	givenName     valueobject.GivenName
	familyName    valueobject.FamilyName
	createdAt     valueobject.Timestamp
	createdBy     valueobject.Identifier
	changedAt     valueobject.Timestamp
	changedBy     valueobject.Identifier

	changes []event.Event
	version int
}

// ID returns the user's id.
func (u Aggregate) ID() valueobject.Identifier {
	return u.id
}

// AggregateType returns the aggregate's type.
func (u Aggregate) AggregateType() valueobject.AggregateType {
	return u.aggregateType
}

// Username returns the user's username.
func (u Aggregate) Username() valueobject.Username {
	return u.username
}

// Email returns the user's email.
func (u Aggregate) Email() valueobject.Email {
	return u.email
}

// Password returns the user's password.
func (u Aggregate) Password() valueobject.Password {
	return u.password
}

// GivenName returns the user's given name.
func (u Aggregate) GivenName() valueobject.GivenName {
	return u.givenName
}

// FamilyName returns the user's family name.
func (u Aggregate) FamilyName() valueobject.FamilyName {
	return u.familyName
}

// CreatedAt returns the user's creation time.
func (u Aggregate) CreatedAt() valueobject.Timestamp {
	return u.createdAt
}

// CreatedBy returns the user's creator identifier.
func (u Aggregate) CreatedBy() valueobject.Identifier {
	return u.createdBy
}

// ChangedAt returns the user's change time.
func (u Aggregate) ChangedAt() valueobject.Timestamp {
	return u.changedAt
}

// ChangedBy returns the user's changer identifier.
func (u Aggregate) ChangedBy() valueobject.Identifier {
	return u.changedBy
}

// NewAggregateFromEvents is a helper method that creates a new user
// from a series of events.
func NewAggregateFromEvents(events []event.Event) *Aggregate {
	u := &Aggregate{}

	for _, e := range events {
		u.On(e, false)
	}

	return u
}

// NewAggregate create a new user entity.
// TODO: add user who is making the change
func NewAggregate(id valueobject.Identifier, username valueobject.Username, email valueobject.Email, password valueobject.Password, givenName valueobject.GivenName, familyName valueobject.FamilyName) *Aggregate {
	u := &Aggregate{}

	u.raise(&event.UserCreated{
		ID:         id,
		Username:   username,
		Email:      email,
		Password:   password,
		GivenName:  givenName,
		FamilyName: familyName,
		CreatedAt:  valueobject.NewTimestamp(),
		CreatedBy:  valueobject.Identifier{},
	})

	return u
}

// ChangeUsername changes the username of the user.
// TODO: check if username is free (needs to be unique)
// TODO: add user who initiated the change
func (u Aggregate) ChangeUsername(username valueobject.Username) error {
	u.raise(&event.UserUsernameChanged{
		ID:        u.id,
		Username:  username,
		ChangedAt: valueobject.NewTimestamp(),
		ChangedBy: valueobject.Identifier{},
	})

	return nil
}

// ChangeEmail changes the email of the user.
// TODO: check if email is free (needs to be unique)
// TODO: add user who initiated the change
func (u Aggregate) ChangeEmail(email valueobject.Email) error {
	u.raise(&event.UserEmailChanged{
		ID:        u.id,
		Email:     email,
		ChangedAt: valueobject.NewTimestamp(),
		ChangedBy: valueobject.Identifier{},
	})

	return nil
}

// ChangePassword changes the password of the user.
// TODO: add user who initiated the change
func (u Aggregate) ChangePassword(password valueobject.Password) error {
	u.raise(&event.UserPasswordChanged{
		ID:        u.id,
		Password:  password,
		ChangedAt: valueobject.NewTimestamp(),
		ChangedBy: valueobject.Identifier{},
	})

	return nil
}

// ChangeGivenName changes the given name of the user.
// TODO: add user who initiated the change
func (u Aggregate) ChangeGivenName(givenName valueobject.GivenName) error {
	u.raise(&event.UserGivenNameChanged{
		ID:        u.id,
		GivenName: givenName,
		ChangedAt: valueobject.NewTimestamp(),
		ChangedBy: valueobject.Identifier{},
	})

	return nil
}

// ChangeFamilyName changes the family name of the user.
// TODO: add user who initiated the change
func (u Aggregate) ChangeFamilyName(familyName valueobject.FamilyName) error {
	u.raise(&event.UserFamilyNameChanged{
		ID:         u.id,
		FamilyName: familyName,
		ChangedAt:  valueobject.NewTimestamp(),
		ChangedBy:  valueobject.Identifier{},
	})

	return nil
}

// The raise method does two things, it appends the event into our changes slice
// and calls the event handler On saying that this is a new event and we should
// not increment the version number. The version is an optimistic concurrency
//pattern used to help us avoid database locks to change our aggregate.
func (u *Aggregate) raise(event event.Event) {
	u.changes = append(u.changes, event)
	u.On(event, true)
}

// On handles user events on the user aggregate.
// The On method first does a type switch on the event and selects the case for
// each event type. This is where state change happens. Once an event is emitted
// and saved we do not throw an error, we simply process the event and carry on.
// We can change here if we decide that an event is no longer relevant or if it
// means something different, but we can’t return an error and say an event is
// invalid. Then we check if this is a new event if it isn’t we increment the
// version number of our aggregate.
func (u *Aggregate) On(ev event.Event, new bool) {
	switch e := ev.(type) {
	case *event.UserCreated:
		at, _ := valueobject.NewAggregateType("http://ns.dasch.swiss/admin#User")
		u.id = e.ID
		u.aggregateType = at
		u.username = e.Username
		u.email = e.Email
		u.password = e.Password
		u.givenName = e.GivenName
		u.familyName = e.FamilyName
		u.createdAt = e.CreatedAt
		u.createdBy = e.CreatedBy

	case *event.UserUsernameChanged:
		u.username = e.Username
		u.changedAt = e.ChangedAt
		u.changedBy = e.ChangedBy

	case *event.UserEmailChanged:
		u.email = e.Email
		u.changedAt = e.ChangedAt
		u.changedBy = e.ChangedBy

	case *event.UserPasswordChanged:
		u.password = e.Password
		u.changedAt = e.ChangedAt
		u.changedBy = e.ChangedBy

	case *event.UserGivenNameChanged:
		u.givenName = e.GivenName
		u.changedAt = e.ChangedAt
		u.changedBy = e.ChangedBy

	case *event.UserFamilyNameChanged:
		u.familyName = e.FamilyName
		u.changedAt = e.ChangedAt
		u.changedBy = e.ChangedBy

	default:
		log.Printf("unknown event %T", e)
	}

	if !new {
		u.version++
	}
}

// Events returns the uncommitted events from the user aggregate.
func (u Aggregate) Events() []event.Event {
	return u.changes
}

// Version returns the last version of the aggregate before changes.
func (u Aggregate) Version() int {
	return u.version
}
