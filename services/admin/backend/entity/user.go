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
	"time"
)

//User domain entity
type User struct {
	ID         ID
	Type       string
	Username   string
	Email      string
	Password   string
	GivenName  string
	FamilyName string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

//NewUser create a new user entity
func NewUser(username string, email string, password string, givenname string, familyname string) (*User, error) {
	user := &User{
		ID:         NewID(),
		Type: "http://ns.dasch.swiss/admin#User",
		Username:   username,
		Email:      email,
		Password:   password,
		GivenName:  givenname,
		FamilyName: familyname,
		CreatedAt:  time.Now(),
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
