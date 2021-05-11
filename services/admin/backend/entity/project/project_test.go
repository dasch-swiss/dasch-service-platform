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
	"testing"

	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/project"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/event"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/stretchr/testify/assert"
)

func TestProject_NewAggregate(t *testing.T) {

	expectedId, _ := valueobject.NewIdentifier()
	expectedAggregateType, _ := valueobject.NewAggregateType("http://ns.dasch.swiss/admin#Project")
	expectedShortCode, _ := valueobject.NewShortCode("psc")
	expectedShortName, _ := valueobject.NewShortName("short name")
	expectedLongName, _ := valueobject.NewLongName("project long name")
	expectedDescription, _ := valueobject.NewDescription("this is a test project")

	p := project.NewAggregate(expectedId, expectedShortCode, expectedShortName, expectedLongName, expectedDescription)
	assert.Equal(t, expectedId, p.ID())
	assert.Equal(t, expectedAggregateType, p.AggregateType())
	assert.Equal(t, expectedShortCode, p.ShortCode())
	assert.Equal(t, expectedShortName, p.ShortName())
	assert.Equal(t, expectedLongName, p.LongName())
	assert.Equal(t, expectedDescription, p.Description())

	assert.False(t, p.CreatedAt().Time().IsZero())
	assert.True(t, p.ChangedAt().Time().IsZero())

	projectEvents := p.Events()
	createdEvent := projectEvents[0]

	switch e := createdEvent.(type) {
	case *event.ProjectCreated:
		assert.Equal(t, expectedId, e.ID)
		assert.Equal(t, expectedShortCode, e.ShortCode)
		assert.Equal(t, expectedShortName, e.ShortName)
		assert.Equal(t, expectedLongName, e.LongName)
		assert.Equal(t, expectedDescription, e.Description)
	default:
		t.Fatalf("unexpected event type: %T", e)
	}
}

func TestProject_NewAggregateFromEvents(t *testing.T) {

	expectedId, _ := valueobject.NewIdentifier()
	expectedAggregateType, _ := valueobject.NewAggregateType("http://ns.dasch.swiss/admin#Project")
	expectedShortCode, _ := valueobject.NewShortCode("psc")
	expectedShortName, _ := valueobject.NewShortName("short name")
	expectedLongName, _ := valueobject.NewLongName("project long name")
	expectedDescription, _ := valueobject.NewDescription("this is a test project")
	expectedCreatedAt := valueobject.NewTimestamp()
	expectedCreatedBy, _ := valueobject.NewIdentifier()

	createEvent := &event.ProjectCreated{
		ID:          expectedId,
		ShortCode:   expectedShortCode,
		ShortName:   expectedShortName,
		LongName:    expectedLongName,
		Description: expectedDescription,
		CreatedAt:   expectedCreatedAt,
		CreatedBy:   expectedCreatedBy,
	}

	events := []event.Event{createEvent}
	print(events)

	p := project.NewAggregateFromEvents(events)
	assert.Equal(t, expectedId, p.ID())
	assert.Equal(t, expectedAggregateType, p.AggregateType())
	assert.Equal(t, expectedShortCode, p.ShortCode())
	assert.Equal(t, expectedShortName, p.ShortName())
	assert.Equal(t, expectedLongName, p.LongName())
	assert.Equal(t, expectedDescription, p.Description())

	assert.False(t, p.CreatedAt().Time().IsZero())
	assert.True(t, p.ChangedAt().Time().IsZero())
}

func TestProject_ChangeShortCode(t *testing.T) {

	expectedId, _ := valueobject.NewIdentifier()
	expectedAggregateType, _ := valueobject.NewAggregateType("http://ns.dasch.swiss/admin#Project")
	expectedShortCode, _ := valueobject.NewShortCode("psc")
	expectedShortName, _ := valueobject.NewShortName("short name")
	expectedLongName, _ := valueobject.NewLongName("project long name")
	expectedDescription, _ := valueobject.NewDescription("this is a test project")

	p := project.NewAggregate(expectedId, expectedShortCode, expectedShortName, expectedLongName, expectedDescription)
	assert.Equal(t, expectedId, p.ID())
	assert.Equal(t, expectedAggregateType, p.AggregateType())
	assert.Equal(t, expectedShortCode, p.ShortCode())
	assert.Equal(t, expectedShortName, p.ShortName())
	assert.Equal(t, expectedLongName, p.LongName())
	assert.Equal(t, expectedDescription, p.Description())

	assert.False(t, p.CreatedAt().Time().IsZero())
	assert.True(t, p.ChangedAt().Time().IsZero())

	projectEvents := p.Events()
	createdEvent := projectEvents[0]

	switch e := createdEvent.(type) {
	case *event.ProjectCreated:
		assert.Equal(t, expectedId, e.ID)
		assert.Equal(t, expectedShortCode, e.ShortCode)
		assert.Equal(t, expectedShortName, e.ShortName)
		assert.Equal(t, expectedLongName, e.LongName)
		assert.Equal(t, expectedDescription, e.Description)
	default:
		t.Fatalf("unexpected event type: %T", e)
	}

	newShortCode, _ := valueobject.NewShortCode("nsc")

	p.ChangeShortCode(newShortCode)

	assert.Len(t, p.Events(), 2)

	assert.Equal(t, newShortCode, p.ShortCode())

	shortCodeChangedEvent := p.Events()[1]

	switch e := shortCodeChangedEvent.(type) {
	case *event.ProjectShortCodeChanged:
		assert.Equal(t, newShortCode, e.ShortCode)
		assert.False(t, p.ChangedAt().Time().IsZero())
		assert.IsType(t, p.ChangedBy(), valueobject.Identifier{})
	default:
		t.Fatalf("unexpected event type: %T", e)
	}
}

