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
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/user"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/event"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestUser_NewAggregate(t *testing.T) {

	expectedId, _ := valueobject.NewIdentifier()
	expectedAggregateType, _ := valueobject.NewAggregateType("http://ns.dasch.swiss/admin#User")
	expectedUsername, _ := valueobject.NewUsername("dduck")
	expectedEmail, _ := valueobject.NewEmail("dduck@example.com")
	expectedPassword, _ := valueobject.NewPassword("secret")
	expectedGivenName, _ := valueobject.NewGivenName("Donald")
	expectedFamilyName, _ := valueobject.NewFamilyName("Duck")

	u := user.NewAggregate(expectedId, expectedUsername, expectedEmail, expectedPassword, expectedGivenName, expectedFamilyName)
	assert.Equal(t, expectedId, u.ID())
	assert.Equal(t, expectedAggregateType, u.AggregateType())
	assert.Equal(t, expectedUsername, u.Username())
	assert.Equal(t, expectedEmail, u.Email())
	assert.Equal(t, expectedPassword, u.Password())
	assert.Equal(t, expectedGivenName, u.GivenName())
	assert.Equal(t, expectedFamilyName, u.FamilyName())

	assert.False(t, u.CreatedAt().Time().IsZero())
	assert.True(t, u.ChangedAt().Time().IsZero())

	userEvents := u.Events()
	createdEvent := userEvents[0]

	switch e := createdEvent.(type) {
	case *event.UserCreated:
		assert.Equal(t, expectedId, e.ID)
		assert.Equal(t, expectedUsername, e.Username)
		assert.Equal(t, expectedEmail, e.Email)
		assert.Equal(t, expectedPassword, e.Password)
		assert.Equal(t, expectedGivenName, e.GivenName)
		assert.Equal(t, expectedFamilyName, e.FamilyName)
	default:
		t.Fatalf("unexpected event type: %T", e)
	}
}

func TestUser_NewAggregateFromEvents(t *testing.T) {

	expectedId, _ := valueobject.NewIdentifier()
	expectedAggregateType, _ := valueobject.NewAggregateType("http://ns.dasch.swiss/admin#User")
	expectedUsername, _ := valueobject.NewUsername("dduck")
	expectedEmail, _ := valueobject.NewEmail("dduck@example.com")
	expectedPassword, _ := valueobject.NewPassword("secret")
	expectedGivenName, _ := valueobject.NewGivenName("Donald")
	expectedFamilyName, _ := valueobject.NewFamilyName("Duck")
	expextedCreatedAt := valueobject.NewTimestamp()
	expectedCreatedBy, _ := valueobject.NewIdentifier()

	createEvent := &event.UserCreated{
		ID:         expectedId,
		Username:   expectedUsername,
		Email:      expectedEmail,
		Password:   expectedPassword,
		GivenName:  expectedGivenName,
		FamilyName: expectedFamilyName,
		CreatedAt:  expextedCreatedAt,
		CreatedBy:  expectedCreatedBy,
	}

	events := []event.Event{createEvent}
	print(events)

	u := user.NewAggregateFromEvents(events)
	print(u)
	assert.Equal(t, expectedId, u.ID())
	assert.Equal(t, expectedAggregateType, u.AggregateType())
	assert.Equal(t, expectedUsername, u.Username())
	assert.Equal(t, expectedEmail, u.Email())
	assert.Equal(t, expectedPassword, u.Password())
	assert.Equal(t, expectedGivenName, u.GivenName())
	assert.Equal(t, expectedFamilyName, u.FamilyName())

	assert.False(t, u.CreatedAt().Time().IsZero())
	assert.True(t, u.ChangedAt().Time().IsZero())
}
