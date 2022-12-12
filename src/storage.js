const { faker } = require('@faker-js/faker');
const { HttpError } = require('./helpers/httpError');
const { OPTION_NOT_FOUND } = require('./helpers/errors');

const fakeOpts = () => {
  const arr = [];
  for (let i = 0; i < 50; i++) {
    arr.push({
      id: i + 1,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      saved: false,
    })
  }
  return arr;
}

class Storage {

  constructor () {
    this.storage = fakeOpts();
    this.defaultSortColumn = 'id';
    this.defaultLimit = 10;
    this.defaultPage = 1;
    this.lastOptions = {};
  }

  select({ limit, page, sortColumn, sortDirection, lastOptions, filterFirstName, filterLastName }) {
    if (lastOptions === true) {
      sortDirection = this.lastOptions.sortDirection;
      sortColumn = this.lastOptions.sortColumn;
      filterFirstName = this.lastOptions.filterFirstName;
      filterLastName = this.lastOptions.filterLastName;
    }
    let filteredOpts = this.search({ filterFirstName, filterLastName });

    if (sortColumn) {
      filteredOpts = filteredOpts.sort((a, b) => {
        if (a[sortColumn] > b[sortColumn]) return 1;
        if (a[sortColumn] === b[sortColumn]) return 0;
        if (a[sortColumn] < b[sortColumn]) return -1;
      });
      if (sortDirection === 'desc') filteredOpts = filteredOpts.reverse();
    }
    limit = (+limit || this.defaultLimit);
    page = (+page || this.defaultPage);
    const offset = (page - 1) * limit;
    return {
      items: filteredOpts.slice(offset, limit + offset),
      total: filteredOpts.length,
      sortColumn: sortColumn || '',
      sortDirection: sortDirection || '',
      filterFirstName,
      filterLastName,
    }
  }

  selectSaved() {
    return this.storage.filter((item) => {
      return item.saved;
    })
  }

  search({ filterFirstName, filterLastName }) {
    if (!filterLastName && !filterFirstName) return [...this.storage];
    return this.storage.filter((item) => {
      if (filterFirstName && filterLastName) {
        return item.firstName.toLowerCase().includes(filterFirstName.toLowerCase())
          && item.lastName.toLowerCase().includes(filterLastName.toLowerCase());
      }
      if (filterFirstName) {
        return item.firstName.toLowerCase().includes(filterFirstName.toLowerCase());
      }
      if (filterLastName) {
        return item.lastName.toLowerCase().includes(filterLastName.toLowerCase());
      }
    })
  }

  save({ id }) {
   const index = this.storage.findIndex(item => item.id === id);
   if (index === -1) throw new HttpError(404, OPTION_NOT_FOUND);
   this.storage[index].saved = true;
   return true;
  }

  delete({ id }) {
    const index = this.storage.findIndex(item => item.id === id);
    if (index === -1) throw new HttpError(404, OPTION_NOT_FOUND);
    this.storage[index].saved = false;
    return true;
  }

  setLastOptions ({ sortColumn, sortDirection, filterFirstName, filterLastName }) {
    this.lastOptions = { sortColumn, sortDirection, filterFirstName, filterLastName };
  }

  saveCustomSorted ({ sortedOptions }) {
    this.storage.splice(0, sortedOptions.length, ...sortedOptions);
  }
}

module.exports = Storage;
