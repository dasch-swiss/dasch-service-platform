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

package testing

import (
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"
)

//inmem in memory repo
type userinmemdb struct {
	m map[entity.ID]*entity.User
}

//NewInmem create a new in memory repository
func NewUserInmemDB() *userinmemdb {
	var m = map[entity.ID]*entity.User{}
	return &userinmemdb{
		m: m,
	}
}

//Create an user
func (r *userinmemdb) Create(e *entity.User) (entity.ID, error) {
	r.m[e.ID] = e
	return e.ID, nil
}

//Get an organization
func (r *userinmemdb) Get(id entity.ID) (*entity.User, error) {
	if r.m[id] == nil {
		return nil, entity.ErrNotFound
	}
	return r.m[id], nil
}
