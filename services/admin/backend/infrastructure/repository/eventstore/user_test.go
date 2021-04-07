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

package eventstore_test

import (
	"context"
	"encoding/json"
	"github.com/EventStore/EventStore-Client-Go/direction"
	"github.com/EventStore/EventStore-Client-Go/streamrevision"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/event"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/infrastructure/repository/eventstore"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestUser_Create(t *testing.T) {
	container := GetEmptyDatabase()
	defer container.Close()

	c := CreateTestClient(container, t)
	defer c.Close()

	// c := CreateLocalhostTestClient(t)
	// defer c.Close()

	e, _ := entity.NewUser("dduck", "dduck@example.com", "secret", "donald", "duck")

	udb := eventstore.NewUserESDB(c)

	_, err := udb.Create(e)
	assert.Nil(t, err)

	streamID := "User-" + e.ID.String()
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
	defer cancel()
	events, err := c.ReadStreamEvents(ctx, direction.Forwards, streamID, streamrevision.StreamRevisionStart, 1, false)

	if err != nil {
		t.Fatalf("Unexpected failure %+v", err)
	}

	assert.Equal(t, "UserCreated", events[0].EventType)

	expectedData := &event.UserCreated{
		ID:         e.ID,
		Username:   e.Username,
		Email:      e.Email,
		Password:   e.Password,
		GivenName:  e.GivenName,
		FamilyName: e.FamilyName,
		CreatedAt:  e.CreatedAt,
	}
	expectedDataSerialized, err := json.Marshal(expectedData)
	assert.Equal(t, expectedDataSerialized, events[0].Data)
}
