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
  }

  select({ limit, page, sortColumn, sortDirection }) {
    sortColumn = (sortColumn || this.defaultSortColumn);
    let sortedOpts = this.storage.sort((a, b) => {
      if (a[sortColumn] > b[sortColumn]) return 1;
      if (a[sortColumn] === b[sortColumn]) return 0;
      if (a[sortColumn] < b[sortColumn]) return -1;
    });
    if (sortDirection === 'DESC') sortedOpts = sortedOpts.reverse();
    limit = (+limit || this.defaultLimit);
    page = (+page || this.defaultPage);
    const offset = (page - 1) * limit;
    return sortedOpts.slice(offset, limit + offset)
  }

  selectSaved() {
    return this.storage.filter((item) => {
      return item.saved;
    })
  }

  search({ name }) {
    return this.storage.filter((item) => {
      return item.firstName.toLowerCase().includes(name.toLowerCase())
        || item.lastName.toLowerCase().includes(name.toLowerCase())
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
}

module.exports = Storage;
