const {VM,OP,REGS} = require('./vm'); // Assuming your VM code is in 'your_vm_file.js'

describe('VM Unit Tests', () => {
  let vm;

  beforeEach(() => {
    vm = new VM();
  });

  // Test OP Codes
  describe('OP Codes', () => {
    it('should perform basic arithmetic operations', () => {
      vm.init(new Uint8Array([
        OP.ADD,
        1, // src0 (register)
        2, // src1 (register)
        3, // dst
        OP.HALT // End execution
      ]));
      vm.setReg(1, 10);
      vm.setReg(2, 5);
      vm.run();
      expect(vm.getReg(3)).toBe(15);
    });

    it('should handle comparisons', () => {
      vm.init(new Uint8Array([
        OP.COMP_LESS_THAN, 1, 2, 3, OP.HALT
      ]));
      vm.setReg(1, 5);
      vm.setReg(2, 10);
      vm.run();
      expect(vm.getReg(3)).toBe(1);

      vm.setReg(1, 15);
      vm.run();
      expect(vm.getReg(3)).toBe(0); // 15 is not less than 10
    });
  });

  // Test Bytecode Decoding
  describe('Bytecode Decoding', () => {
    it('should decode basic bytecode', () => {
      const bytecode = new Uint8Array([
        OP.ADD, 1, 2, 3
      ]);
      
      vm.init(bytecode); // Call _init directly for testing
      // ... assert decoded values
    });

    it('should decode strings', () => {
      const bytecode = new Uint8Array([
        [0, 5, 72, 101, 108, 108, 111] 
      ]);
      vm.init(bytecode); 
      const decodedString = vm._loadString();
      expect(decodedString).toBe('Hello'); // Replace with expected string
    });
  });

  // Test Registers and Data Handling
  describe('Registers and Data', () => {
    it('should set and retrieve register values', () => {
      vm.setReg(5, 10);
      expect(vm.getReg(5)).toBe(10);
    });

    it('should load values from registers correctly', () => {
      vm.setReg(1, 5);
      vm.setReg(2, 10);

      // ... bytecode to use values from reg 1 and 2

      vm.run();

      // ... Assertions to verify values were used
   });
    });

  // ... Add more test cases for other VM functionalities
  // (e.g., function calls, jumps, memory access)

});

