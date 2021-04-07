/*
 * Copyright 2021 Data and Service Center for the Humanities - DaSCH.
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

package eventstore

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/EventStore/EventStore-Client-Go/client"
	"github.com/EventStore/EventStore-Client-Go/messages"
	"github.com/EventStore/EventStore-Client-Go/streamrevision"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/event"
	"github.com/gofrs/uuid"
	"log"
	"time"
)

//useresdb holds the client to the eventstoredb
type useresdb struct {
	esdb *client.Client
}

//NewUserESDB creates a new user centric eventstoredb repository implementation.
func NewUserESDB(client *client.Client) *useresdb {
	return &useresdb{
		esdb: client,
	}
}

//Create an user
func (r *useresdb) Create(e *entity.User) (entity.ID, error) {

	userCreatedEvent := &event.UserCreated{
		ID:         e.ID,
		Username:   e.Username,
		Email:      e.Email,
		Password:   e.Password,
		GivenName:  e.GivenName,
		FamilyName: e.FamilyName,
		CreatedAt:  e.CreatedAt,
	}

	j, err := json.Marshal(userCreatedEvent)
	if err != nil {
		return e.ID, errors.New("problem serializing event to json")
	}

	eventID, _ := uuid.NewV4()
	proposedUserCreatedEvent := messages.ProposedEvent{
		EventID:      eventID,
		EventType:    "UserCreated",
		ContentType:  "application/json",
		Data:         j,
		UserMetadata: nil,
	}

	proposedEvents := []messages.ProposedEvent{
		proposedUserCreatedEvent,
	}

	streamID := "User-" + e.ID.String()
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
	defer cancel()

	_, err = r.esdb.AppendToStream(ctx, streamID, streamrevision.StreamRevisionNoStream, proposedEvents)

	log.Print("event appended")

	if err != nil {
		log.Fatalf("Unexpected failure %+v", err)
	}

	return e.ID, nil
}

//Get a user entity from event store.
func (r *useresdb) Get(id entity.ID) (*entity.User, error) {
	return nil, nil
}
