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

package project_test

import (
	"context"
	"testing"
	"time"

	"github.com/EventStore/EventStore-Client-Go/direction"
	"github.com/EventStore/EventStore-Client-Go/streamrevision"
	projectEntity "github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/project"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/infrastructure/repository/project"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/stretchr/testify/assert"
)

func TestProject_Save(t *testing.T) {
	container := GetEmptyDatabase()
	defer container.Close()

	c := CreateTestClient(container, t)
	defer c.Close()

	r := project.NewProjectRepository(c)

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
	defer cancel()

	expectedId, err := valueobject.NewIdentifier()
	expectedShortCode, _ := valueobject.NewShortCode("psc")
	expectedShortName, _ := valueobject.NewShortName("short name")
	expectedLongName, _ := valueobject.NewLongName("project long name")
	expectedDescription, _ := valueobject.NewDescription("project description")

	// create new project
	expectedProject := projectEntity.NewAggregate(expectedId, expectedShortCode, expectedShortName, expectedLongName, expectedDescription)

	// save event to event store
	_, err = r.Save(ctx, expectedProject)
	assert.Nil(t, err)

	// retrieve events from event store
	streamID := "Project-" + expectedId.String()
	recordedEvents, err := c.ReadStreamEvents(ctx, direction.Forwards, streamID, streamrevision.StreamRevisionStart, 1, false)
	if err != nil {
		t.Fatalf("Unexpected failure %+v", err)
	}

	// see if the recorded event is of the type we expect to have
	assert.Equal(t, "ProjectCreated", recordedEvents[0].EventType)

	projectFromEvents, err := r.Load(ctx, expectedId)
	if err != nil {
		t.Fatalf("Unexpected failure %+v", err)
	}

	// check if our initially created project is the same as the project created from events
	assert.Equal(t, expectedProject.ID(), projectFromEvents.ID())
	assert.Equal(t, expectedProject.AggregateType(), projectFromEvents.AggregateType())
	assert.Equal(t, expectedProject.ShortCode(), projectFromEvents.ShortCode())
	assert.Equal(t, expectedProject.ShortName(), projectFromEvents.ShortName())
	assert.Equal(t, expectedProject.LongName(), projectFromEvents.LongName())
	assert.Equal(t, expectedProject.Description(), projectFromEvents.Description())
	assert.Equal(t, expectedProject.CreatedAt().Unix(), projectFromEvents.CreatedAt().Unix())
	assert.Equal(t, expectedProject.CreatedBy(), projectFromEvents.CreatedBy())

	projectCreationEvents, err := r.GetProjectIds(ctx)
	if err != nil {
		t.Fatalf("Unexpected failure %+v", err)
	}

	assert.Len(t, projectCreationEvents, 1)
}
