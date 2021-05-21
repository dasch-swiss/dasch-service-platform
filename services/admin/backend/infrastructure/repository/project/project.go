/*
 *  Copyright 2021 Data and Service Center for the Humanities - DaSCH.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package project

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/EventStore/EventStore-Client-Go/position"
	"log"
	"time"

	"github.com/EventStore/EventStore-Client-Go/client"
	"github.com/EventStore/EventStore-Client-Go/direction"
	"github.com/EventStore/EventStore-Client-Go/messages"
	"github.com/EventStore/EventStore-Client-Go/streamrevision"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/project"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/event"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/gofrs/uuid"
)

type projectRepository struct {
	c *client.Client
}

func NewProjectRepository(client *client.Client) *projectRepository {
	return &projectRepository{
		c: client,
	}
}

func (r *projectRepository) Save(ctv context.Context, p *project.Aggregate) (valueobject.Identifier, error) {
	var proposedEvents []messages.ProposedEvent
	streamRevision := streamrevision.StreamRevisionStreamExists

	for _, ev := range p.Events() {
		switch e := ev.(type) {
		case *event.ProjectCreated:
			j, err := json.Marshal(e)
			if err != nil {
				return e.ID, fmt.Errorf("problem serializing '%T' event to json", e)
			}

			eventID, _ := uuid.NewV4()
			pe := messages.ProposedEvent{
				EventID:     eventID,
				EventType:   "ProjectCreated",
				ContentType: "application/json",
				Data:        j,
			}

			proposedEvents = append(proposedEvents, pe)
			streamRevision = streamrevision.StreamRevisionNoStream

		case *event.ProjectChanged:
			j, err := json.Marshal(e)
			if err != nil {
				return e.ID, fmt.Errorf("problem serializing '%T' event to json", e)
			}

			eventID, _ := uuid.NewV4()
			pe := messages.ProposedEvent{
				EventID:     eventID,
				EventType:   "ProjectChanged",
				ContentType: "application/json",
				Data:        j,
			}

			proposedEvents = append(proposedEvents, pe)

		case *event.ProjectDeleted:
			j, err := json.Marshal(e)
			if err != nil {
				return e.ID, fmt.Errorf("problem serializing '%T' event to json", e)
			}

			eventID, _ := uuid.NewV4()
			pe := messages.ProposedEvent{
				EventID:     eventID,
				EventType:   "ProjectDeleted",
				ContentType: "application/json",
				Data:        j,
			}

			proposedEvents = append(proposedEvents, pe)
		}

	}

	streamID := "Project-" + p.ID().String()
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
	defer cancel()

	_, err := r.c.AppendToStream(ctx, streamID, streamRevision, proposedEvents)
	if err != nil {
		log.Fatalf("Unexpected failure %+v", err)
	}

	return p.ID(), nil
}

func (r *projectRepository) Load(ctx context.Context, id valueobject.Identifier) (*project.Aggregate, error) {
	streamID := "Project-" + id.String()

	// TODO: figure out the correct way to replay all the events, currently hardcoded to replay the last 1000 events
	recordedEvents, err := r.c.ReadStreamEvents(ctx, direction.Forwards, streamID, streamrevision.StreamRevisionStart, 1000, false)
	if err != nil {
		log.Printf("Unexpected failure %+v", err)
		return &project.Aggregate{}, project.ErrNotFound
	}

	var events []event.Event

	for _, record := range recordedEvents {
		switch eventType := record.EventType; eventType {
		case "ProjectCreated":
			var e event.ProjectCreated
			err := json.Unmarshal(record.Data, &e)
			if err != nil {
				return &project.Aggregate{}, fmt.Errorf("problem deserializing '%s' event from json", record.EventType)
			}
			events = append(events, &e)
		case "ProjectChanged":
			var e event.ProjectChanged
			err := json.Unmarshal(record.Data, &e)
			if err != nil {
				return &project.Aggregate{}, fmt.Errorf("problem deserializing '%s' event from json", record.EventType)
			}
			events = append(events, &e)
		case "ProjectDeleted":
			var e event.ProjectDeleted
			err := json.Unmarshal(record.Data, &e)
			if err != nil {
				return &project.Aggregate{}, fmt.Errorf("problem deserializing '%s' event from json", record.EventType)
			}
			events = append(events, &e)
		default:
			log.Printf("unexpected event type: %T", eventType)
		}

	}

	return project.NewAggregateFromEvents(events), nil
}

func (r *projectRepository) GetProjectIds(ctx context.Context, returnDeletedProjects bool) ([]valueobject.Identifier, error) {
	numberOfEventsToRead := 1000
	numberOfEvents := uint64(numberOfEventsToRead)

	recordedEvents, err := r.c.ReadAllEvents(ctx, direction.Forwards, position.StartPosition, numberOfEvents, true)
	if err != nil {
		log.Printf("Unexpected failure %+v", err)
		return nil, err
	}

	var projectIds []valueobject.Identifier

	// filter to select only ProjectCreated events
	for _, record := range recordedEvents {
		switch eventType := record.EventType; eventType {
		case "ProjectCreated":
			var e event.ProjectCreated
			err := json.Unmarshal(record.Data, &e)
			if err != nil {
				return []valueobject.Identifier{}, fmt.Errorf("problem deserializing '%s' event from json", record.EventType)
			}
			projectIds = append(projectIds, e.ID)
		case "ProjectDeleted":
			var e event.ProjectDeleted
			err := json.Unmarshal(record.Data, &e)
			if err != nil {
				return []valueobject.Identifier{}, fmt.Errorf("problem deserializing '%s' event from json", record.EventType)
			}
			if !returnDeletedProjects { // if deleted project should not be returned
				for i := range projectIds { // loop through the project ids
					if projectIds[i] == e.ID { // if a deleted project is found among the project ids
						projectIds = append(projectIds[:i], projectIds[i+1:]...) // remove it
					}
				}
			}
		}
	}

	return projectIds, nil
}