func TestProject_ChangeShortName(t *testing.T) {

	expectedId, _ := valueobject.NewIdentifier()
	expectedAggregateType, _ := valueobject.NewAggregateType("http://ns.dasch.swiss/admin#Project")
	expectedShortCode, _ := valueobject.NewShortCode("psc")
	expectedShortName, _ := valueobject.NewShortName("short name")
	expectedLongName, _ := valueobject.NewLongName("project long name")
	expectedDescription, _ := valueobject.NewDescription("this is a test project")

	p := project.NewAggregate(expectedId, expectedShortCode, expectedShortName, expectedLongName, expectedDescription)
	assert.Equal(t, expectedId, p.ID())
	assert.Equal(t, expectedAggregateType, p.AggregateType())
	assert.Equal(t, expectedShortCode, p.ShortCode())
	assert.Equal(t, expectedShortName, p.ShortName())
	assert.Equal(t, expectedLongName, p.LongName())
	assert.Equal(t, expectedDescription, p.Description())

	assert.False(t, p.CreatedAt().Time().IsZero())
	assert.True(t, p.ChangedAt().Time().IsZero())

	projectEvents := p.Events()
	createdEvent := projectEvents[0]

	switch e := createdEvent.(type) {
	case *event.ProjectCreated:
		assert.Equal(t, expectedId, e.ID)
		assert.Equal(t, expectedShortCode, e.ShortCode)
		assert.Equal(t, expectedShortName, e.ShortName)
		assert.Equal(t, expectedLongName, e.LongName)
		assert.Equal(t, expectedDescription, e.Description)
	default:
		t.Fatalf("unexpected event type: %T", e)
	}

	newShortName, _ := valueobject.NewShortName("new short name")

	p.ChangeShortName(newShortName)

	assert.Len(t, p.Events(), 2)

	assert.Equal(t, newShortName, p.ShortName())

	shortNameChangedEvent := p.Events()[1]

	switch e := shortNameChangedEvent.(type) {
	case *event.ProjectShortNameChanged:
		assert.Equal(t, newShortName, e.ShortName)
		assert.False(t, p.ChangedAt().Time().IsZero())
		assert.IsType(t, p.ChangedBy(), valueobject.Identifier{})
	default:
		t.Fatalf("unexpected event type: %T", e)
	}
}

func TestProject_ChangeLongName(t *testing.T) {

	expectedId, _ := valueobject.NewIdentifier()
	expectedAggregateType, _ := valueobject.NewAggregateType("http://ns.dasch.swiss/admin#Project")
	expectedShortCode, _ := valueobject.NewShortCode("psc")
	expectedShortName, _ := valueobject.NewShortName("short name")
	expectedLongName, _ := valueobject.NewLongName("project long name")
	expectedDescription, _ := valueobject.NewDescription("this is a test project")

	p := project.NewAggregate(expectedId, expectedShortCode, expectedShortName, expectedLongName, expectedDescription)
	assert.Equal(t, expectedId, p.ID())
	assert.Equal(t, expectedAggregateType, p.AggregateType())
	assert.Equal(t, expectedShortCode, p.ShortCode())
	assert.Equal(t, expectedShortName, p.ShortName())
	assert.Equal(t, expectedLongName, p.LongName())
	assert.Equal(t, expectedDescription, p.Description())

	assert.False(t, p.CreatedAt().Time().IsZero())
	assert.True(t, p.ChangedAt().Time().IsZero())

	projectEvents := p.Events()
	createdEvent := projectEvents[0]

	switch e := createdEvent.(type) {
	case *event.ProjectCreated:
		assert.Equal(t, expectedId, e.ID)
		assert.Equal(t, expectedShortCode, e.ShortCode)
		assert.Equal(t, expectedShortName, e.ShortName)
		assert.Equal(t, expectedLongName, e.LongName)
		assert.Equal(t, expectedDescription, e.Description)
	default:
		t.Fatalf("unexpected event type: %T", e)
	}

	newLongName, _ := valueobject.NewLongName("new long name")

	p.ChangeLongName(newLongName)

	assert.Len(t, p.Events(), 2)

	assert.Equal(t, newLongName, p.LongName())

	longNameChangedEvent := p.Events()[1]

	switch e := longNameChangedEvent.(type) {
	case *event.ProjectLongNameChanged:
		assert.Equal(t, newLongName, e.LongName)
		assert.False(t, p.ChangedAt().Time().IsZero())
		assert.IsType(t, p.ChangedBy(), valueobject.Identifier{})
	default:
		t.Fatalf("unexpected event type: %T", e)
	}
}

