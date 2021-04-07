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

package entity

import (
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/event"
	"time"
)

//User domain entity
//TODO: exchange strings for value objects
type User struct {
	id            ID
	aggregateType string
	username      string
	email         string
	password      string
	givenName     string
	familyName    string
	createdAt     time.Time
	createdBy     ID
	updatedAt     time.Time
	updatedBy     ID

	changes []event.Event
	version int
}

// NewUserFromEvents is a helper method that creates a new user
// from a series of events.
func NewUserFromEvents(events []event.Event) *User {
	u := &User{}

	for _, event := range events {
		u.On(event, false)
	}

	return u
}

// 
func (u User) AggregateType() string {
	return u.aggregateType
}

//NewUser create a new user entity
func NewUser(username string, email string, password string, givenname string, familyname string) (*User, error) {
	user := &User{
		id:         NewID(),
		atype:      "http://ns.dasch.swiss/admin#User",
		username:   username,
		email:      email,
		password:   password,
		givenName:  givenname,
		familyName: familyname,
		createdAt:  time.Now(),
	}

	err := user.Validate()
	if err != nil {
		return nil, ErrInvalidEntity
	}

	return user, nil
}

//Validate validate user entity
func (user *User) Validate() error {

	if user.Username == "" {
		return ErrInvalidEntity
	}

	if user.Email == "" {
		return ErrInvalidEntity
	}

	if user.Password == "" {
		return ErrInvalidEntity
	}

	if user.GivenName == "" {
		return ErrInvalidEntity
	}

	if user.FamilyName == "" {
		return ErrInvalidEntity
	}

	return nil
}
