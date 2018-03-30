import commandService from './command_service';

describe('CommandService', () => {
  let sut;
  let systems;
  let rootScope;

  beforeEach(() => {
    systems = [];
    rootScope = {systems: systems};
    sut = commandService(null, rootScope, null);
  });

  describe('getSystemName', () => {
    it('should determine the system name of a command', () => {
      let command = {system: {id: 123}};
      let system = {id: '123', name: 'test-system'};
      systems.push(system);

      expect(sut.getSystemName(command)).to.equal(system.name);
    });

    it('should handle a system with a display name', () => {
      let command = {system: {id: 123}};
      let system = {id: '123', name: 'test-system', display_name: 'jk'};
      systems.push(system);

      let name = sut.getSystemName(command);
      expect(name).to.equal(system.display_name);
      expect(name).to.not.equal(system.name);
    });
  });

  describe('findSystem', () => {
    it('should return the system with the correct ID', () => {
      let command = {system: {id: 123}};
      let system = {id: '123', name: 'test-system'};

      systems.push({id: '324', name: 'sys1'});
      systems.push(system);
      systems.push({id: '452', name: 'sys3'});

      expect(sut.findSystem(command)).to.equal(system);
    });
  });

  describe('comparison', () => {
    let command1;
    let command2;

    beforeEach(() => {
      systems.push({id: '123', name: 'a'});
      systems.push({id: '456', name: 'b'});
      systems.push({id: '789', name: 'c'});
    });

    it('should order by system first', () => {
      command1 = {name: 'z', system: {id: 123}};
      command2 = {name: 'a', system: {id: 456}};
      expect(sut.comparison(command1, command2)).to.equal(-1);
    });

    it('should order by command second', () => {
      command1 = {name: 'z', system: {id: 123}};
      command2 = {name: 'a', system: {id: 123}};
      expect(sut.comparison(command1, command2)).to.equal(1);
    });

    it('should return 0 for identical commands', () => {
      command1 = {name: 'a', system: {id: 123}};
      command2 = {name: 'a', system: {id: 123}};
      expect(sut.comparison(command1, command2)).to.equal(0);
    });
  });
});
