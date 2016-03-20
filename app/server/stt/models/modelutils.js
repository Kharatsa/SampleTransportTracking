'use strict';

const keyReference = Model => ({model: Model, key: 'key'});
const uuidReference = Model => ({model: Model, key: 'uuid'});

module.exports = {keyReference, uuidReference};
