/*
 * Copyright © 2021 the contributors.
 *
 *  This file is part of the DaSCH Service Platform.
 *
 *  The DaSCH Service Platform is free software: you can
 *  redistribute it and/or modify it under the terms of the
 *  GNU Affero General Public License as published by the
 *  Free Software Foundation, either version 3 of the License,
 *  or (at your option) any later version.
 *
 *  The DaSCH Service Platform is distributed in the hope that
 *  it will be useful, but WITHOUT ANY WARRANTY; without even
 *  the implied warranty of MERCHANTABILITY or FITNESS FOR
 *  A PARTICULAR PURPOSE.  See the GNU Affero General Public
 *  License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public
 *  License along with the DaSCH Service Platform.  If not, see
 *  <http://www.gnu.org/licenses/>.
 *
 */

package entity

import (
	"time"
)

//Organization domain entity
type Organization struct {
	ID        ID
	Type      string
	Name      string
	Email     string
	Url       string
	CreatedAt time.Time
	UpdatedAt time.Time
	Addresses []ID
}

//NewOrganization create a new organization entity
func NewOrganization(name string) (*Organization, error) {
	org := &Organization{
		ID:        NewID(),
		Type:      "http://ns.dasch.swiss/repository#Organization",
		Name:      name,
		CreatedAt: time.Now(),
	}

	err := org.Validate()
	if err != nil {
		return nil, ErrInvalidEntity
	}

	return org, nil
}

//AddAddress add address to organization
func (org *Organization) AddAddress(id ID) error {
	_, err := org.GetAddress(id)
	if err == nil {
		return ErrAddressAlreadyAdded
	}
	org.Addresses = append(org.Addresses, id)
	org.UpdatedAt = time.Now()
	return nil
}

//RemoveAddress remove address from organization
func (org *Organization) RemoveAddress(id ID) error {
	for i, j := range org.Addresses {
		if j == id {
			org.Addresses = append(org.Addresses[:i], org.Addresses[i+1:]...)
			org.UpdatedAt = time.Now()
			return nil
		}
	}
	return ErrNotFound
}

//GetAddress get an address
func (org *Organization) GetAddress(id ID) (ID, error) {
	for _, v := range org.Addresses {
		if v == id {
			return id, nil
		}
	}
	return id, ErrNotFound
}

//Validate validate organization entity
func (org *Organization) Validate() error {
	if org.Name == "" {
		return ErrInvalidEntity
	}

	return nil
}
