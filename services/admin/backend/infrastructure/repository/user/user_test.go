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
	"github.com/EventStore/EventStore-Client-Go/direction"
	"github.com/EventStore/EventStore-Client-Go/streamrevision"
	userEntity "github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/user"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/infrastructure/repository/user"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestUser_Save(t *testing.T) {
	container := GetEmptyDatabase()
	defer container.Close()

	c := CreateTestClient(container, t)
	defer c.Close()

	r := user.NewUserRepository(c)

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
	defer cancel()

	expectedId, err := valueobject.NewIdentifier()
	expectedUsername, _ := valueobject.NewUsername("dduck")
	expectedEmail, _ := valueobject.NewEmail("dduck@example.com")
	expectedPassword, _ := valueobject.NewPassword("secret")
	expectedGivenName, _ := valueobject.NewGivenName("Donald")
	expectedFamilyName, _ := valueobject.NewFamilyName("Duck")

	// create new user
	expectedUser := userEntity.NewAggregate(expectedId, expectedUsername, expectedEmail, expectedPassword, expectedGivenName, expectedFamilyName)

	// save event to event store
	_, err = r.Save(ctx, expectedUser)
	assert.Nil(t, err)

	// retrieve events from event store
	streamID := "User-" + expectedId.String()
	recordedEvents, err := c.ReadStreamEvents(ctx, direction.Forwards, streamID, streamrevision.StreamRevisionStart, 1, false)
	if err != nil {
		t.Fatalf("Unexpected failure %+v", err)
	}

	// see if the recorded event is of the type we expect to have
	assert.Equal(t, "UserCreated", recordedEvents[0].EventType)

	// create a user from the recorded event
	//var events []event.Event
	//var event event.UserCreated
	//err = json.Unmarshal(recordedEvents[0].Data, &event)
	//if err != nil {
	//	t.Fatalf("Unexpected failure %+v", err)
	//}
	//events = append(events, event)
	//userFromEvents := userEntity.NewAggregateFromEvents(events)

	userFromEvents, err := r.Load(ctx, expectedId)
	if err != nil {
		t.Fatalf("Unexpected failure %+v", err)
	}

	// check if our initially created user is the same as the user created from events
	assert.Equal(t, expectedUser.ID(), userFromEvents.ID())
	assert.Equal(t, expectedUser.AggregateType(), userFromEvents.AggregateType())
	assert.Equal(t, expectedUser.Username(), userFromEvents.Username())
	assert.Equal(t, expectedUser.Email(), userFromEvents.Email())
	assert.Equal(t, expectedUser.Password(), userFromEvents.Password())
	assert.Equal(t, expectedUser.GivenName(), userFromEvents.GivenName())
	assert.Equal(t, expectedUser.FamilyName(), userFromEvents.FamilyName())
	assert.Equal(t, expectedUser.CreatedAt().Unix(), userFromEvents.CreatedAt().Unix())
	assert.Equal(t, expectedUser.CreatedBy(), userFromEvents.CreatedBy())
}

func TestUser_Load(t *testing.T) {

}
