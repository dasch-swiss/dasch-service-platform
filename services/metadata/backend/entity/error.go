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

import "errors"

//ErrNotFound not found
var ErrNotFound = errors.New("not found")

//ErrInvalidEntity invalid entity
var ErrInvalidEntity = errors.New("invalid entity")

//ErrCannotBeDeleted cannot be deleted
var ErrCannotBeDeleted = errors.New("cannot be deleted")

//ErrNotEnoughBooks cannot borrow
var ErrNotEnoughBooks = errors.New("not enough books")

//ErrPostalAddressNotSet cannot be deleted
var ErrPostalAddressNotSet = errors.New("postal address is not set")

//ErrBookNotBorrowed cannot return
var ErrBookNotBorrowed = errors.New("book not borrowed")

//ErrCannotAddName cannot add another name to the organization (max three allowed).
var ErrCannotAddName = errors.New("cannot add another name to the organization (max three allowed)")

//ErrCannotAddExistingName cannot add the same name to the organization.
var ErrCannotAddExistingName = errors.New("cannot add the same name to the organization twice")

//ErrCannotDeleteNotFoundName cannot delete the name from the organization, because it was not found.
var ErrCannotDeleteNotFoundName = errors.New("cannot delete name from the organization because it was not found")

//ErrCannotDeleteName cannot delete last name of the organization (needs at least one).
var ErrCannotDeleteName = errors.New("cannot delete last name of the organization (needs at least one)")

//ErrEmailNotSet cannot delete the email because it is not set.
var ErrEmailNotSet = errors.New("email is not set")

//ErrURLNotSet cannot delete the URL because it is not set.
var ErrURLNotSet = errors.New("URL is not set")
