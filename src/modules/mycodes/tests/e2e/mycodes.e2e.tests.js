'use strict';

describe('Mycodes E2E Tests:', function () {
  describe('Test Mycodes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/mycodes');
      expect(element.all(by.repeater('mycode in mycodes')).count()).toEqual(0);
    });
  });
});
