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

//postalAddress domain entity
type postalAddress struct {
	StreetAddress   string
	PostalCode      string
	AddressLocality string
}

//Organization domain entity
type Organization struct {
	ID              ID
	Type            string
	Name            string
	Email           string
	Url             string
	PostalAddresses postalAddress
	CreatedAt       time.Time
	UpdatedAt       time.Time
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

//AddPostalAddress add address to organization
func (org *Organization) AddPostalAddress(streetaddress string, postalcode string, addresslocality string) error {

	address := postalAddress{
		StreetAddress:   streetaddress,
		PostalCode:      postalcode,
		AddressLocality: addresslocality,
	}

	if address.StreetAddress == "" {
		return ErrInvalidEntity
	}

	if address.PostalCode == "" {
		return ErrInvalidEntity
	}

	if address.AddressLocality == "" {
		return ErrInvalidEntity
	}

	org.PostalAddresses = address
	org.UpdatedAt = time.Now()
	return nil
}

//RemoveAddress remove address from organization
func (org *Organization) RemoveAddress() error {
	if org.PostalAddresses == (postalAddress{}) {
		return ErrPostalAddressNotSet
	} else {
		org.PostalAddresses = postalAddress{}
	}
	return nil
}

//Validate validate organization entity
func (org *Organization) Validate() error {
	if org.Name == "" {
		return ErrInvalidEntity
	}

	return nil
}
