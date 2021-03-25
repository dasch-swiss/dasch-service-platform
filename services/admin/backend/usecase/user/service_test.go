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

package organization_test

import (
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"
	userUsecase "github.com/dasch-swiss/dasch-service-platform/services/admin/backend/usecase/user"
	testing2 "github.com/dasch-swiss/dasch-service-platform/services/metadata/backend/usecase/user/testing"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func newFixtureUser() *entity.User {
	return &entity.User{
		ID:        entity.NewID(),
		Type: "http://ns.dasch.swiss/admin#User",
		Username:   "dduck",
		Email:      "dduck@example.com",
		Password:   "secret",
		GivenName:  "Donald",
		FamilyName: "Duck",
		CreatedAt:  time.Now(),
	}
}

func TestService_SignupUser(t *testing.T) {
	repo := testing2.NewUserInmemDB()
	service := userUsecase.NewService(repo)
	u := newFixtureUser()
	uid, err := service.SignupUser(u.Username, u.Email, u.Password, u.GivenName, u.FamilyName)
	assert.Nil(t, err)

	foundUser, err := service.GetUser(uid)
	assert.Nil(t,err)
	assert.Equal(t, u.Username, foundUser.Username)
	assert.Equal(t, u.Email, foundUser.Email)
	assert.Equal(t, u.Password, foundUser.Password)
	assert.Equal(t, u.GivenName, foundUser.GivenName)
	assert.Equal(t, u.FamilyName, foundUser.FamilyName)
}
