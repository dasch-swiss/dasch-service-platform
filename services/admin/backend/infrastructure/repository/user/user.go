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

package user

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/EventStore/EventStore-Client-Go/client"
	"github.com/EventStore/EventStore-Client-Go/direction"
	"github.com/EventStore/EventStore-Client-Go/messages"
	"github.com/EventStore/EventStore-Client-Go/streamrevision"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/user"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/event"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/gofrs/uuid"
	"log"
	"time"
)

//useresdb holds the client to the eventstoredb
type userRepository struct {
	c *client.Client
}

//NewUserRepository creates a new user eventstoredb repository implementation.
func NewUserRepository(client *client.Client) *userRepository {
	return &userRepository{
		c: client,
	}
}

//Save user events
func (r *userRepository) Save(ctx context.Context, u *user.Aggregate) (valueobject.Identifier, error) {

	var proposedEvents []messages.ProposedEvent

	for _, ev := range u.Events() {
		switch e := ev.(type) {
		case *event.UserCreated:
			j, err := json.Marshal(e)
			if err != nil {
				return e.ID, fmt.Errorf("problem serializing '%T' event to json", e)
			}

			eventID, _ := uuid.NewV4()
			pe := messages.ProposedEvent{
				EventID:      eventID,
				EventType:    "UserCreated",
				ContentType:  "application/json",
				Data:         j,
				UserMetadata: nil,
			}

			proposedEvents = append(proposedEvents, pe)

		case *event.UserUsernameChanged:
			j, err := json.Marshal(e)
			if err != nil {
				return e.ID, fmt.Errorf("problem serializing '%T' event to json", e)
			}

			eventID, _ := uuid.NewV4()
			pe := messages.ProposedEvent{
				EventID:      eventID,
				EventType:    "UserUsernameChanged",
				ContentType:  "application/json",
				Data:         j,
				UserMetadata: nil,
			}

			proposedEvents = append(proposedEvents, pe)

		case *event.UserEmailChanged:
			j, err := json.Marshal(e)
			if err != nil {
				return e.ID, fmt.Errorf("problem serializing '%T' event to json", e)
			}

			eventID, _ := uuid.NewV4()
			pe := messages.ProposedEvent{
				EventID:      eventID,
				EventType:    "UserEmailChanged",
				ContentType:  "application/json",
				Data:         j,
				UserMetadata: nil,
			}

			proposedEvents = append(proposedEvents, pe)

		case *event.UserPasswordChanged:
			j, err := json.Marshal(e)
			if err != nil {
				return e.ID, fmt.Errorf("problem serializing '%T' event to json", e)
			}

			eventID, _ := uuid.NewV4()
			pe := messages.ProposedEvent{
				EventID:      eventID,
				EventType:    "UserPasswordChanged",
				ContentType:  "application/json",
				Data:         j,
				UserMetadata: nil,
			}

			proposedEvents = append(proposedEvents, pe)

		case *event.UserGivenNameChanged:
			j, err := json.Marshal(e)
			if err != nil {
				return e.ID, fmt.Errorf("problem serializing '%T' event to json", e)
			}

			eventID, _ := uuid.NewV4()
			pe := messages.ProposedEvent{
				EventID:      eventID,
				EventType:    "UserGivenNameChanged",
				ContentType:  "application/json",
				Data:         j,
				UserMetadata: nil,
			}

			proposedEvents = append(proposedEvents, pe)

		case *event.UserFamilyNameChanged:
			j, err := json.Marshal(e)
			if err != nil {
				return e.ID, fmt.Errorf("problem serializing '%T' event to json", e)
			}

			eventID, _ := uuid.NewV4()
			pe := messages.ProposedEvent{
				EventID:      eventID,
				EventType:    "UserFamilyNameChanged",
				ContentType:  "application/json",
				Data:         j,
				UserMetadata: nil,
			}

			proposedEvents = append(proposedEvents, pe)
		}
	}

	streamID := "User-" + u.ID().String()
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
	defer cancel()

	_, err := r.c.AppendToStream(ctx, streamID, streamrevision.StreamRevisionNoStream, proposedEvents)
	if err != nil {
		log.Fatalf("Unexpected failure %+v", err)
	}

	log.Printf("proposed events appended: %+v", proposedEvents)

	return u.ID(), nil
}

//Load user events from event store and return aggregate.
func (r *userRepository) Load(ctx context.Context, id valueobject.Identifier) (*user.Aggregate, error) {
	streamID := "User-" + id.String()
	recordedEvents, err := r.c.ReadStreamEvents(ctx, direction.Forwards, streamID, streamrevision.StreamRevisionStart, 1, false)
	if err != nil {
		log.Fatalf("Unexpected failure %+v", err)
	}

	var events []event.Event

	for _, record := range recordedEvents {
		switch eventType := record.EventType; eventType {
		case "UserCreated":
			var e event.UserCreated
			err := json.Unmarshal(record.Data, &e)
			if err != nil {
				return &user.Aggregate{}, fmt.Errorf("problem deserializing '%s' event from json", record.EventType)
			}
			log.Println(">>>>>>>>>>>>>>>")
			log.Print(e)
			log.Println(">>>>>>>>>>>>>>>")
			events = append(events, &e)
		default:
			log.Printf("unexpected event type: %T", eventType)
		}

	}

	log.Print(events)

	return user.NewAggregateFromEvents(events), nil
}
