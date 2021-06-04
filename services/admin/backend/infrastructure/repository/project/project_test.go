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

func TestProjectRepository_Save(t *testing.T) {
	container := GetEmptyDatabase()
	defer container.Close()

	c := CreateTestClient(container, t)
	defer c.Close()

	r := project.NewProjectRepository(c)

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
	defer cancel()

	id, err := valueobject.NewIdentifier()
	shortCode, _ := valueobject.NewShortCode("00FF")
	shortName, _ := valueobject.NewShortName("short name")
	longName, _ := valueobject.NewLongName("project long name")
	description, _ := valueobject.NewDescription("project description")

	// create new project
	expectedProject := projectEntity.NewAggregate(id, shortCode, shortName, longName, description)

	// save event to event store
	_, err = r.Save(ctx, expectedProject)
	assert.Nil(t, err)

	// retrieve events from event store
	streamID := "Project-" + id.String()
	recordedEvents, err := c.ReadStreamEvents(ctx, direction.Forwards, streamID, streamrevision.StreamRevisionStart, 1, false)
	if err != nil {
		t.Fatalf("Unexpected failure %+v", err)
	}

	// see if the recorded event is of the type we expect to have
	assert.Equal(t, "ProjectCreated", recordedEvents[0].EventType)
}

func TestProjectRepository_Load(t *testing.T) {
	container := GetEmptyDatabase()
	defer container.Close()

	c := CreateTestClient(container, t)
	defer c.Close()

	r := project.NewProjectRepository(c)

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
	defer cancel()

	id, _ := valueobject.NewIdentifier()
	shortCode, _ := valueobject.NewShortCode("00FF")
	shortName, _ := valueobject.NewShortName("short name")
	longName, _ := valueobject.NewLongName("project long name")
	description, _ := valueobject.NewDescription("project description")

	// create new project
	project := projectEntity.NewAggregate(id, shortCode, shortName, longName, description)

	// save event to event store
	r.Save(ctx, project)

	// load project from event store events
	projectFromEvents, err := r.Load(ctx, id)
	if err != nil {
		t.Fatalf("Unexpected failure %+v", err)
	}

	// check if our initially created project is the same as the project created from events
	assert.Equal(t, project.ID(), projectFromEvents.ID())
	assert.Equal(t, project.AggregateType(), projectFromEvents.AggregateType())
	assert.Equal(t, project.ShortCode(), projectFromEvents.ShortCode())
	assert.Equal(t, project.ShortName(), projectFromEvents.ShortName())
	assert.Equal(t, project.LongName(), projectFromEvents.LongName())
	assert.Equal(t, project.Description(), projectFromEvents.Description())
	assert.Equal(t, project.CreatedAt().Unix(), projectFromEvents.CreatedAt().Unix())
	assert.Equal(t, project.CreatedBy(), projectFromEvents.CreatedBy())
}

func TestProjectRepository_GetProjectIds(t *testing.T) {
	container := GetEmptyDatabase()
	defer container.Close()

	c := CreateTestClient(container, t)
	defer c.Close()

	r := project.NewProjectRepository(c)

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
	defer cancel()

	id, _ := valueobject.NewIdentifier()
	shortCode, _ := valueobject.NewShortCode("00FF")
	shortName, _ := valueobject.NewShortName("short name")
	longName, _ := valueobject.NewLongName("project long name")
	description, _ := valueobject.NewDescription("project description")

	// create new project
	project := projectEntity.NewAggregate(id, shortCode, shortName, longName, description)

	// save event to event store
	r.Save(ctx, project)

	// get list of project ids
	projectIds, err := r.GetProjectIds(ctx, false)
	if err != nil {
		t.Fatalf("Unexpected failure %+v", err)
	}

	assert.Len(t, projectIds, 1)
}