func TestProject_ChangeDescription(t *testing.T) {

	expectedId, _ := valueobject.NewIdentifier()
	expectedAggregateType, _ := valueobject.NewAggregateType("http://ns.dasch.swiss/admin#Project")
	expectedShortCode, _ := valueobject.NewShortCode("psc")
	expectedShortName, _ := valueobject.NewShortName("short name")
	expectedLongName, _ := valueobject.NewLongName("project long name")
	expectedDescription, _ := valueobject.NewDescription("this is a test project")

	p := project.NewAggregate(expectedId, expectedShortCode, expectedShortName, expectedLongName, expectedDescription)
	assert.Equal(t, expectedId, p.ID())
	assert.Equal(t, expectedAggregateType, p.AggregateType())
	assert.Equal(t, expectedShortCode, p.ShortCode())
	assert.Equal(t, expectedShortName, p.ShortName())
	assert.Equal(t, expectedLongName, p.LongName())
	assert.Equal(t, expectedDescription, p.Description())

	assert.False(t, p.CreatedAt().Time().IsZero())
	assert.True(t, p.ChangedAt().Time().IsZero())

	projectEvents := p.Events()
	createdEvent := projectEvents[0]

	switch e := createdEvent.(type) {
	case *event.ProjectCreated:
		assert.Equal(t, expectedId, e.ID)
		assert.Equal(t, expectedShortCode, e.ShortCode)
		assert.Equal(t, expectedShortName, e.ShortName)
		assert.Equal(t, expectedLongName, e.LongName)
		assert.Equal(t, expectedDescription, e.Description)
	default:
		t.Fatalf("unexpected event type: %T", e)
	}

	newDescription, _ := valueobject.NewDescription("new description")

	p.ChangeDescription(newDescription)

	assert.Len(t, p.Events(), 2)

	assert.Equal(t, newDescription, p.Description())

	descriptionChangedEvent := p.Events()[1]

	switch e := descriptionChangedEvent.(type) {
	case *event.ProjectDescriptionChanged:
		assert.Equal(t, newDescription, e.Description)
		assert.False(t, p.ChangedAt().Time().IsZero())
		assert.IsType(t, p.ChangedBy(), valueobject.Identifier{})
	default:
		t.Fatalf("unexpected event type: %T", e)
	}
}

func TestProject_DeleteProject(t *testing.T) {

	expectedId, _ := valueobject.NewIdentifier()
	expectedAggregateType, _ := valueobject.NewAggregateType("http://ns.dasch.swiss/admin#Project")
	expectedShortCode, _ := valueobject.NewShortCode("psc")
	expectedShortName, _ := valueobject.NewShortName("short name")
	expectedLongName, _ := valueobject.NewLongName("project long name")
	expectedDescription, _ := valueobject.NewDescription("this is a test project")

	p := project.NewAggregate(expectedId, expectedShortCode, expectedShortName, expectedLongName, expectedDescription)
	assert.Equal(t, expectedId, p.ID())
	assert.Equal(t, expectedAggregateType, p.AggregateType())
	assert.Equal(t, expectedShortCode, p.ShortCode())
	assert.Equal(t, expectedShortName, p.ShortName())
	assert.Equal(t, expectedLongName, p.LongName())
	assert.Equal(t, expectedDescription, p.Description())

	assert.False(t, p.CreatedAt().Time().IsZero())
	assert.True(t, p.ChangedAt().Time().IsZero())

	projectEvents := p.Events()
	createdEvent := projectEvents[0]

	switch e := createdEvent.(type) {
	case *event.ProjectCreated:
		assert.Equal(t, expectedId, e.ID)
		assert.Equal(t, expectedShortCode, e.ShortCode)
		assert.Equal(t, expectedShortName, e.ShortName)
		assert.Equal(t, expectedLongName, e.LongName)
		assert.Equal(t, expectedDescription, e.Description)
	default:
		t.Fatalf("unexpected event type: %T", e)
	}

	p.DeleteProject(p.ID())

	assert.Len(t, p.Events(), 2)

	projectDeletedEvent := p.Events()[1]

	switch e := projectDeletedEvent.(type) {
	case *event.ProjectDeleted:
		assert.Equal(t, p.ID(), e.ID)
		assert.False(t, p.DeletedAt().Time().IsZero())
		assert.IsType(t, p.DeletedBy(), valueobject.Identifier{})
	default:
		t.Fatalf("unexpected event type: %T", e)
	}

	newShortCode, _ := valueobject.NewShortCode("nsc")

	// this should fail because the project has been deleted
	err := p.ChangeShortCode(newShortCode)

	// assert that no new event was created
	assert.Len(t, p.Events(), 2)

	// assert that an error was returned from the ChangeShortCode function
	assert.Equal(t, err, project.ErrProjectHasBeenDeleted)
}
